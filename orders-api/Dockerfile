FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

COPY . .

# --- Etapa 2: Production (Imagen final ligera para ejecución) ---
FROM node:22-slim

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/knexfile.js ./knexfile.js
COPY --from=build /usr/src/app/db ./db

ENV PORT 4002

EXPOSE 4002

CMD ["/bin/sh", "-c", "yarn migrate && node src/server.js"]