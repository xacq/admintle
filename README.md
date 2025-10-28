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
   php artisan key:generate
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
   php artisan serve --host=0.0.0.0 --port=4000
   ```
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
- `GET /api/becas` (admite filtros `tutor_id` y `becario_id`)
- `GET /api/becas/options`
- `POST /api/becas`
- `PUT /api/becas/{id}`
- `DELETE /api/becas/{id}`

## Arquitectura del backend

- **Framework**: Laravel 12 configurado para usar PostgreSQL por defecto. El entorno de pruebas continúa ejecutándose sobre SQLite en memoria para mantener la velocidad de los tests automatizados.
- **Migraciones**: se definen tablas `roles`, `users`, `becas`, `designaciones`, `historial_estudiantes`, `estudiantes`, `materias` y `notificaciones` con los campos que requiere cada vista.
- **Seeder**: `DocenteModuleSeeder` inserta roles (con etiquetas “Evaluador” y “Investigador” para tutores y becarios), usuarios de ejemplo y el resto de los registros que antes residían en arreglos del cliente.
- **Rutas API**: `routes/api.php` agrupa los endpoints bajo el prefijo `/api` y aplica un middleware personalizado de CORS (`App\Http\Middleware\CorsHeaders`) para aceptar peticiones desde el frontend.
- **CORS**: la cabecera `Access-Control-Allow-Origin` se controla mediante la variable `FRONTEND_URL`, permitiendo adaptar rápidamente el origen en despliegues.

## Roles y credenciales de ejemplo

Al ejecutar `php artisan migrate --seed` se generan cuatro cuentas con acceso a sus respectivos tableros principales:

| Rol       | Usuario   | Contraseña    | Ruta principal          |
|-----------|-----------|---------------|-------------------------|
| Tutor (Evaluador)    | `tutor`   | `password123` | `/dashboard/tutor`      |
| Becario (Investigador)| `becario` | `password123` | `/dashboard/becario`    |
| Admin     | `admin`   | `password123` | `/dashboard/admin`      |
| Director  | `director`| `password123` | `/dashboard/director`   |

Después de iniciar sesión, el frontend redirige automáticamente al tablero correspondiente usando la información provista por la API.

> ℹ️ El seeder también crea cuentas auxiliares (por ejemplo `samuel`, `ana-investigadora`, `camila`) que se emplean para poblar los listados de tutores y becarios dentro del módulo de becas.

## Gestión de Becas Auxiliares de Investigación

La nueva funcionalidad articula React, Laravel y PostgreSQL para administrar las becas auxiliares:

- **React**: El administrador accede al tablero `/dashboard/admin` y, desde el botón “Gestionar becas”, abre `ListaBecas.js`. Allí puede crear, editar o eliminar registros mediante un formulario modal que muestra catálogos dinámicos de becarios (rol “Investigador”) y tutores (rol “Evaluador”). Las tablas de los demás roles (`DashboardDirector.js`, `DashoboardTutor.js` y `DashoboardBecario.js`) consultan la misma información en modo solo lectura.
- **Laravel**: El controlador `BecaController` expone endpoints REST para listar, filtrar y modificar las becas. Valida que los usuarios seleccionados pertenezcan al rol correcto antes de insertar o actualizar en la tabla `becas`, y sincroniza los cambios con la API de consulta usada por los otros paneles.
- **PostgreSQL**: Al ejecutar `php artisan migrate --seed` se crea la tabla `becas` con las relaciones `becario_id` y `tutor_id` hacia `users`. Todos los registros que aparecen en los dashboards provienen de esta base de datos.

Los tutores solo ven sus becarios asignados, los becarios consultan su propia ficha (incluyendo tutor y estado) y el director obtiene el panorama completo sin permisos de edición. Cualquier cambio realizado por el administrador se replica de inmediato en el resto de vistas al refrescar los datos de la API.

## Construcción para producción

Para generar una versión optimizada del frontend lista para desplegar:
```bash
npm run build
```

El comando creará la carpeta `build` con los archivos finales del cliente. El backend puede desplegarse de forma independiente en cualquier entorno compatible con Laravel y PHP.
