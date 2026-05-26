import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 

import { ProductosRoutingModule } from './productos-routing.module';
import { CatalogoDashboard } from './pages/catalogo-dashboard/catalogo-dashboard';
import { ProductoForm } from './components/producto-form/producto-form';

@NgModule({
  declarations: [CatalogoDashboard, ProductoForm],
  imports: [CommonModule, ProductosRoutingModule, ReactiveFormsModule]
})
export class ProductosModule {}
