import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SharedModule
 * 
 * Módulo para componentes, directivas y pipes reutilizables
 * que se usan en múltiples features.
 * 
 * Este módulo debe ser importado en los módulos de features
 * que necesitan componentes compartidos.
 * 
 * Exports: (Vacío por ahora - agregar componentes compartidos aquí)
 */
@NgModule({
  imports: [CommonModule],
  exports: [CommonModule]
})
export class SharedModule {}
