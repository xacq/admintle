Proyecto React – admintle

Este proyecto es una aplicación React creada con Create React App. Incluye navegación con React Router para mostrar diferentes componentes según la ruta.

Requisitos previos
- Tener instalado Node.js (versión LTS recomendada).
- Tener instalado npm (viene con Node.js) o usar yarn.

Instalación

1. Clonar el repositorio:
   git clone https://github.com/israbarmar/admintle.git

2. Acceder al directorio del proyecto:
   cd admintle

3. Instalar las dependencias:
   npm install
   (o con yarn: yarn install)

4. Instalar React Router (si aún no está en las dependencias o para asegurarse):
   npm install react-router-dom
   (o con yarn: yarn add react-router-dom)

Ejecución del proyecto

Este repositorio ahora incluye una API ligera basada en Express + SQLite para alimentar las tablas del frontend.

1. Iniciar la API (por defecto escucha en el puerto `4000`):
   npm run server

   La primera ejecución creará el archivo `server/admintle.sqlite` con datos de ejemplo.

2. En otra terminal, iniciar el servidor de desarrollo de React:
   npm start

Al iniciar ambos servidores, la aplicación se mostrará en el navegador en:
   http://localhost:3000

Construcción para producción

Para generar una versión optimizada lista para desplegar:
   npm run build

Este comando creará una carpeta `build` con los archivos finales listos para producción.


