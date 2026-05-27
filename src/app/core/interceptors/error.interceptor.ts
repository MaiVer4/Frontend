import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorDto } from '../models/api-error.dto';

/**
 * ErrorInterceptor
 * 
 * Interceptor HTTP global que centraliza el manejo de errores
 * para todas las peticiones HTTP de la aplicación.
 * 
 * Responsabilidades:
 * - Capturar errores HTTP
 * - Normalizar respuestas de error
 * - Loguear errores en consola
 * - Emitir errores tipados y consistentes
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Maneja errores HTTP y los normaliza
   * @param error - Error HTTP capturado
   * @returns Observable que emite un error normalizado
   */
  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error interceptado:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message
    });

    const apiError = error.error as ApiErrorDto | null;
    const normalizedError = this.normalizeError(error, apiError);

    return throwError(() => normalizedError);
  }

  /**
   * Normaliza el error a un formato consistente
   * @param error - Error HTTP original
   * @param apiError - Cuerpo del error de la API (si existe)
   * @returns Error normalizado con propiedades estándar
   */
  private normalizeError(error: HttpErrorResponse, apiError: ApiErrorDto | null) {
    switch (error.status) {
      case 0:
        return {
          status: 0,
          message: 'No se pudo conectar al servidor. Verifica tu conexión de red.',
          tipo: 'NETWORK_ERROR'
        };

      case 400:
        return {
          status: 400,
          message: apiError?.message ?? 'Solicitud inválida. Revisa los datos enviados.',
          tipo: 'BAD_REQUEST',
          details: apiError
        };

      case 404:
        return {
          status: 404,
          message: apiError?.message ?? 'El recurso solicitado no fue encontrado.',
          tipo: 'NOT_FOUND',
          details: apiError
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          status: error.status,
          message: 'Error del servidor. Por favor, intenta más tarde.',
          tipo: 'SERVER_ERROR',
          details: apiError
        };

      case 408:
        return {
          status: 408,
          message: 'La solicitud tardó demasiado tiempo. Intenta de nuevo.',
          tipo: 'TIMEOUT'
        };

      default:
        const fallbackMessage = apiError?.message ??
          (error.statusText && error.statusText !== 'OK' ? error.statusText : undefined) ??
          'Error desconocido';

        return {
          status: error.status,
          message: fallbackMessage,
          tipo: 'UNKNOWN_ERROR',
          details: apiError
        };
    }
  }
}
