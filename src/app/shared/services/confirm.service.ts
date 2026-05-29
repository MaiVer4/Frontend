import { Injectable } from '@angular/core';

/**
 * ConfirmService
 * 
 * Servicio de confirmación que abstrae el uso de window.confirm
 * haciendo el código más testeable y permitiendo inyectar
 * confirmaciones personalizadas en el futuro.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  /**
   * Solicita confirmación del usuario mediante un diálogo.
   * Por defecto usa window.confirm, pero permite ser inyectado para tests.
   * @param message - Mensaje a mostrar en el diálogo
   * @returns true si el usuario confirmó, false si canceló
   */
  confirm(message: string): boolean {
    // Implementación abstracta que puede ser inyectada en tests
    return this.showConfirmDialog(message);
  }

  protected showConfirmDialog(message: string): boolean {
    return window.confirm(message);
  }
}
