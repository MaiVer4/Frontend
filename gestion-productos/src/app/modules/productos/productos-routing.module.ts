import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoDashboard } from './pages/catalogo-dashboard/catalogo-dashboard';

const routes: Routes = [
  {
    path: '',
    component: CatalogoDashboard
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
