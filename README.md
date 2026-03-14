# Sistema de Gestión de Pañol

## 1. Introducción

El Sistema de Gestión de Pañol es una aplicación web full-stack diseñada para la administración y el seguimiento del inventario de materiales en un entorno de taller. El sistema permite la gestión de materiales, talleres, docentes y rotaciones, y provee un dashboard para la visualización del estado del stock en tiempo real.

## 2. Pila Tecnológica

La aplicación está construida utilizando la siguiente pila tecnológica:

-   **Frontend:**
    -   React 19
    -   Vite
    -   React Router
    -   Tailwind CSS
-   **Backend:**
    -   Node.js
    -   Express
    -   mysql2
-   **Base de Datos:**
    -   MySQL

---

## 3. Guía de Configuración del Entorno

Para configurar el proyecto en un entorno de desarrollo local, siga/sigan los siguientes pasos.

### 3.1. Requisitos Previos

-   Node.js (versión 18.x o superior)
-   Un gestor de paquetes Npm
-   Una instancia de servidor de base de datos MySQL (Xampp).

### 3.2. Instalación y Configuración

**Paso 1: Clonar el repositorio**

```bash
git clone https://github.com/usuario/Sistema-de-gestion-paniol.git
cd Sistema-de-gestion-paniol
```

**Paso 2: Instalar las dependencias**

Ejecute el siguiente comando para instalar las dependencias de Node.js para el cliente y el servidor.

```bash
npm install
```

**Paso 3: Configurar la base de datos**

1.  **Creación de la Base de Datos:** Inicie una sesión en su cliente de MySQL y cree una nueva base de datos con el nombre `gestion_paniol`.

2.  **Importación del Esquema:** Importe el archivo `gestion_paniol.sql`, ubicado en el directorio raíz del proyecto, en la base de datos recién creada. Este archivo contiene el esquema de tablas, vistas y relaciones necesarias.

3.  **Configuración de las Credenciales:** Modifique el archivo `server/index.js` para establecer las credenciales de conexión a su base de datos. Localice el objeto `dbConfig` y actualice los campos `user` y `password`.

    ```javascript
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '', // Ingrese su contraseña de MySQL
        database: 'gestion_paniol',
        // ...
    };
    ```

## 4. Ejecución del Proyecto

Para iniciar la aplicación en modo de desarrollo, ejecute el siguiente comando. Este iniciará simultáneamente el servidor de backend y el servidor de desarrollo de Vite para el frontend.

```bash
npm run start
```

-   El servidor de backend estará disponible en `http://localhost:3001`.
-   El servidor de desarrollo de frontend estará disponible en `http://localhost:5173`.

Abra un navegador web y navegue a la dirección del servidor de frontend para acceder a la aplicación.

## 5. Scripts del Proyecto

El archivo `package.json` define los siguientes scripts para la automatización de tareas:

-   `npm run start`: Inicia el servidor de backend y el de frontend en modo de desarrollo.
-   `npm run server`: Inicia únicamente el servidor de backend.
-   `npm run dev`: Inicia únicamente el servidor de desarrollo de frontend.
-   `npm run build`: Compila la aplicación de frontend para producción. Los artefactos se generan en el directorio `dist/`.
-   `npm run lint`: Ejecuta el linter (ESLint) para analizar el código fuente.
