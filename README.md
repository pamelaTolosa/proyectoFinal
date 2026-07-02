# ⏳ Tiempo Solidario - Backend
# 📖 Descripción

**Tiempo Solidario** es una API REST desarrollada con **NestJS** cuyo objetivo es administrar una plataforma de intercambio solidario donde los usuarios pueden compartir conocimientos, ofrecer cursos, registrar horas de colaboración y valorar las experiencias realizadas.

El sistema fue diseñado utilizando una arquitectura modular que facilita el mantenimiento, la escalabilidad y la reutilización del código.

---

# 🎯 Objetivos

- Administrar usuarios.
- Gestionar cursos solidarios.
- Registrar horas de colaboración.
- Administrar una billetera de tiempo.
- Permitir la comunicación entre usuarios.
- Gestionar notificaciones.
- Registrar valoraciones.
- Implementar autenticación segura mediante JWT.

---

# 🛠 Tecnologías utilizadas

## Backend

- NestJS
- Node.js
- TypeScript
- Express

## Base de Datos

- MySQL
- TypeORM

## Seguridad

- JWT (JSON Web Token)
- Passport
- bcrypt

## Validaciones

- class-validator
- class-transformer

## Variables de entorno

- dotenv

## Control de versiones

- Git
- GitHub

## Despliegue

- Render (Backend)
- Railway (Base de datos)

## Herramientas de prueba

- Postman

---

# 🏗 Arquitectura

El proyecto sigue la arquitectura modular recomendada por NestJS.

```
Cliente

↓

Controller

↓

Service

↓

Repository (TypeORM)

↓

MySQL
```

Cada módulo contiene:

- Controller
- Service
- DTO
- Entity
- Module

Esta estructura permite mantener una correcta separación de responsabilidades.

---

# 📂 Estructura del proyecto

```
src
│
├── auth
│
├── usuarios
│
├── cursos
│
├── mensajes
│
├── registro-horas
│
├── billetera
│
├── valoraciones
│
├── notificaciones
│
├── app.module.ts
│
├── main.ts
│
└── database
```

---

# ⚙ Funcionalidades

## Usuarios

- Crear usuarios.
- Consultar usuarios.
- Actualizar información.
- Eliminar usuarios.

---

## Cursos

- Publicar cursos.
- Consultar cursos.
- Editar cursos.
- Eliminar cursos.

---

## Registro de Horas

Permite registrar las horas de colaboración realizadas por cada usuario.

---

## Billetera

Controla el saldo de horas disponible para cada usuario.

---

## Mensajes

Permite la comunicación entre usuarios registrados.

---

## Valoraciones

Los usuarios pueden calificar la experiencia obtenida luego de cada intercambio.

---

## Notificaciones

Genera avisos importantes dentro del sistema.

---

# 🔒 Seguridad

La API implementa diferentes mecanismos de seguridad.

- Autenticación mediante JWT.
- Passport como estrategia de autenticación.
- Contraseñas cifradas utilizando bcrypt.
- Validación de datos mediante DTO.
- Variables de entorno para proteger información sensible.

---

# 🗄 Base de datos

Se utiliza MySQL como motor de base de datos.

La persistencia se realiza mediante TypeORM, el cual permite trabajar con entidades de TypeScript sin escribir consultas SQL manualmente.

Cada Entity representa una tabla de la base de datos.

---

# ☁ Despliegue

## Backend

El backend fue desplegado utilizando **Render**, permitiendo acceder a la API desde Internet sin necesidad de ejecutarla localmente.

Características:

- Despliegue automático desde GitHub.
- Actualización automática con cada Push.
- Configuración mediante variables de entorno.
- Servicio disponible en la nube.

---

## Base de Datos

La base de datos fue alojada en **Railway**.

Ventajas:

- Base de datos MySQL en la nube.
- Configuración sencilla.
- Conexión mediante variables de entorno.
- Alta disponibilidad.

---

# 🔑 Variables de entorno

Ejemplo:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

