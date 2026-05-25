import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.interface';
import { __param } from 'tslib';


@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    // URL API REST SpringBoot
    private readonly API_URL = 'http://localhost:8080/api/productos';

    constructor(private http: HttpClient) {}

    //Obtener lista completa de productos
    obtenerProductos():  Observable<Producto[]> {
        return this.http.get<Producto[]>(this.API_URL);
    }

    //Crear producto
    crearProducto(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.API_URL, producto)
    }


}