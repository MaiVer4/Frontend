import { Injectable } from '@angular/core';

const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
const isProduction = !isLocalhost;

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
