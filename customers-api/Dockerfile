# --- Etapa 1: Build (para instalar todas las dependencias) ---
# Usamos node:22-slim para una imagen base ligera de Node 22
FROM node:22-slim AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar archivos de manifiesto para instalar dependencias (usando caché de Docker si no cambian)
COPY package.json yarn.lock ./

# Instalar dependencias de desarrollo y producción para que 'knex' esté disponible
# Usamos --production=false para que las dependencias de Knex se instalen
RUN yarn install --frozen-lockfile --production=false

# Copiar el resto del código fuente de la aplicación
COPY . .

# --- Etapa 2: Production (Imagen final ligera para ejecución) ---
# Usamos una imagen base limpia para el entorno de producción
FROM node:22-slim

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar SOLO los archivos necesarios para la ejecución desde la etapa 'build'
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/knexfile.js ./knexfile.js
COPY --from=build /usr/src/app/db ./db

# Variables de entorno por defecto (se sobrescribirán por docker-compose)
# No necesitamos definir NODE_ENV aquí, Docker Compose lo puede manejar si es necesario.
ENV PORT 3001

# Exponer el puerto de la aplicación
EXPOSE 3001

# Comando combinado:
# Utiliza /bin/sh -c para encadenar comandos de manera segura.
# 1. Ejecuta 'yarn migrate' (asumiendo que está definido en package.json).
# 2. Si es exitoso (&&), ejecuta 'node src/server.js' para iniciar la aplicación.
CMD ["/bin/sh", "-c", "yarn migrate && node src/server.js"]