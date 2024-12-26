
# Proyecto de Autenticación y Gestión de Sesiones

Este proyecto implementa un flujo de registro y autenticación con funcionalidades de gestión de sesiones, roles de usuario y protección de datos sensibles. Utiliza tecnologías como **Node.js**, **Prisma**, **bcrypt**, **JWT** y **CSRF tokens** para asegurar la aplicación.

## Herramientas Utilizadas

- **Node.js**: https://nodejs.org/
- **Prisma**: ORM que facilita la interacción con la base de datos.
- **bcrypt**: Para encriptar contraseñas de manera segura.
- **jsonwebtoken (JWT)**: Para gestionar la autenticación de usuarios.
- **CSRF Tokens**: Para proteger las rutas de modificación de datos.

## Instalación del Proyecto

### 1. Clonar el Repositorio

Clona este repositorio en tu máquina local usando el siguiente comando:

```bash
git clone https://github.com/sunn02/LoginPro
cd LoginPro
```

### 2. Instalar Dependencias

Instala las dependencias necesarias con el siguiente comando:

```bash
npm install
```

Este comando instalará todas las dependencias listadas en el archivo `package.json`, incluyendo Prisma, bcrypt, JWT, y otras herramientas.

## Configuración

### 1. Configuración de Prisma

Prisma es un ORM que facilita la interacción con la base de datos. Asegúrate de inicializarlo y configurarlo correctamente.

#### Inicializar Prisma

Ejecuta el siguiente comando para inicializar Prisma y crear los archivos necesarios:

```bash
npx prisma init
```

Esto creará una carpeta llamada `prisma` que contiene el archivo `schema.prisma`, donde se define la configuración y los modelos de la base de datos.

#### Configuración de SQLite

El proyecto utiliza **SQLite**, lo que significa que los datos se almacenan localmente en un archivo (`dev.db`) ubicado en la carpeta del proyecto. 

En el archivo `schema.prisma` dentro de la carpeta `prisma/`, la configuración de la base de datos se define de la siguiente manera:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### Explicación de los campos:
- **`provider`**: Especifica el tipo de base de datos que se utiliza. En este caso, es `sqlite`.
- **`url`**: Indica la ruta al archivo de la base de datos SQLite (`dev.db`). La palabra clave `file:` significa que la base de datos está localizada en el sistema de archivos local. Este archivo será creado automáticamente al ejecutar el siguiente comando.

#### Generar el Cliente de Prisma

Una vez definido el modelo en `schema.prisma`, se genera el cliente de Prisma para interactuar con la base de datos:

```bash
npx prisma generate
```

#### Crear Migraciones

Para crear la base de datos y aplicar las migraciones, usa el siguiente comando:

```bash
npx prisma migrate dev --name init
```

> Nota: La configuración de SQLite utilizada aquí es completamente **local**. 

### 2. Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto, copiando el contenido del archivo `.env.example` y completando las variables necesarias.

Ejemplo de archivo `.env`:

```bash
# .env
JWT_SECRET=SECRETO
SESSION_SECRET=SECRETO2

```

### 3. Configuración de SSL para HTTPS

Para usar HTTPS, se asegura configurar los certificados SSL. Aquí se presenta un ejemplo de cómo es configurado en el código:

```javascript
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.resolve(__dirname, config.ssl.keyPath)),
  cert: fs.readFileSync(path.resolve(__dirname, config.ssl.certPath)),
};
```

Esto garantiza que el servidor use una conexión segura.

## Estructura del Proyecto

La estructura de carpetas y archivos en el proyecto es la siguiente:

```bash
LoginPro/
├── node_modules/             # Dependencias de Node.js
├── prisma/                   # Configuración de Prisma
│   └── schema.prisma         # Definición de la base de datos
├── src/
│   ├── controllers/          # Lógica de negocio (registro, login, etc.)
│   ├── helpers/              # Funciones auxiliares (autenticación, validaciones)
│   ├── routes/               # Definición de las rutas
│   └── config/               # Configuracion incluyendo a los certificados SSL/TLS para HTTPS
├── .env                      # Variables de entorno
├── .env.example              # Plantilla para el archivo .env
├── index.js                 # Archivo principal para iniciar el servidor
└── package.json              # Configuración de dependencias y scripts
```

## Funcionalidades Implementadas

### 1. **Registro y Autenticación**

Los usuarios pueden registrarse con un correo electrónico y una contraseña. Las contraseñas se almacenan de manera segura utilizando **bcrypt**.

### 2. **Gestión de Sesiones**

Se implementa la creación, mantenimiento y eliminación de sesiones utilizando **cookies**. La cookie almacena un identificador único de sesión.

### 3. **Autenticación con JWT**

Al iniciar sesión, el servidor genera un **token JWT** que contiene la información del usuario. Este token se valida en cada solicitud protegida.

### 4. **Roles de Usuario**

Se definen dos roles: **Usuario** y **Administrador**. El acceso a ciertas rutas está restringido dependiendo del rol del usuario.

### 5. **Cifrado y Hashing**

- **Contraseñas**: Se cifran utilizando **bcrypt** para garantizar que las contraseñas nunca se almacenen en texto claro.
- **JWT**: Los datos sensibles dentro de los tokens están cifrados.

### 6. **Prevención de XSS y CSRF**

- **XSS**: Se filtran y escapan las entradas del usuario para prevenir la ejecución de scripts maliciosos.
- **CSRF**: Se utilizan **tokens CSRF** para validar solicitudes que cambian el estado de la aplicación (como la creación de cuentas o el cambio de contraseñas).

### 7. **Limitación de Intentos de Inicio de Sesión**

Para evitar ataques de fuerza bruta, se limita el número de intentos fallidos de inicio de sesión. Las cuentas se bloquean temporalmente después de varios intentos fallidos.

### 8. **Cookies Seguras**

Las cookies se configuran con las flags `HTTP-only` y `Secure` para mejorar la seguridad:

- **HTTP-only**: La cookie no es accesible desde JavaScript.
- **Secure**: La cookie solo se envía a través de conexiones HTTPS.

## Iniciar el Servidor

Para iniciar el servidor, usa el siguiente comando:

```bash
npm run dev
```

Esto iniciará el servidor y reiniciará automáticamente cualquier cambio realizado en el código.
