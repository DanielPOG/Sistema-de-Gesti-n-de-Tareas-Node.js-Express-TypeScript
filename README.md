# Sistema de Gestión de Tareas — Node.js + Express + TypeScript
- Descripcion Proyecto:
Este proyecto consiste en el desarrollo de una API RESTful robusta y segura utilizando Node.js, Express y TypeScript. El sistema está diseñado para permitir que los usuarios se registren e inicien sesión para administrar de manera personal sus propias tareas.


-  // iniciar Proyecto
  npm init -y --scope=task_manager_api

- Dependecias
  pnpm add express jsonwebtoken bcrypt @prisma/client zod swagger-ui-express yamljs dotenv

- Ddependecias de Desarrollo
  pnpm add -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcrypt @types/swagger-ui-express @types/yamljs eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser prisma

- Arquitectura en capas 
/src
  /api              # Rutas y Middlewares 
    /routes
    /middlewares
  /controllers      # Lógica que atiende peticiones 
  /services         # Lógica de negocio reutilizable 
  /persistence      # Prisma / Repositorios 
  /config           # Singleton de configuración (.env) 
  /utils            # Clases de error personalizadas y Helpers 
  /schemas          # Validaciones con Zod 
  app.ts            # Configura Express, middlewares y rutas
  server.ts         # Servidor

configuracion del env