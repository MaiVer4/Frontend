import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../core/core/services/producto';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  @Input() isVisble: boolean= false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Producto>();

  productoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(200)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      estado: ['ACTIVO', Validators.required],
      imagenUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  guardar(): void {
    if (this.productoForm.valid) {
      this.onSave.emit(this.productoForm.value);
      this.cancelar();
    }
  }

  cancelar(): void {
      this.productoForm.reset({ estado: 'ACTIVO', precio: 0, cantidad: 0});
      this.onClose.emit();
  }
}
