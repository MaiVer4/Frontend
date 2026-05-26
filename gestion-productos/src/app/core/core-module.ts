import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductoService } from './service/producto.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';

/**
 * CoreModule
 * 
 * Módulo raíz para servicios globales de la aplicación.
 * Este módulo se importa solo una vez en el AppModule.
 * 
 * Servicios provistos:
 * - ProductoService: API REST para operaciones CRUD de productos
 * 
 * Interceptores:
 * - ErrorInterceptor: Manejo centralizado de errores HTTP
 */
@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    ProductoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
