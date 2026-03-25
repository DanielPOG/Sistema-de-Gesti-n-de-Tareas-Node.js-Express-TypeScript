# Task Manager API

REST API para gestión de tareas personales con autenticación JWT, construida con Node.js, Express y TypeScript.

---

## Descripción

El sistema permite a los usuarios registrarse, iniciar sesión y administrar sus propias tareas personales. Cada usuario solo tiene acceso a sus propias tareas, garantizando aislamiento total de datos entre cuentas.

La API implementa autenticación stateless mediante JWT, validación de entradas con Zod, manejo centralizado de errores y documentación interactiva con Swagger.

---

## Arquitectura

El proyecto sigue una arquitectura en capas donde cada capa tiene una única responsabilidad:
```
src/
├── api/
│   ├── routes/          # Definición de endpoints y agrupación de rutas
│   └── middlewares/     # Auth guard, validación de inputs, manejo de errores
├── controllers/         # Recibe la petición, llama al service, devuelve respuesta
├── services/            # Lógica de negocio y reglas de dominio
├── persistence/         # Repositorios y cliente de Prisma
├── config/              # Singleton de variables de entorno
├── errors/              # Clases de error personalizadas
├── utils/               # Schemas de Zod y tipos inferidos
├── docs/                # Documentación Swagger (swagger.yaml)
├── app.ts               # Configuración de Express, middlewares y rutas
└── server.ts            # Arranque del servidor
```

El flujo de una petición sigue siempre este camino:
```
Request → Route → Middleware → Controller → Service → Repository → Database
```

---

## Tecnologías

- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JSON Web Tokens (jsonwebtoken)
- bcrypt
- Zod
- Swagger UI
- Vitest

---

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL corriendo localmente
- npm o pnpm

---

## Instalación local

### 1. Clona el repositorio
```bash
git clone https://github.com/DanielPOG/Sistema-de-Gesti-n-de-Tareas-Node.js-Express-TypeScript.git
cd Sistema-de-Gesti-n-de-Tareas-Node.js-Express-TypeScript
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo:
```bash
cp .env.example .env
```

Abre `.env` y completa los valores:
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/task_manager"
JWT_SECRET="un_string_largo_y_secreto"
JWT_EXPIRES_IN="7d"
PORT=3000
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. 7d, 24h) |
| `PORT` | Puerto donde corre el servidor |

### 4. Crea la base de datos

En PostgreSQL crea la base de datos:
```sql
CREATE DATABASE task_manager;
```

### 5. Corre las migraciones
```bash
npx prisma migrate dev
```

Esto crea las tablas `User` y `Task` en la base de datos.

---

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con hot reload |
| `npm run build` | Compila TypeScript a JavaScript en `/dist` |
| `npm start` | Inicia el servidor desde los archivos compilados |
| `npm run lint` | Revisa el código con ESLint |
| `npm run lint:fix` | Corrige errores de ESLint automáticamente |
| `npm run format` | Formatea el código con Prettier |
| `npm test` | Ejecuta las pruebas con Vitest |
| `npx prisma studio` | Abre el explorador visual de la base de datos |

---

## Endpoints

La documentación interactiva completa está disponible en Swagger una vez que el servidor esté corriendo:
```
http://localhost:3000/docs
```

Resumen de endpoints disponibles:

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registra un nuevo usuario | No |
| POST | `/auth/login` | Inicia sesión y obtiene JWT | No |
| POST | `/tasks` | Crea una nueva tarea | Si |
| GET | `/tasks` | Lista todas las tareas del usuario | Si |
| GET | `/tasks/:id` | Obtiene una tarea por id | Si |
| PUT | `/tasks/:id` | Actualiza una tarea | Si |
| DELETE | `/tasks/:id` | Elimina una tarea | Si |

---

## Autenticación

Las rutas protegidas requieren un JWT en el header de cada petición:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login en `POST /auth/login`.

---

## Variables de entorno

Nunca subas tu archivo `.env` al repositorio. El archivo `.env.example` contiene la estructura necesaria sin valores reales y sí se incluye en el repositorio como referencia.