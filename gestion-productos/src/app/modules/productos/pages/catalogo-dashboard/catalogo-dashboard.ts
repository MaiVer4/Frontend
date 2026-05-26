import { Component, OnInit } from '@angular/core';
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

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(data => this.productos = data);
  }

  registrarNuevo(producto: Producto): void {
    this.productoService.crearProducto(producto).subscribe(() => {
      this.cargarProductos();
      this.mostrarModal = false;
    });
  }
}
