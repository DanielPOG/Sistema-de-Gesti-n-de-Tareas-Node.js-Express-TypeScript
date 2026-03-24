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
3. Inicializa Prisma
No uso de IA 
pnpm dlx prisma init
Creacion de modelos
    
    - User: datos basicos y relacion con el modelo de task para relacion 1 a N (tareas personales, un usuario puede tener varias tareas)

    - Task: datos basicos , campos que son opcionales, tipo enum para manejar los estados de la tarea , relacion con user con el id, cada tarea solo puede tener un user 

    - tipo ENUM para manejar estados de la tarea (tener prefijos para evitar errores luego)
- Retos y soluciones 
No me dejaba hacer la migracion para crear las tablas con prisma, no detectaba la dependecia instalada
Solucion:
Borre el node_modules y volvi a descargar el pnpm install y no me habia dado cuenta que no active los build scripts y ejecute pnpm approve-builds y ya me dejo hacer la migracion
Error en el archivo de schema.prisma 
solucion: la version de prisma  7.5.0 maneja las conexiones de forma diferente para alinearse a entornos modernos 
yo tenia en el schema.prisma 
datasource db {
  provider = "postgresql"
  // Borra la línea de error = env("DATABASE_URL")
}
prisma hace la conexion dinamica con el archivo prisma.config.ts
4. Archivo de Singleton para env
Creacion de archivo env.ts para configurar el singleton
No uso de IA
busco un video de como diseñarlo (https://youtu.be/UekxC1hvurk)
Se crea el archivo bajo 3 cosas que debe llevar el archivo
    * una variable estatica para poder instanciar
    * una clase contructor 
    * un metodo publico que sea estatico
- Uso de IA:
    Prompt:"En el archivo env.ts en la ruta config/env.ts se encuentra un Singleton basico para el port ayudame a generarlo para var de la bd , del jwt token y agrega documentacion en TSDocs clara concisa y maneja buenas practicas "
    Respuesta:
    "
    Documentacion TSDocs 
    Fix de error de export 
    Añadio metodo require
    "
    Se acepta: "Se aceptan cambios porque mejoro el codigo la legibilidad y arreglo un error critico en la exportacion, ademas añadio el metodo require para verificar si la variable existe o no"
    Verificacion:  
    "
    Se investiga el metodo require y porque es necesario, se revisa  las etiquetas que utiliza en el TSDocs para ver si es acorde a la documentacion ( en https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html y en https://github.com/microsoft/FluidFramework/wiki/TSDoc-Guidelines)
    "
5. Primeros archivos
No uso de IA
Separacion de archivos:
    app.ts = routes , middleware 
    server.ts  = conexion a db y encendiddo de servidor
    
6. Base de datos- Prisma client
Reto y soluciones
error en import @prisma/client
Uso de IA:
    Prompt:
    "
    El módulo '"@prisma/client"' no tiene ningún miembro 'PrismaClient' exportado.ts(2305)
    import PrismaClient
    me marca este error pero yo ya genere el prisma y las migraciones ya las hice 
    "
    Respuesta:
    "
    En Prisma 7, el generador por defecto cambió de prisma-client-js a prisma-client. Con el nuevo generador, los tipos se generan en una carpeta local del proyecto por lo que el import desde @prisma/client ya no funciona igual.
    - Actualizar el schema para usar el nuevo generador
    generator client {
        provider = "prisma-client"
        output   = "../src/generated/prisma"
    }
    "
    Se acepta: " Consulte en la documentacion(https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7#driver-adapters-and-client-instantiation) y es acorde a la solucion"
    Verificacion:
    "
    En la documentacion nos dice que la version de prisma 7 cambiaron el proveedor de prisma-client-js y lo actualizaron a prisma-client la nueva forma nos dice que la forma toca poner el output para generar la nueva carpeta que anterior mente estaba en node_modules ahora va en una carpeta local y la fomra de importacion para el cliente es 
    import { PrismaClient } from "./generated/prisma/client"
    " 
6. Repositorios - User , Task
No uso de IA
userRepository.ts
taskRepository.ts
se crean estos dos archivos basicos para el manejo de consultas con orm
Uso de IA:
    Prompt:
    "
    Verifica los archivos userRepository.ts, taskRepository.ts y corrige los defectos que tengan tambien documenta con tsdoc los dos documentos 
    "
    Respuesta:
    "
    modifica taskRepository.ts añade interface para hacer plantila,
    añade la documentacion tsdoc
    "
    Se acepta:"Porque mejora el codigo a la hora de utilizar la interface  , la documentacion tsdoc se encuentra bien "
    Verificacion:
    "
    el cambio de el Inline Type de hacer el {} a Named Type mejora la escalabilidad del codigo , mejor practica , la documentacion tsdoc es acorde 
    "