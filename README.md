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

---

## 6. Análisis y Puntos de Mejora

Esta sección describe un análisis del estado actual del proyecto, destacando tanto sus fortalezas como las áreas donde se proponen mejoras para futuras versiones. El objetivo es que los futuros desarrolladores puedan continuar el trabajo sobre una base sólida y bien documentada.

### 6.1. Fortalezas del Proyecto

*   **Estructura Clara:** El proyecto presenta una separación bien definida entre el backend (`server`) y el frontend (`src`), facilitando el desarrollo y mantenimiento independiente de cada parte.
*   **Backend Robusto:** El uso de un pool de conexiones de `mysql2`, la sintaxis `async/await` y la implementación de transacciones para las operaciones críticas de la base de datos son prácticas recomendadas que aseguran un buen rendimiento y la integridad de los datos.
*   **Entorno de Desarrollo Moderno:** La configuración con `Vite` para el frontend y `concurrently` para ejecutar ambos servidores simultáneamente ofrece una experiencia de desarrollo fluida y eficiente.
*   **Buena Base de Documentación:** El `README.md` actual ya proporciona una guía de instalación y ejecución clara y completa.

### 6.2. Inconsistencias y Sugerencias de Mejora

A continuación, se detallan los puntos que podrían mejorarse, ordenados por prioridad:

**1. (Crítico) Externalizar Credenciales de la Base de Datos:**
    *   **Inconsistencia:** Las credenciales de la base de datos (usuario y contraseña) están escritas directamente en el código fuente (`server/index.js`). Esto representa un riesgo de seguridad significativo, ya que expone información sensible en el repositorio.
    *   **Sugerencia:** Utilizar un sistema de variables de entorno. Se recomienda crear un archivo `.env` en el directorio `server` para almacenar las credenciales y cargar estas variables en la aplicación utilizando un paquete como `dotenv`. El archivo `.env` debe ser incluido en el `.gitignore` para no ser subido al repositorio.

**2. Eliminar Código Duplicado en Componentes:**
    *   **Inconsistencia:** Existen dos componentes React casi idénticos: `src/components/MaterialForm.jsx` y `src/components/Register/MaterialForm.jsx`. Mantener código duplicado dificulta el mantenimiento, ya que cualquier cambio debe aplicarse en ambos lugares.
    *   **Sugerencia:** Unificar ambos archivos en un solo componente. Se recomienda eliminar `src/components/Register/MaterialForm.jsx` y modificar la página `src/pages/RegisterPage.jsx` para que importe y utilice `src/components/MaterialForm.jsx`.

**3. Mejorar la Configuración de CORS en Producción:**
    *   **Inconsistencia:** El servidor de Express permite peticiones desde cualquier origen (`app.use(cors())`). Aunque esto es útil en desarrollo, es una práctica insegura para un entorno de producción.
    *   **Sugerencia:** Configurar CORS de manera más restrictiva. Se debe crear una "lista blanca" (whitelist) de orígenes permitidos que incluya únicamente el dominio donde se desplegará la aplicación frontend.

**4. Estandarizar el Formato de Errores de la API:**
    *   **Inconsistencia:** El manejo de errores en las rutas de la API no es consistente. Algunas rutas devuelven errores en formato JSON (`{ "message": "..." }`), mientras que otras envían un simple texto plano (`res.status(500).send('Error...')`).
    *   **Sugerencia:** Estandarizar todas las respuestas de error para que devuelvan un objeto JSON. Esto facilita el manejo de errores en el frontend.

**5. Abstraer el Acceso a Datos:**
    *   **Inconsistencia:** Las consultas SQL están escritas directamente dentro de las rutas de Express. A medida que la aplicación crezca, esto puede dificultar el mantenimiento.
    *   **Sugerencia (Opcional):** Considerar la abstracción de la lógica de la base de datos en una capa de servicio o repositorio. A largo plazo, se podría evaluar el uso de un constructor de consultas SQL (Query Builder) como `knex.js` o un ORM (Object-Relational Mapper) como `Sequelize` para mejorar la mantenibilidad.
