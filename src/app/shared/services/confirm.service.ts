import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

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
  private requestSubject = new Subject<{ message: string; title: string; resolve: (value: boolean) => void } | null>();

  confirm(message: string, title = 'Confirmar'): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.requestSubject.next({ message, title, resolve });
    });
  }

  clearRequest(): void {
    this.requestSubject.next(null);
  }

  getRequest(): Observable<{ message: string; title: string; resolve: (value: boolean) => void } | null> {
    return this.requestSubject.asObservable();
  }
}
