# GestionProductos

## Descripción general

`GestionProductos` es una aplicación web de administración de inventario desarrollada con Angular 21. Su objetivo es gestionar productos mediante operaciones CRUD (crear, leer, actualizar y eliminar) que se consumen desde un backend REST.

La aplicación ofrece:
- Visualización de un catálogo de productos con estadísticas clave.
- creación y edición de productos mediante un formulario con validación.
- eliminación de productos con confirmación.
- notificaciones visuales de éxito/error.
- comunicación con una API REST externa en `http://localhost:8080`.

## Qué hace el proyecto

El frontend consume el endpoint de productos en el backend y permite:
- listar productos activos e inactivos.
- agregar productos nuevos.
- editar productos existentes.
- eliminar productos.
- mostrar métricas de inventario como unidades en stock y valor total.
- mostrar mensajes al usuario con notificaciones toast.

## Arquitectura y estructura principal

### Estructura de carpetas clave

- `src/app/`
  - `app-module.ts`: módulo raíz que importa `BrowserModule`, `AppRoutingModule` y `CoreModule`.
  - `app-routing.module.ts`: define la ruta principal `productos` y redirige la raíz a esa ruta.
  - `app.ts` / `app.html`: componente raíz que contiene el `router-outlet`.

- `src/app/core/`
  - `core-module.ts`: módulo de núcleo que registra servicios e interceptores globales.
  - `config/api.config.ts`: configuración centralizada de la API con `baseUrl` y rutas de los endpoints.
  - `service/producto.service.ts`: servicio que expone los métodos CRUD hacia el backend.
  - `models/producto.interface.ts`: modelo tipado del producto.
  - `interceptors/error.interceptor.ts`: interceptor para manejo de errores globales.

- `src/app/modules/productos/`
  - `productos-routing.module.ts`: rutas del módulo de productos.
  - `productos.module.ts`: módulo de características para la gestión de productos.
  - `pages/catalogo-dashboard/`: página principal para mostrar lista, estadísticas y controles.
  - `components/producto-form/`: formulario modal para crear y editar productos.

- `src/app/shared/`
  - `shared-module.ts`: módulo compartido que exporta componentes reutilizables.
  - `components/toast-notification/`: componente de notificaciones.
  - `services/confirm.service.ts`: servicio de confirmación nativo.
  - `services/logger.service.ts`: servicio de registro para errores e información.
  - `services/toast-notification.service.ts`: servicio para administrar toasts.

### Flujo de la aplicación

1. El usuario accede a `http://localhost:4200`.
2. `AppRoutingModule` redirige a `productos`.
3. `CatalogoDashboard` carga la lista de productos desde `ProductoService` usando `obtenerProductos()`.
4. Las acciones de la tabla permiten:
   - abrir un modal para crear un producto.
   - editar un producto existente.
   - eliminar un producto con confirmación.
5. El formulario `ProductoForm` valida los datos y emite el producto a guardar.
6. El servicio `ToastNotificationService` muestra mensajes de feedback sobre éxito o error.

## Conexión con el backend

La aplicación está configurada para usar el backend en:

- `http://localhost:8080`

El servicio de productos usa este endpoint:

- `GET /productos`
- `POST /productos`
- `GET /productos/{codigo}`
- `PUT /productos/{codigo}`
- `DELETE /productos/{codigo}`

> Nota: el backend no está incluido en este repositorio. Para que la aplicación funcione correctamente, debe existir un servidor REST compatible ejecutándose en `localhost:8080`.

## Comandos importantes

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm start
```

Abre `http://localhost:4200` en el navegador.

### Compilar para producción

```bash
npm run build
```

Los archivos compilados se generan en la carpeta `dist/`.

### Ejecutar tests

```bash
npm test
```

Este proyecto utiliza Vitest para pruebas unitarias.

## Detalles de implementación

### Validaciones del formulario de producto

El formulario de `ProductoForm` valida:
- `codigo`: requerido, mínimo 3 caracteres.
- `nombre`: requerido.
- `descripcion`: máximo 255 caracteres.
- `imagenUrl`: requerido y debe ser URL válida con `http://` o `https://`.
- `precio` y `cantidad`: requeridos y mayor o igual a 0.
- `estado`: requerido, puede ser `ACTIVO` o `INACTIVO`.

### Modo de actualización optimista

`CatalogoDashboard` aplica patrones de actualización optimista al:
- agregar un producto provisionalmente antes de recibir respuesta del servidor.
- actualizar la lista local antes de confirmar la respuesta.
- eliminar el producto de la vista inmediatamente y revertir si ocurre un error.

Esto mejora la experiencia de usuario al hacer la interfaz más rápida.

### Notificaciones y confirmaciones

- `ToastNotificationService` expone métodos `success`, `error`, `info` y `warning`.
- `ToastNotificationComponent` muestra mensajes que desaparecen automáticamente.
- `ConfirmService` usa `window.confirm()` para solicitudes de eliminación.

## Estructura completa relevante

```text
frontend/
├─ angular.json
├─ package.json
├─ src/
│  ├─ main.ts
│  ├─ styles.css
│  ├─ app/
│  │  ├─ app-module.ts
│  │  ├─ app-routing.module.ts
│  │  ├─ app.ts
│  │  ├─ app.html
│  │  ├─ core/
│  │  │  ├─ core-module.ts
│  │  │  ├─ config/api.config.ts
│  │  │  ├─ interceptors/error.interceptor.ts
│  │  │  ├─ models/producto.interface.ts
│  │  │  └─ service/producto.service.ts
│  │  ├─ modules/productos/
│  │  │  ├─ productos.module.ts
│  │  │  ├─ productos-routing.module.ts
│  │  │  ├─ components/producto-form/
│  │  │  └─ pages/catalogo-dashboard/
│  │  └─ shared/
│  │     ├─ shared-module.ts
│  │     ├─ components/toast-notification/
│  │     └─ services/
```

## Recomendaciones para desarrollo

- Ajusta `src/app/core/config/api.config.ts` si la API se despliega en otra URL.
- Usa `AppRoutingModule` para agregar nuevas rutas de características.
- Importa componentes compartidos en `SharedModule` si quieres reutilizarlos entre módulos.
- Mantén los modelos en `core/models` y las llamadas HTTP en `core/service`.

## Referencias

- Angular CLI: https://angular.dev/cli
- Angular 21: https://angular.dev/
