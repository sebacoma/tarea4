# API REST - Gestión de Usuarios

## Descripción
Esta API REST permite gestionar usuarios, ofreciendo funcionalidades para crear, leer, actualizar y eliminar usuarios. La autenticación se realiza mediante JWT para garantizar la seguridad en las operaciones.

## Tecnologías
- **Node.js**
- **Express.js**
- **SQLite** (Base de datos)
- **jsonwebtoken** (Autenticación con JWT)
- **bcrypt** (Hashing de contraseñas)

## Requisitos Previos
- Node.js instalado (versión 14+).
- SQLite3 instalado o usar la biblioteca integrada.

## Configuración del Proyecto

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/sebacoma/tarea4
   cd tarea4
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Configurar la Base de Datos**:
   Ejecuta el archivo `seed.js` para poblar la base de datos con datos de ejemplo:
   ```bash
   node seed.js
   ```
   Esto creará una base de datos SQLite en la carpeta `database/` y generará 100 usuarios.

4. **Iniciar el Servidor**:
   ```bash
   node server.js
   ```
   El servidor estará disponible en `http://localhost:3000`.

## Endpoints

### **Usuarios**
#### `POST /api/users`
- **Descripción**: Crea un nuevo usuario.
- **Cuerpo**:
  ```json
  {
    "nombre": "Juan",
    "apellidos": "Pérez",
    "email": "juan.perez@example.com",
    "password": "123456"
  }
  ```
- **Respuesta**:
  ```json
  {
    "message": "Usuario creado exitosamente.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### `GET /api/users/:id`
- **Descripción**: Obtiene los datos de un usuario específico.
- **Autenticación**: Requiere token JWT en el encabezado.
- **Respuesta**:
  ```json
  {
    "id": "123",
    "nombre": "Juan",
    "apellidos": "Pérez",
    "email": "juan.perez@example.com"
  }
  ```

#### `GET /api/users`
- **Descripción**: Lista todos los usuarios (con paginación).
- **Query Params**:
  - `page`: Número de página.
  - `limit`: Número de usuarios por página.
- **Autenticación**: Requiere token JWT.

#### `PUT /api/users/:id`
- **Descripción**: Actualiza los datos de un usuario.
- **Cuerpo**: Igual al de creación.
- **Autenticación**: Requiere token JWT.

#### `DELETE /api/users/:id`
- **Descripción**: Marca un usuario como eliminado.
- **Autenticación**: Requiere token JWT.

## Pruebas
1. Usa **Postman** para realizar las solicitudes a los endpoints.
2. Incluye el token JWT en los encabezados como:
   ```
   Authorization: Bearer <TOKEN>
   ```

