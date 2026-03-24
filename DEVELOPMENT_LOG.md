# Bitacora de Desarrollo
- Iniciar el proyecto 
    * Se ejecuta del npm init -y --scope=task_manager_api (nombre de la app)
    * Se ejecuta el mkdir para crear las carpetas para crear la arquitectura por capas 
- Uso  de IA
    Prompt: "En un proyecto para hacer una Api Rest con las tecnologias NodeJs + Express + TypeScript y de bd el ORM de prisma con Postgresql dame las dependecias para eso y hacer autenticacion con json web token  y para hashear contraseñas con bycript y las validaciones con zod, para poder accerder al env y tambien las dependecias de desarrollo toma encuenta lo del eslint y prettier y los type para typeScript para que funcione bien "
    Respuesta: 
    "
    Dependecias de produccion
    npm install express prisma @prisma/client jsonwebtoken bcrypt
    zod dotenv
    Dependecias de desarrollo
    npm install -D typescript ts-node-dev tsconfig-paths @types/node @types/express @types/jsonwebtoken @types/bcryptjs eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
    "
    Se acepta: "En referencia a la web npmjs.com son consistentes las dependecias y se añade las restantes de documentacion swagger-ui-express yamljs"

Reto y Solucion 
 * El gestor de paquetes npm me estaba dando errores a la hora de descargar las dependecias del proyecto y se quedaba pegada la consola mediante el uso de npm
 solucion:
    # Se borra la carpeta node_modules y el package-lock.json
    # se borra el cache de npm 
    # nuevo gestor de paquetes pnpm 
    # inidicio de cambio aparece los warn de que detecto la misma dependecia sin embargo le puso el .ignored

- Git push al repositorio
    Con todo todo lo basico se hace commit 
    "
    chore: Initialize project structure and basic documentation
    "