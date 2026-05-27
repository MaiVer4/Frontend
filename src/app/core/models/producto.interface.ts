export interface Producto {
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    estado: 'ACTIVO' | 'INACTIVO';
    imagenUrl: string;
}