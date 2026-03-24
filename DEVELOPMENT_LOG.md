# Bitacora de Desarrollo
1. Iniciar el proyecto 
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

2. Archivos de configuracion 
- Uso de IA
    Prompt: "Generame una configuracion para los archivos de tsconfig.json, .eslintrc.json, .prettierrc , package.json teniendo en cuenta el contexto de la aplicacion relacionado con las dependecias y las dependecias de desarrollo"
    Respuesta: 
    "
    creacion de archivo .eslintrc.json
    creacion de archivo .prettierrc
    creacion de archivo tsconfig.json
    modificacion de package.json
    "
    Se acepta: "Se acepta los archivos cumplen con lo requerido y son consistendes referente a las dependecias instaladas "
    Verificacion:
    "
    tsconfig.json = el target es compatible con nodejs actual,
    hace la separacion de compilado del rootdir y outdir,
    tiene seguridad de los tipos

    .eslint.json = toma como referente el tsconfig.json para el analisis de tipos , prettier al final para desactivar reglas que conflictúan con el formateador

    .prettierrc = configuracion echa como extension teniendo en cuenta el .eslint.json , acorde 
    "