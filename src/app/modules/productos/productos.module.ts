import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 

import { ProductosRoutingModule } from './productos-routing.module';
import { CatalogoDashboard } from './pages/catalogo-dashboard/catalogo-dashboard';
import { ProductoForm } from './components/producto-form/producto-form';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [CatalogoDashboard, ProductoForm],
  imports: [CommonModule, ProductosRoutingModule, ReactiveFormsModule, SharedModule]
})
export class ProductosModule {}
