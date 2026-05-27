import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto.interface';
import { getApiUrl } from '../config/api.config';

/**
 * ProductoService
 * 
 * Servicio para la gestión de productos.
 * Proporciona operaciones CRUD para interactuar con la API REST.
 * 
 * El manejo de errores se realiza de forma centralizada
 * a través del ErrorInterceptor.
 */
@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private readonly API_URL = getApiUrl('productos');

    constructor(private http: HttpClient) {}

    /**
     * Obtiene la lista de todos los productos
     * @returns Observable con array de productos
     */
    obtenerProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.API_URL).pipe(
            map(response => response ?? [])
        );
    }

    /**
     * Crea un nuevo producto
     * @param producto - Datos del producto a crear
     * @returns Observable con el producto creado
     */
    crearProducto(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.API_URL, producto);
    }

    /**
     * Obtiene un producto específico por su código
     * @param codigo - Código único del producto
     * @returns Observable con los datos del producto
     */
    obtenerProducto(codigo: string): Observable<Producto> {
        return this.http.get<Producto>(`${this.API_URL}/${codigo}`);
    }

    /**
     * Actualiza un producto existente
     * @param codigo - Código único del producto
     * @param producto - Datos actualizados del producto
     * @returns Observable con el producto actualizado
     */
    actualizarProducto(codigo: string, producto: Producto): Observable<Producto> {
        return this.http.put<Producto>(`${this.API_URL}/${codigo}`, producto);
    }

    /**
     * Elimina un producto
     * @param codigo - Código único del producto a eliminar
     * @returns Observable con respuesta vacía
     */
    eliminarProducto(codigo: string): Observable<void> {
        return this.http.delete(`${this.API_URL}/${codigo}`, { responseType: 'text' as 'json' }).pipe(
            map(() => undefined)
        );
    }
}
