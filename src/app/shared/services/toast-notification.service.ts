import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private toastCounter = 0;
  private timeoutIds: Map<string, NodeJS.Timeout> = new Map();

  getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  success(message: string, duration = 3000): string {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): string {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): string {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000): string {
    return this.show(message, 'warning', duration);
  }

  private show(message: string, type: Toast['type'], duration: number = 3000): string {
    const id = `toast-${++this.toastCounter}`;
    const toast: Toast = { id, message, type, duration };

    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, toast]);

    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        this.remove(id);
      }, duration);
      this.timeoutIds.set(id, timeoutId);
    }

    return id;
  }

  remove(id: string): void {
    const timeoutId = this.timeoutIds.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(id);
    }
    const currentToasts = this.toasts$.value;
    this.toasts$.next(currentToasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeoutIds.clear();
    this.toasts$.next([])
  }
}