JWT_SECRET=
JWT_EXPIRES_IN=
```

---

# 🚀 Instalación

Clonar el repositorio

```bash
git clone https://github.com/usuario/repositorio.git
```

Instalar dependencias

```bash
npm install
```

Ejecutar en desarrollo

```bash
npm run start:dev
```

Compilar

```bash
npm run build
```

Producción

```bash
npm run start:prod
```

---

# 📌 Scripts

```bash
npm run start

npm run start:dev

npm run build

npm run start:prod

npm run lint

npm run test
```

---

# 📡 Endpoints de la API

## 🔐 Autenticación

La autenticación se encuentra dentro del módulo **Usuarios**.

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | `/usuarios/login` | Iniciar sesión |

---

## 👤 Usuarios

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/usuarios` | Obtener todos los usuarios |
| GET | `/usuarios/:id` | Obtener un usuario por ID |
| GET | `/usuarios/:id/saldo` | Obtener el saldo de horas del usuario |
| GET | `/usuarios/dni/:dni` | Buscar un usuario por DNI |
| POST | `/usuarios` | Registrar un nuevo usuario |
| POST | `/usuarios/login` | Iniciar sesión |

---

## 📚 Cursos

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/cursos` | Obtener todos los cursos |
| GET | `/cursos/:id` | Obtener un curso por ID |
| POST | `/cursos/:userId` | Crear un curso asociado a un usuario |
| PUT | `/cursos/:id` | Actualizar un curso |
| DELETE | `/cursos/:id` | Eliminar un curso |

---

## ⏱ Registro de Horas

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/registro-horas` | Obtener todos los registros de horas |
| GET | `/registro-horas/:id` | Obtener un registro por ID |
| POST | `/registro-horas` | Registrar horas de colaboración |

---

## 💳 Billetera

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/billetera` | Obtener todas las billeteras |
| GET | `/billetera/usuario/:id` | Obtener la billetera de un usuario |
| POST | `/billetera` | Crear o registrar una billetera |

---

## 💬 Mensajes

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/mensajes/:id` | Obtener los mensajes de una conversación o usuario |
| POST | `/mensajes` | Enviar un mensaje |

---

## 🔔 Notificaciones

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | `/notificaciones` | Crear una notificación |
| GET | `/notificaciones/usuario/:id` | Obtener las notificaciones de un usuario |
| PUT | `/notificaciones/aprobar/:id` | Aprobar una solicitud o notificación |
| PUT | `/notificaciones/leidas/:id` | Marcar notificaciones como leídas |

---

## ⭐ Valoraciones

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | `/valoraciones` | Registrar una valoración |
| GET | `/valoraciones/promedio/:id` | Obtener el promedio de valoraciones de un usuario |
| GET | `/valoraciones/ya-valoro/:id` | Verificar si un usuario ya realizó una valoración |
| GET | `/valoraciones/usuario/:usuarioQueValoraId/:usuarioValoradoId` | Consultar una valoración específica entre dos usuarios |



# 🔄 Flujo de una petición

```
Cliente

↓

HTTP Request

↓

Controller

↓

Service

↓

TypeORM

↓

MySQL

↓

Service

↓

Controller

↓

Respuesta JSON
```

---

# 💡 Buenas prácticas implementadas

- Arquitectura modular.
- Separación de responsabilidades.
- Inyección de dependencias.
- Uso de DTO para validaciones.
- Uso de entidades.
- Variables de entorno.
- Código escalable.
- Código reutilizable.
- Seguridad mediante JWT.
- Contraseñas cifradas.
- Despliegue en la nube.

---

# 📚 Aprendizajes

Durante el desarrollo de este proyecto se aplicaron conocimientos relacionados con:

- Desarrollo Backend.
- APIs REST.
- Arquitectura Modular.
- TypeScript.
- NestJS.
- MySQL.
- TypeORM.
- Autenticación JWT.
- Seguridad informática.
- Despliegue de aplicaciones en la nube utilizando Render y Railway.
- Control de versiones mediante Git y GitHub.

---

# 👩‍💻 Autoras
**Pamela Tolosa**
**Diana María Ciganda**
**JUlieta Tabuyo**

Proyecto desarrollado como Trabajo Final Integrador para demostrar conocimientos en desarrollo Backend utilizando NestJS.