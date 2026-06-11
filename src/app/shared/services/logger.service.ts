import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const isProduction = environment.production;

export function logError(...args: unknown[]): void {
  if (!isProduction) {
    console.error(...args);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  debug(...args: unknown[]): void {
    if (!isProduction) {
      console.debug(...args);
    }
  }

  info(...args: unknown[]): void {
    if (!isProduction) {
      console.info(...args);
    }
  }

  warn(...args: unknown[]): void {
    if (!isProduction) {
      console.warn(...args);
    }
  }

  error(...args: unknown[]): void {
    if (!isProduction) {
      console.error(...args);
    }
  }
}
