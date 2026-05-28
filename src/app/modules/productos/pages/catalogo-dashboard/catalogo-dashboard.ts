import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../../core/models/producto.interface';
import { ProductoService } from '../../../../core/service/producto.service';
import { ToastNotificationService } from '../../../../shared/services/toast-notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-catalogo-dashboard',
  standalone: false,
  templateUrl: './catalogo-dashboard.html',
  styleUrls: ['./catalogo-dashboard.css'],
})
export class CatalogoDashboard implements OnInit {
  productos: Producto[] = [];
  mostrarModal = false;
  productoSeleccionado?: Producto | null;
  loading = false;

  constructor(
    private productoService: ProductoService,
    private toastService: ToastNotificationService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
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

  cargarProductos(): void {
    this.loading = true;

    this.productoService.obtenerProductos().subscribe({
      next: data => {
        this.productos = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo cargar la lista de productos. Verifica el backend en http://localhost:8080';
        this.toastService.error(errorMessage, 5000);
        console.error('Error cargando productos', err);
      }
    });
  }

  abrirNuevo(): void {
    this.productoSeleccionado = null;
    this.mostrarModal = true;
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
    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        this.toastService.success(`Producto "${producto.nombre}" creado exitosamente`);
        this.cargarProductos();
        this.mostrarModal = false;
      },
      error: err => {
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo crear el producto. Revisa la conexión con el backend.';
        this.toastService.error(errorMessage);
        console.error('Error creando producto', err);
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

    this.productoService.actualizarProducto(codigo, producto).subscribe({
      next: () => {
        this.toastService.success(`Producto "${producto.nombre}" actualizado exitosamente`);
        this.cargarProductos();
        this.mostrarModal = false;
        this.productoSeleccionado = null;
      },
      error: err => {
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo actualizar el producto. Revisa la conexión con el backend.';
        this.toastService.error(errorMessage);
        console.error('Error actualizando producto', err);
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

    this.productoService.eliminarProducto(codigo).subscribe({
      next: () => {
        this.toastService.success(`Producto "${productName}" eliminado correctamente`);
        // Refrescamos desde el servidor para mantener sincronía
        this.cargarProductos();
      },
      error: err => {
        // Revertir cambios locales si falla la eliminación
        this.productos = previous;
        const errorMessage = this.extractErrorMessage(err) || 'No se pudo eliminar el producto. Revisa la conexión con el backend.';
        this.toastService.error(errorMessage);
        console.error('Error eliminando producto', err);
      }
    });
  }

  private extractErrorMessage(error: any): string | undefined {
    return error?.message || error?.error?.message;
  }

} 
