# 🧭 B2B Order System – Guía de Instalación Local (¡Paso a Paso!)

¡Bienvenido!
Este documento te guiará para levantar y entender este sistema de pedidos B2B (**empresa a empresa**).
👉 Está explicado en un lenguaje sencillo, ideal para personas sin experiencia técnica.

---

## 1. 🧠 ¿Qué es este Proyecto?

Este sistema simula cómo una empresa **recibe y confirma pedidos**.
Está compuesto por **4 piezas principales** que trabajan juntas:

| Nombre Técnico         | Representa    | Qué hace                                                       |
| ---------------------- | ------------- | -------------------------------------------------------------- |
| 🧍 Customers API       | Clientes      | Guarda información de los clientes.                            |
| 📦 Orders API          | Pedidos       | Registra y gestiona pedidos.                                   |
| 🧠 Lambda Orchestrator | Coordinador   | Conecta las APIs y controla el flujo de validación y creación. |
| 🏦 MySQL               | Base de Datos | Almacena toda la información.                                  |

👉 **Docker Compose** es como un “interruptor mágico” que enciende todo con un solo comando.

---

## 2. 🧰 Requisitos Previos

Antes de comenzar, asegúrate de tener:

* [Node.js 22+](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/) o NPM
* [Docker](https://www.docker.com/) con Docker Compose ✅

💡 Si tienes Docker, **no necesitas instalar MySQL manualmente**.

---

## 3. 📂 Estructura del Proyecto

```
📦 b2bordersystem/
├── customers-api        # Información de Clientes
├── orders-api           # Gestión de Pedidos
├── lambda-orchestrator  # Coordinador del flujo
├── db                   # Archivos de base de datos
├── docker-compose.yml   # Levanta todo
├── .env                 # Configuración de entorno
└── README.md
```

---

## 4. ⚙️ Archivos `.env` – Variables de Entorno

Los archivos `.env` le dicen al sistema **cómo conectarse** y en qué puertos correr.

Si no los creas correctamente, **el sistema no funcionará**.

### 🟡 A. `.env` en la Raíz del Proyecto (para usar Docker)

```env
# CUSTOMERS-API
PORT_CUSTUMER=3001

# MYSQL
DB_HOST=mysql
DB_USER=user
DB_PASSWORD=password
DB_NAME=b2b_system
DB_PORT=3306

# TOKEN DE SEGURIDAD
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ORDER-API
PORT_ORDER=4002
CUSTOMERS_API_URL=http://customers-api:3001
```

📌 `customers-api` es el nombre interno del contenedor en Docker.

---

### 🟢 B. `.env` en `lambda-orchestrator` (modo local sin Docker)

```env
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CUSTOMERS_API_URL=http://localhost:3001
ORDERS_API_URL=http://localhost:4002
```

📌 Aquí usamos `localhost` porque ejecutas directamente desde tu computadora.

---

### 🧑‍💻 C. `.env` para Customers API y Orders API (modo desarrollo manual)

#### 🟡 Customers API

```env
PORT_CUSTUMER=3001
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=b2b_system
DB_PORT=3306
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 🟠 Orders API

```env
PORT_ORDER=4002
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=b2b_system
DB_PORT=3306
SERVICE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CUSTOMERS_API_URL=http://localhost:3001
```

📌 Diferencia principal: `PORT_ORDER` y `CUSTOMERS_API_URL`.

---

## 5. 🐳 Levantar el Proyecto con Docker

1. Clona el repositorio:

   ```bash
   git clone https://github.com/usuario/b2bordersystem.git
   cd b2bordersystem
   ```

2. Crea el archivo `.env` en la raíz (ver sección 4A).

3. Ejecuta:

   ```bash
   docker compose up --build
   ```

✅ Servicios disponibles:

* Customers API → [http://localhost:3001](http://localhost:3001)
* Orders API → [http://localhost:4002](http://localhost:4002)
* MySQL → Dentro de Docker

---

## 6. ☁️ Ejecutar la Lambda en Local

Si quieres probar **solo el orquestador**:

```bash
cd lambda-orchestrator
yarn install
yarn start
```

👉 Comprueba que funcione: [http://localhost:3003/orchestrator/health](http://localhost:3003/orchestrator/health)

---

## 7. 🧭 Diagrama de Flujo del Sistema

```
[Cliente]
    │
    ▼
[Lambda Orchestrator]
    │
    ├── Valida Cliente -> [Customers API]
    │
    ├── Crea Pedido -> [Orders API]
    │
    └── Guarda Datos -> [MySQL]
    │
    ▼
[Respuesta: Pedido Confirmado ✅]
```

**Explicación:** La Lambda orquesta todo: valida cliente, crea pedido y guarda la información.

---

## 8. 🏗️ Arquitectura del Sistema

```
┌───────────────────────┐
│ 🧠 Lambda Orchestrator│
└─────┬─────────┬───────┘
      │         │
      ▼         ▼
┌────────────┐  ┌────────────┐
│ Customers  │  │  Orders    │
│    API     │  │   API      │
└─────┬──────┘  └────┬───────┘
      │              │
      ▼              ▼
 ┌────────────────────────┐
 │       🏦 MySQL         │
 └────────────────────────┘
```

---

## 9. 🧪 Comandos Útiles

| Comando               | Dónde usarlo        | Qué hace                                  |
| --------------------- | ------------------- | ----------------------------------------- |
| `docker compose up`   | Raíz                | Levanta todos los servicios con Docker.   |
| `docker compose down` | Raíz                | Apaga todos los servicios.                |
| `yarn install`        | Cada servicio       | Instala dependencias.                     |
| `yarn start`          | lambda-orchestrator | Corre Lambda localmente.                  |
| `yarn dev`            | APIs                | Corre APIs en modo desarrollo sin Docker. |

---

## 10. 📜 Flujo Paso a Paso

```
1. Cliente realiza un pedido.
2. Lambda Orchestrator recibe la solicitud.
3. Lambda valida el cliente con Customers API.
4. Si el cliente existe, Lambda crea el pedido en Orders API.
5. Orders API guarda datos en MySQL.
6. Lambda devuelve confirmación al cliente ✅
```

---

## 11. 🛠️ Problemas Comunes

* Verifica que los `.env` estén creados correctamente.
* Con Docker usa `customers-api`, no `localhost`.
* Si cambias `.env`, reinicia Docker:

```bash
docker compose down
docker compose up --build
```

* Si trabajas localmente sin Docker, usa `localhost` en las URLs.

---

## 🚀 ¡Listo!

Ya sabes cómo levantar, entender y probar el sistema B2B.
Este proyecto está diseñado para **cualquier persona**, incluso sin experiencia técnica. 👨‍💻🪄
