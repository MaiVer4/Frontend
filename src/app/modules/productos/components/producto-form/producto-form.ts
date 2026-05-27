import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../core/models/producto.interface';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css'],
})
export class ProductoForm implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Producto>();
  @Input() producto?: Producto | null;

  productoForm!: FormGroup;

  private static readonly DEFAULT_RESET = { estado: 'ACTIVO', precio: 0, cantidad: 0 };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto']) {
      if (!this.productoForm) {
        this.initForm();
      }
      if (this.producto) {
        this.productoForm.patchValue(this.producto);
      } else {
        this.productoForm.reset(ProductoForm.DEFAULT_RESET);
      }
    }
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(255)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      estado: ['ACTIVO', Validators.required],
      imagenUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  guardar(): void {
    if (this.productoForm.valid) {
      const producto: Producto = this.productoForm.value as Producto;
      this.onSave.emit(producto);
      this.cancelar();
    }
  }

  cancelar(): void {
    this.productoForm.reset(ProductoForm.DEFAULT_RESET);
    this.onClose.emit();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productoForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (control.errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['min']) {
      return `${this.getFieldLabel(fieldName)} no puede ser menor a ${control.errors['min'].min}`;
    }
    if (control.errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} no puede exceder ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    if (control.errors['pattern']) {
      if (fieldName === 'imagenUrl') {
        return 'La URL debe comenzar con http:// o https://';
      }
      return `${this.getFieldLabel(fieldName)} tiene un formato inválido`;
    }

    return 'Campo inválido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      codigo: 'Código',
      nombre: 'Nombre',
      descripcion: 'Descripción',
      precio: 'Precio',
      cantidad: 'Cantidad',
      estado: 'Estado',
      imagenUrl: 'URL de la Imagen'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.productoForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }
}
