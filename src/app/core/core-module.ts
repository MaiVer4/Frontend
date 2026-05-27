import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';

/**
 * CoreModule
 * 
 * Módulo raíz para servicios globales de la aplicación.
 * Este módulo se importa solo una vez en el AppModule.
 * 
 * Interceptores:
 * - ErrorInterceptor: Manejo centralizado de errores HTTP
 */
@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
