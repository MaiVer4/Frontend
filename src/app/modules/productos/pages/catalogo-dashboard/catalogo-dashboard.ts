import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { Producto } from '../../../../core/models/producto.interface';
import { ProductoService } from '../../../../core/service/producto.service';
import { ToastNotificationService } from '../../../../shared/services/toast-notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { LoggerService } from '../../../../shared/services/logger.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-catalogo-dashboard',
  standalone: false,
  templateUrl: './catalogo-dashboard.html',
  styleUrls: ['./catalogo-dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogoDashboard implements OnInit, OnDestroy {
  productos: Producto[] = [];
  mostrarModal = false;
  productoSeleccionado?: Producto | null;
  loading = false;
  private destroyed$ = new Subject<void>();
  private readonly STORAGE_KEY = 'gestion-app:productos';

  constructor(
    private productoService: ProductoService,
    private toastService: ToastNotificationService,
    private confirmService: ConfirmService,
    private logger: LoggerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.restoreCachedProductos();
    this.cargarProductos();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.urlAfterRedirects.includes('/productos')),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.cargarProductos();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  get activos(): number {
    return this.productos.filter(p => p.estado === 'ACTIVO').length;
  }

  get inactivos(): number {
    return this.productos.filter(p => p.estado === 'INACTIVO').length;
  }

  get unidadesStock(): number {
    return this.productos.reduce((sum, p) => sum + p.cantidad, 0);
  }

  get valorInventario(): number {
    return this.productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  }

  trackByProductoCodigo(index: number, producto: Producto): string {
    return producto.codigo;
  }

  cargarProductos(): void {
    this.loading = true;

    this.productoService.obtenerProductos().subscribe({
      next: data => {
        this.productos = data;
        this.cacheProductos(data);
        this.loading = false;
      },
      error: err => {
        if (!this.productos.length) {
          this.restoreCachedProductos();
        }
        this.loading = false;
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo cargar la lista de productos. Verifica el backend en http://localhost:8080';
        this.toastService.error(errorMessage, 5000);
        this.logger.error('Error cargando productos', err);
      }
    });
  }

  abrirNuevo(): void {
    this.productoSeleccionado = null;
    this.mostrarModal = true;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23eee" width="100%" height="100%"/><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="%23999" font-size="12">No image</text></svg>';
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  guardarDesdeForm(producto: Producto): void {
    if (this.productoSeleccionado?.codigo) {
      this.actualizar(producto);
    } else {
      this.registrarNuevo(producto);
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

  registrarNuevo(producto: Producto): void {
    // Guardamos copia para revertir si falla
    const previous = [...this.productos];

    // Actualización optimista: añadimos el producto localmente para que sea visible inmediatamente
    this.productos = [producto, ...this.productos];
    this.cacheProductos(this.productos);

    // Cerramos modal y mostramos notificación de éxito inmediata
    this.mostrarModal = false;
    const toastId = this.toastService.success(`Producto "${producto.nombre}" creado exitosamente`);

    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        // Refrescar desde servidor para obtener datos canónicos
        this.cargarProductos();
      },
      error: err => {
        // Revertir si falla
        this.productos = previous;
        this.cacheProductos(previous);
        this.toastService.remove(toastId);
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo crear el producto. Revisa la conexión con el backend.';
        this.toastService.error(errorMessage);
        this.logger.error('Error creando producto', err);
      }
    });
  }

  editar(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  actualizar(producto: Producto): void {
    const codigo = this.productoSeleccionado?.codigo;
    if (!codigo) return;
    // Guardamos copia para poder revertir si es necesario
    const previous = [...this.productos];

    // Actualización optimista: actualizamos la lista localmente
    const idx = this.productos.findIndex(p => p.codigo === codigo);
    if (idx >= 0) {
      const updatedLocal = { ...this.productos[idx], ...producto };
      this.productos = this.productos.map(p => p.codigo === codigo ? updatedLocal : p);
      this.cacheProductos(this.productos);
    }

    // Cerramos modal y notificamos éxito inmediatamente
    this.mostrarModal = false;
    const toastId = this.toastService.success(`Producto "${producto.nombre}" actualizado exitosamente`);

    this.productoService.actualizarProducto(codigo, producto).subscribe({
      next: () => {
        this.productoSeleccionado = null;
        this.cargarProductos();
      },
      error: err => {
        // Revertir cambios locales
        this.productos = previous;
        this.cacheProductos(previous);
        this.toastService.remove(toastId);
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo actualizar el producto. Revisa la conexión con el backend.';
        this.toastService.error(errorMessage);
        this.logger.error('Error actualizando producto', err);
      }
    });
  }

  eliminar(codigo: string): void {
    const index = this.productos.findIndex(p => p.codigo === codigo);
    const productName = index >= 0 ? this.productos[index].nombre : 'Producto';
    const confirmDelete = this.confirmService.confirm(`¿Está seguro que desea eliminar "${productName}"? Esta acción no se puede deshacer.`);

    if (!confirmDelete) return;

    // Guardamos copia para poder revertir en caso de fallo
    const previous = [...this.productos];

    // Actualización optimista de la UI: removemos localmente inmediatamente
    this.productos = this.productos.filter(p => p.codigo !== codigo);
    this.cacheProductos(this.productos);

    // Notificación instantánea al usuario
    const toastId = this.toastService.success(`Producto "${productName}" eliminado correctamente`);

    this.productoService.eliminarProducto(codigo).subscribe({
      next: () => {
        // Refrescamos desde el servidor para mantener sincronía
        this.cargarProductos();
      },
      error: err => {
        // Revertir cambios locales si falla la eliminación
        this.productos = previous;
        this.cacheProductos(previous);
        this.toastService.remove(toastId);
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo eliminar el producto. Revisa la conexión con el backend.';
        this.toastService.error(errorMessage);
        this.logger.error('Error eliminando producto', err);
      }
    });
  }

private cacheProductos(productos: Producto[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(productos));
    } catch {
      // Ignorar si el almacenamiento no está disponible
    }
  }

  private restoreCachedProductos(): void {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        const productos = JSON.parse(cached) as Producto[];
        if (Array.isArray(productos) && productos.length > 0) {
          this.productos = productos;
        }
      }
    } catch {
      // Ignorar si el almacenamiento no está disponible o el JSON es inválido.
    }
  }

  private extractErrorMessage(error: HttpErrorResponse | any): string | undefined {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || error.message;
    }
    return error?.message || error?.error?.message;


}
