# Proyecto React – admintle

Este proyecto es una aplicación React creada con Create React App. A partir de esta actualización incorpora un backend en [Laravel 12](https://laravel.com) que expone una API REST alimentada por una base de datos SQLite con los datos de ejemplo que se muestran en las pantallas del módulo docente.

## Requisitos previos
- Node.js (versión LTS recomendada) y npm.
- PHP 8.2 o superior.
- [Composer](https://getcomposer.org/) para administrar las dependencias de Laravel.

## Instalación del frontend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/israbarmar/admintle.git
   ```
2. Acceder al directorio del proyecto:
   ```bash
   cd admintle
   ```
3. Instalar las dependencias de React:
   ```bash
   npm install
   ```

## Instalación del backend (Laravel)

El backend vive en la carpeta `backend/` y utiliza una base de datos SQLite que se almacena en `backend/database/database.sqlite`.

1. Instalar las dependencias de PHP:
   ```bash
   cd backend
   composer install
   ```
2. Crear el archivo de entorno y configurar la URL del frontend (el proxy de Create React App usa `http://localhost:3000`):
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Si necesitas personalizar el origen permitido por CORS edita la variable `FRONTEND_URL` en `.env`.
3. Ejecutar las migraciones y sembrar los datos de ejemplo:
   ```bash
   php artisan migrate --seed
   ```
4. Regresa al directorio raíz si deseas arrancar el frontend:
   ```bash
   cd ..
   ```

## Ejecución en desarrollo

1. Inicia el backend de Laravel. Para que el proxy del frontend funcione se recomienda escuchar en el puerto `4000`:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=4000
   ```
2. En otra terminal, levanta el servidor de desarrollo de React desde la raíz del proyecto:
   ```bash
   npm start
   ```
3. Abre el navegador en `http://localhost:3000`. Las tablas consumirán los endpoints expuestos por Laravel:
   - `GET /api/designaciones`
   - `GET /api/historial-estudiantes`
   - `GET /api/estudiantes`
   - `GET /api/materias`
   - `GET /api/notificaciones?category=actual|anterior|registro`

## Arquitectura del backend

- **Framework**: Laravel 12 configurado con SQLite como motor de base de datos para simplificar la ejecución local.
- **Migraciones**: se definen tablas `designaciones`, `historial_estudiantes`, `estudiantes`, `materias` y `notificaciones` con los campos que ya mostraba el frontend.
- **Seeder**: `DocenteModuleSeeder` inserta registros de ejemplo para todas las tablas, replicando los datos que antes residían en arreglos del cliente.
- **Rutas API**: `routes/api.php` agrupa los endpoints bajo el prefijo `/api` y aplica un middleware personalizado de CORS (`App\Http\Middleware\CorsHeaders`) para aceptar peticiones desde el frontend.
- **CORS**: la cabecera `Access-Control-Allow-Origin` se controla mediante la variable `FRONTEND_URL`, permitiendo adaptar rápidamente el origen en despliegues.

## Construcción para producción

Para generar una versión optimizada del frontend lista para desplegar:
```bash
npm run build
```

El comando creará la carpeta `build` con los archivos finales del cliente. El backend puede desplegarse de forma independiente en cualquier entorno compatible con Laravel y PHP.
