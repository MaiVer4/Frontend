import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';

/**
 * SharedModule
 * 
 * Módulo para componentes, directivas y pipes reutilizables
 * que se usan en múltiples features.
 * 
 * Este módulo debe ser importado en los módulos de features
 * que necesitan componentes compartidos.
 * 
 * Exports: ToastNotificationComponent
 */
@NgModule({
  declarations: [ToastNotificationComponent],
  imports: [CommonModule],
  exports: [CommonModule, ToastNotificationComponent]
})
export class SharedModule {}
