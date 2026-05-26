import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Producto } from '../../../../core/models/producto.interface';
import { ProductoService } from '../../../../core/service/producto.service';

@Component({
  selector: 'app-catalogo-dashboard',
  standalone: false,
  templateUrl: './catalogo-dashboard.html',
  styleUrl: './catalogo-dashboard.css',
})
export class CatalogoDashboard implements OnInit {
  productos: Producto[] = [];
  mostrarModal = false;
  productoSeleccionado?: Producto | null;
  errorMessage?: string;
  loading = false;

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef) {}

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
    this.errorMessage = undefined;

    this.productoService.obtenerProductos().subscribe({
      next: data => {
        this.productos = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.loading = false;
        this.errorMessage = this.extractErrorMessage(err) || 'No se pudo cargar la lista de productos. Verifica el backend en http://localhost:8080';
        console.error('Error cargando productos', err);
        this.cdr.markForCheck();
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
        this.cargarProductos();
        setTimeout(() => {
          this.mostrarModal = false;
          this.cdr.markForCheck();
        });
      },
      error: err => {
        this.errorMessage = this.extractErrorMessage(err) || 'No se pudo crear el producto. Revisa la conexión con el backend.';
        console.error('Error creando producto', err);
        this.cdr.markForCheck();
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
        this.cargarProductos();
        setTimeout(() => {
          this.mostrarModal = false;
          this.productoSeleccionado = null;
          this.cdr.markForCheck();
        });
      },
      error: err => {
        this.errorMessage = this.extractErrorMessage(err) || 'No se pudo actualizar el producto. Revisa la conexión con el backend.';
        console.error('Error actualizando producto', err);
        this.cdr.markForCheck();
      }
    });
  }

  eliminar(codigo: string): void {
    this.productoService.eliminarProducto(codigo).subscribe({
      next: () => this.cargarProductos(),
      error: err => {
        this.errorMessage = this.extractErrorMessage(err) || 'No se pudo eliminar el producto. Revisa la conexión con el backend.';
        console.error('Error eliminando producto', err);
        this.cdr.markForCheck();
      }
    });
  }

  private extractErrorMessage(error: any): string | undefined {
    return error?.message || error?.error?.message;
  }

  private createDemoProductos(): Producto[] {
    return [
      {
        codigo: 'PROD-001',
        nombre: 'Café Intenso',
        descripcion: 'Café molido de tueste oscuro, 500 g.',
        precio: 12.5,
        cantidad: 24,
        estado: 'ACTIVO',
        imagenUrl: 'https://via.placeholder.com/120'
      },
      {
        codigo: 'PROD-002',
        nombre: 'Té Verde',
        descripcion: 'Bolsitas de té verde natural con menta.',
        precio: 8.9,
        cantidad: 14,
        estado: 'ACTIVO',
        imagenUrl: 'https://via.placeholder.com/120'
      },
      {
        codigo: 'PROD-003',
        nombre: 'Jarabe de Maple',
        descripcion: 'Sirope de maple orgánico, 250 ml.',
        precio: 15.75,
        cantidad: 0,
        estado: 'INACTIVO',
        imagenUrl: 'https://via.placeholder.com/120'
      }
    ];
  }
}
