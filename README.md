# Proyecto React – admintle

Este proyecto es una aplicación React creada con Create React App. A partir de esta actualización incorpora un backend en [Laravel 12](https://laravel.com) que expone una API REST respaldada por PostgreSQL con los datos de ejemplo que se muestran en las pantallas del módulo docente y los nuevos tableros por rol.

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

El backend vive en la carpeta `backend/` y utiliza PostgreSQL como motor de base de datos. Puedes emplear una instancia local o un contenedor Docker; únicamente asegúrate de contar con un usuario que tenga permisos de creación sobre la base definida en `.env`.

1. Instalar las dependencias de PHP:
   ```bash
   cd backend
   composer install
   ```
2. Crear el archivo de entorno y configurar la URL del frontend (el proxy de Create React App usa `http://localhost:3000`). Ajusta las variables de conexión a PostgreSQL según tu entorno:
   ```bash
   cp .env.example .env
   editar o eliminar becas
   ```
   Si necesitas personalizar el origen permitido por CORS edita la variable `FRONTEND_URL` en `.env`.
3. Asegúrate de que la base de datos indicada en `DB_DATABASE` exista (por ejemplo `createdb admintle` en una terminal) y luego ejecuta las migraciones y siembra de datos:
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
   php artisan serve --host=127.0.0.1 --port=4000
   
2. En otra terminal, levanta el servidor de desarrollo de React desde la raíz del proyecto:
   ```bash
   npm start
   ```
3. Abre el navegador en `http://localhost:3000`. Las tablas y paneles consumirán los endpoints expuestos por Laravel:
   - `GET /api/designaciones`
   - `GET /api/historial-estudiantes`
   - `GET /api/estudiantes`
   - `GET /api/materias`
   - `GET /api/notificaciones?category=actual|anterior|registro`
   - `POST /api/login`

## Arquitectura del backend

- **Framework**: Laravel 12 configurado para usar PostgreSQL tanto en la aplicación como en las pruebas automatizadas; asegúrate de definir una base específica para testing si la necesitas.
- **Migraciones**: se definen tablas `roles`, `users`, `designaciones`, `historial_estudiantes`, `estudiantes`, `materias` y `notificaciones` con los campos que requiere cada vista.
- **Seeder**: `DocenteModuleSeeder` inserta roles, usuarios de ejemplo y el resto de los registros que antes residían en arreglos del cliente.
- **Rutas API**: `routes/api.php` agrupa los endpoints bajo el prefijo `/api` y aplica un middleware personalizado de CORS (`App\Http\Middleware\CorsHeaders`) para aceptar peticiones desde el frontend.
- **CORS**: la cabecera `Access-Control-Allow-Origin` se controla mediante la variable `FRONTEND_URL`, permitiendo adaptar rápidamente el origen en despliegues.

## Roles y credenciales de ejemplo

Al ejecutar `php artisan migrate --seed` se generan cuatro cuentas con acceso a sus respectivos tableros principales:

| Rol       | Usuario   | Contraseña    | Ruta principal          |
|-----------|-----------|---------------|-------------------------|
| Tutor     | `tutor`   | `password123` | `/dashboard/tutor`      |
| Becario   | `becario` | `password123` | `/dashboard/becario`    |
| Admin     | `admin`   | `password123` | `/dashboard/admin`      |
| Director  | `director`| `password123` | `/dashboard/director`   |

Después de iniciar sesión, el frontend redirige automáticamente al tablero correspondiente usando la información provista por la API.

## Construcción para producción

Para generar una versión optimizada del frontend lista para desplegar:
```bash
npm run build
```

El comando creará la carpeta `build` con los archivos finales del cliente. El backend puede desplegarse de forma independiente en cualquier entorno compatible con Laravel y PHP.
