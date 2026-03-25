# Development Log

## 1. Inicialización del proyecto

Se ejecuta `npm init -y --scope=task_manager_api` para crear el proyecto.
Se ejecuta `mkdir` para crear las carpetas de la arquitectura por capas.

### Uso de IA

**Prompt:**
> En un proyecto para hacer una Api Rest con las tecnologias NodeJs + Express + TypeScript y de bd el ORM de prisma con Postgresql dame las dependecias para eso y hacer autenticacion con json web token y para hashear contraseñas con bycript y las validaciones con zod, para poder accerder al env y tambien las dependecias de desarrollo toma encuenta lo del eslint y prettier y los type para typeScript para que funcione bien

**Respuesta recibida:**
```
Dependencias de produccion
npm install express prisma @prisma/client jsonwebtoken bcrypt zod dotenv

Dependencias de desarrollo
npm install -D typescript ts-node-dev tsconfig-paths @types/node @types/express
@types/jsonwebtoken @types/bcryptjs eslint prettier eslint-config-prettier
eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Qué se aceptó y por qué:**
Referenciando npmjs.com, las dependencias son consistentes. Se añaden adicionalmente `swagger-ui-express` y `yamljs` para la documentación.

### Retos y soluciones

**Problema:** El gestor de paquetes `npm` generaba errores al descargar las dependencias y la consola se quedaba bloqueada.

**Solución:**
1. Se eliminó la carpeta `node_modules` y el archivo `package-lock.json`
2. Se limpió el caché de npm
3. Se migró al gestor de paquetes `pnpm`
4. Al iniciar con `pnpm` aparecieron advertencias de dependencias duplicadas marcadas como `.ignored`

### Commit
```
chore: Initialize project structure and basic documentation
```

---

## 2. Archivos de configuración

### Uso de IA

**Prompt:**
> Generame una configuracion para los archivos de tsconfig.json, .eslintrc.json, .prettierrc, package.json teniendo en cuenta el contexto de la aplicacion relacionado con las dependecias y las dependecias de desarrollo

**Respuesta recibida:**
- Creación de `.eslintrc.json`
- Creación de `.prettierrc`
- Creación de `tsconfig.json`
- Modificación de `package.json`

**Qué se aceptó y por qué:**
Se aceptan los archivos porque cumplen con lo requerido y son consistentes respecto a las dependencias instaladas.

**Verificación realizada:**

- `tsconfig.json` — El target es compatible con Node.js actual, hace la separación de compilado entre `rootDir` y `outDir`, tiene seguridad de tipos activada.
- `.eslintrc.json` — Toma como referente `tsconfig.json` para el análisis de tipos. Prettier al final para desactivar reglas que conflictúan con el formateador.
- `.prettierrc` — Configuración hecha como extensión teniendo en cuenta `.eslintrc.json`, acorde y sin conflictos.

---

## 3. Inicialización de Prisma

**Sin uso de IA.**
```bash
pnpm dlx prisma init
```

**Creación de modelos:**

- `User` — Datos básicos y relación con el modelo `Task` para una relación 1 a N. Un usuario puede tener varias tareas personales.
- `Task` — Datos básicos, campos opcionales, tipo `enum` para manejar los estados de la tarea, relación con `User` mediante `userId`. Cada tarea solo puede pertenecer a un usuario.
- Tipo `ENUM` para manejar estados de la tarea con prefijos para evitar errores en tiempo de ejecución.

### Retos y soluciones

**Problema:** No era posible realizar la migración para crear las tablas con Prisma. No detectaba la dependencia instalada.

**Solución:** Se eliminó `node_modules` y se volvió a ejecutar `pnpm install`. No se habían activado los build scripts, por lo que se ejecutó `pnpm approve-builds` y la migración procedió correctamente.

**Problema:** Error en el archivo `schema.prisma`.

**Solución:** La versión de Prisma 7.5.0 maneja las conexiones de forma diferente para alinearse a entornos modernos. El schema anterior usaba:
```prisma
datasource db {
  provider = "postgresql"
}
```

Prisma 7 realiza la conexión dinámica mediante el archivo `prisma.config.ts`.

---

## 4. Singleton de configuración

**Sin uso de IA.**

Se crea el archivo `config/env.ts` para configurar el Singleton. Se consultó el recurso [youtu.be/UekxC1hvurk](https://youtu.be/UekxC1hvurk) como referencia de diseño.

El archivo se construye bajo tres pilares:
1. Una variable estática para poder instanciar
2. Un constructor privado de clase
3. Un método público estático

### Uso de IA

**Prompt:**
> En el archivo env.ts en la ruta config/env.ts se encuentra un Singleton basico para el port ayudame a generarlo para var de la bd, del jwt token y agrega documentacion en TSDocs clara concisa y maneja buenas practicas

**Respuesta recibida:**
- Documentación TSDoc añadida
- Fix de error en la exportación
- Añadido método `require` para validar existencia de variables

**Qué se aceptó y por qué:**
Se aceptan los cambios porque mejoraron la legibilidad, corrigieron un error crítico en la exportación y añadieron el método `require` para verificar si una variable existe o no al arrancar el servidor.

**Verificación realizada:**
Se investigó el método `require` y su necesidad. Se revisaron las etiquetas TSDoc contra la documentación oficial:
- [typescriptlang.org — JSDoc supported types](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [TSDoc Guidelines — FluidFramework](https://github.com/microsoft/FluidFramework/wiki/TSDoc-Guidelines)

---

## 5. Archivos base del servidor

**Sin uso de IA.**

Separación de responsabilidades entre dos archivos:

- `app.ts` — Configuración de rutas y middlewares
- `server.ts` — Conexión a la base de datos y arranque del servidor

---

## 6. Prisma Client y Repositorios

### Prisma Client

**Uso de IA.**

**Prompt:**
> El módulo '"@prisma/client"' no tiene ningún miembro 'PrismaClient' exportado.ts(2305). import PrismaClient me marca este error pero yo ya genere el prisma y las migraciones ya las hice

**Respuesta recibida:**
> En Prisma 7, el generador por defecto cambió de `prisma-client-js` a `prisma-client`. Con el nuevo generador, los tipos se generan en una carpeta local del proyecto por lo que el import desde `@prisma/client` ya no funciona igual.
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

**Qué se aceptó y por qué:**
Se consultó la documentación oficial de Prisma ([prisma.io/docs/guides/upgrade-prisma-orm/v7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7#driver-adapters-and-client-instantiation)) y es acorde a la solución propuesta.

**Verificación realizada:**
La versión 7 de Prisma cambió el proveedor de `prisma-client-js` a `prisma-client`. La nueva forma requiere definir un `output` para generar la carpeta localmente. La importación correcta pasa a ser:
```typescript
import { PrismaClient } from "./generated/prisma/client"
```

### Repositorios

**Sin uso de IA** para la creación inicial de `userRepository.ts` y `taskRepository.ts`.

**Uso de IA para revisión:**

**Prompt:**
> Verifica los archivos userRepository.ts, taskRepository.ts y corrige los defectos que tengan tambien documenta con tsdoc los dos documentos

**Respuesta recibida:**
- Modificación de `taskRepository.ts` añadiendo una interface como plantilla
- Documentación TSDoc añadida en ambos archivos

**Qué se aceptó y por qué:**
Se acepta porque el cambio de Inline Type (`{}`) a Named Type mediante una `interface` mejora la escalabilidad del código y sigue mejores prácticas. La documentación TSDoc es acorde.

**Verificación realizada:**
El cambio de Inline Type a Named Type mejora la escalabilidad del código. La documentación TSDoc es acorde a las guías oficiales.

---

## 7. Errores personalizados

Reorganización de carpetas:
- `utils/` — Para helpers genéricos
- `errors/` — Para el manejo de errores personalizados

### Uso de IA

**Prompt:**
> Generame una clase para errores personalizados teniendo en cuenta los repositorio userRepository.ts, taskRepository.ts, que tenga la documentacion en Tsdocs

**Respuesta recibida:**
- Creación completa de `AppError.ts`
- Creación completa de `errorHandler.ts`
- Línea añadida para importar el middleware en `app.ts`

**Qué se aceptó y por qué:**
Se acepta porque transforma el manejo de errores de un sistema basado en cadenas de texto a un sistema basado en tipos y semántica HTTP.

**Verificación realizada:**
Consultando la documentación de [javascript.info/custom-errors](https://javascript.info/custom-errors), la implementación cumple de manera correcta con el patrón de errores personalizados.

---

## 8. Autenticación

### Schemas de validación con Zod

**Sin uso de IA.**

Se crea `utils/schemas.ts` para las validaciones con Zod.

**Razonamiento:**
Se utiliza Zod como validador de schemas para la validación de reglas en tiempo de ejecución y saneamiento de datos, reduciendo así los errores inesperados.

### Middleware de validación

**Sin uso de IA.**

Se crea `validate.ts` para que la validación Zod se cumpla antes de llegar al controller.

**Razonamiento:**
Se utiliza para el saneamiento, el parseo y la protección de la lógica de negocio, asegurando que el controller solo reciba datos que cumplen estrictamente con el contrato definido por el schema.

### Auth Service

**Uso de IA.**

**Prompt:**
> Vamos hacer la logica en el service pero para lo relacionado con el auth, en este caso para register y login, ten encuenta lo del hash con bcrypt

**Respuesta recibida:**
- `authService.ts` creado con funciones `register` y `login`

**Qué se aceptó y por qué:**
Se acepta porque las funciones son correctas, hacen uso del repositorio, manejan los errores personalizados y cumplen la regla del hash a la contraseña.

**Verificación realizada:**
- Cumple con los criterios de la capa service
- No alucina respecto a los errores personalizados
- Utiliza correctamente `RegisterDto` y `LoginDto`

### Auth Controller y Auth Guard

**Uso de IA.**

**Prompt:**
> Teniendo el cuenta el authService.ts crea el controller con el nombre de authController (tipa estrictamente) y crea tambien el authGuard que es el middleware para proteger rutas privadas verificando el Token JWT

**Respuesta recibida:**
- `authController.ts` creado
- `authGuard.ts` creado

**Qué se aceptó y por qué:**

- `authController.ts` — Orquesta la comunicación HTTP de manera correcta
- `authGuard.ts` — La extracción del token es correcta con `Bearer` y solo conserva el token con el `split`. Hace la verificación correctamente.

**Verificación realizada:**

- `authController.ts` — Tipa estrictamente el `Request`, las funciones son `async` y manejan errores con `next`.
- `authGuard.ts` — Verifica la autenticidad e integridad de la petición mediante la validación del esquema Bearer Token, valida la firma e inyecta la identidad del usuario (`userId`) en el request.

### Rutas de autenticación

**Sin uso de IA.**

Se crea `authRoutes.ts` donde se mapean los endpoints de autenticación.

---

## 9. CRUD de tareas

### Uso de IA

**Prompt:**
> Contexto: Generar el módulo de tareas (Task) para una API REST con Node.js y TypeScript, siguiendo una arquitectura de tres capas y respetando la relación 1:N (un usuario tiene muchas tareas).
>
> Archivos a generar:
> - `taskService.ts`: Lógica de negocio para create, getAll (filtrado por userId), getById, update y delete. Debe asegurar que un usuario solo pueda modificar sus propias tareas.
> - `taskController.ts`: Orquestador que extraiga el userId de req.user (inyectado por el authGuard) y maneje las respuestas HTTP con códigos de estado correctos (201, 200, 204).
> - `taskRoutes.ts`: Definición de rutas protegidas. Todas las rutas deben usar el authGuard. Las rutas POST y PATCH deben incluir el middleware de validación con Zod.
>
> Requisitos técnicos: Uso de Prisma ORM, implementación de DTOs, manejo de errores centralizado con AppError, tipado estricto en cada capa.

**Respuesta recibida:**
- `taskService.ts` creado
- `taskController.ts` creado
- `taskRoutes.ts` creado

**Qué se aceptó y por qué:**

- `taskService.ts` — Encapsula las reglas de negocio de las tareas
- `taskController.ts` — Desacopla el protocolo HTTP de la lógica de forma correcta
- `taskRoutes.ts` — Define el pipeline de ejecución de la API

**Verificación realizada:**
- Valida la propiedad del recurso mediante el `userId`
- Gestiona códigos de estado (201, 204) y captura errores
- Aplica el `authGuard` y el middleware de validación en el orden correcto

**Sin uso de IA** para la integración en `app.ts`.

---

## 10. Documentación Swagger

### Uso de IA

**Prompt:**
> Contexto: Generar la especificación técnica de la API en formato YAML (OpenAPI 3.0.0) para un sistema de gestión de tareas. La API utiliza una arquitectura REST y seguridad basada en JWT (Bearer Auth).
>
> Requisitos del contrato:
> - Endpoints de Autenticación: POST /auth/register y POST /auth/login
> - Endpoints de Tareas (Protegidos): CRUD completo para /tasks y /tasks/{id}
> - Modelos de Datos: User, Task, SuccessResponse y ErrorResponse
> - Validaciones: formatos de datos (uuid, email, date-time) y códigos de estado HTTP correctos (200, 201, 401, 403, 404, 409)
>
> Objetivo: Obtener un archivo swagger.yaml que sirva como fuente de verdad para el equipo de Frontend.

**Respuesta recibida:**
- `swagger.yaml` creado

**Qué se aceptó y por qué:**
Se aceptó la implementación porque estandariza la comunicación entre Backend y Frontend. El uso de un contrato formal elimina ambigüedades en los tipos de datos, facilita las pruebas automáticas y permite que otros desarrolladores entiendan e integren la API sin necesidad de leer el código fuente.

**Verificación realizada:**
Contrato de seguridad verificado, estandarización de respuestas confirmada.

---

## 11. Pruebas unitarias con Vitest

### Uso de IA

**Prompt:**
> Desarrollar pruebas unitarias utilizando Vitest para validar la lógica de negocio de una API REST. Se busca garantizar que los servicios respondan correctamente tanto en casos de éxito como en escenarios de error de todos los modulos

**Respuesta recibida:**
Pruebas generadas para los siguientes módulos:
- `AppError` — Clases de error personalizadas
- `authGuard` — Middleware JWT
- `errorHandler` — Middleware global de errores
- `validate` — Middleware de validación Zod
- `authService` — Funciones register y login
- `taskService` — CRUD completo con ownership
- `authController`
- `taskController`
- Validación de schemas Zod

**Qué se aceptó y por qué:**
Al implementar pruebas unitarias con mocks, se logra validar la lógica de negocio de forma aislada de la infraestructura, lo que permite detectar errores sin depender de la base de datos.

**Verificación realizada:**

- **Independencia de entorno** — Se verifica que las pruebas se ejecutan correctamente en un entorno limpio de Node.js sin necesidad de levantar contenedores de base de datos.
- **Control de excepciones** — Se verifica que el flujo de errores tipados (`AppError`) funciona correctamente, asegurando que el Frontend reciba códigos de estado precisos.