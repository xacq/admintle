## Backend overview

This directory contains the Laravel 12 backend that powers the Admintle platform. The project ships with a curated database schema and seed data that model becas, reportes y notificaciones del módulo docente.

The instructions below document the verified workflow for preparing the database locally. They are based on the steps executed while checking that the migrations and seeders run successfully in this repository.

## Requisitos previos

- PHP 8.2+
- Composer
- Extensión `pdo_sqlite` (para entornos locales rápidos) o un servidor PostgreSQL compatible

## Configuración rápida con SQLite

1. Copia el archivo de entorno y genera la clave de la aplicación:

   ```bash
   cd backend
   cp .env.example .env
   php artisan key:generate
   ```

2. Edita `.env` para apuntar a SQLite (útil cuando no tienes PostgreSQL disponible):

   ```ini
   DB_CONNECTION=sqlite
   DB_DATABASE="/ruta/absoluta/al/proyecto/backend/database/database.sqlite"
   ```

   Asegúrate de crear el archivo vacío con `touch database/database.sqlite`.

3. Instala las dependencias de Composer y ejecuta las migraciones con los seeders incluidos:

   ```bash
   composer install
   php artisan migrate:fresh --seed
   ```

Tras completar estos pasos verás todas las migraciones marcadas como ejecutadas (`php artisan migrate:status`) y la base de datos cargada con los usuarios, roles, becas y demás registros de ejemplo.

## Uso con PostgreSQL

Si prefieres trabajar con PostgreSQL, actualiza los valores `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` y `DB_SCHEMA` del `.env` para que apunten a tu instancia. El resto del flujo (`composer install`, `php artisan migrate:fresh --seed`) se mantiene igual.

## Ejecutar pruebas

Una vez inicializada la base de datos puedes ejecutar la suite de pruebas del backend con:

```bash
php artisan test
```

> Nota: se recomienda utilizar la base de datos en memoria que proporciona Laravel para las pruebas (`phpunit.xml` ya está configurado para ello).

---

Para más información sobre Laravel consulta la [documentación oficial](https://laravel.com/docs).
