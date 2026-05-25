import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing-module';
import { CatalogoDashboard } from './pages/catalogo-dashboard/catalogo-dashboard';

@NgModule({
  declarations: [CatalogoDashboard],
  imports: [CommonModule, ProductosRoutingModule],
})
export class ProductosModule {}
