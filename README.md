# 🧭 B2B Order System – Guía de Instalación Local (¡Paso a Paso!)

¡Bienvenido!
Este README explica cómo clonar, configurar y levantar localmente el sistema de pedidos B2B (Customers API + Orders API + Lambda Orchestrator + MySQL) usando Docker y Node.js.
Los pasos están ordenados para que puedas correr el sistema desde cero sin complicaciones.

---

## 1. 🧰 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* ✅ **Node.js v22.20.0** (versión recomendada)
* 🧶 **Yarn** o npm

Si no tienes Yarn:

```bash
npm install --global yarn
```

* 🐳 **Docker con Docker Compose**

💡 Si tienes Docker, **no necesitas instalar MySQL manualmente**.

---

## 2. 📦 Clonar el Repositorio

```bash
git clone https://github.com/IsraelG10/b2bordersystem.git
cd b2bordersystem
```

---

## 3. ⚙️ Crear el archivo `.env` en la raíz

Antes de levantar nada, debes crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# CUSTOMERS-API
PORT_CUSTOMER=3001

# MYSQL
DB_HOST=mysql
DB_USER=user
DB_PASSWORD=password
DB_NAME=b2b_system
DB_PORT=3306

# TOKEN DE SERVICIO
SERVICE_TOKEN=0754hYpkouFQVuK7NYOuAJg96CE

# ORDER-API
PORT_ORDER=4002
CUSTOMERS_API_URL=http://customers-api:3001
```

📌 **Importante**:

* `mysql` y `customers-api` son nombres de contenedores definidos en `docker-compose.yml`.
* **No uses `localhost`** aquí, ya que Docker maneja la red interna de contenedores.

---

## 4. 🐳 Levantar los Sistemas con Docker

Una vez creado el `.env` en la raíz, ejecuta:

```bash
docker compose up -d
```

Esto levantará automáticamente:

* **Customers API** → [http://localhost:3001](http://localhost:3001)
* **Orders API** → [http://localhost:4002](http://localhost:4002)
* **MySQL** → en contenedor interno

Para detener los servicios:

```bash
docker compose down
```

🟢 **Verifica que las APIs estén corriendo** antes de pasar al siguiente paso.

---

## 5. ☁️ Configurar y Levantar Lambda Orchestrator

Una vez que los sistemas base ya están arriba con Docker, continúa con Lambda:

1. Ingresa a la carpeta del orquestador:

```bash
cd lambda-orchestrator
```

2. Crea el archivo `.env` dentro de esta carpeta:

```env
SERVICE_TOKEN=0754hYpkouFQVuK7NYOuAJg96CE
CUSTOMERS_API_URL=http://localhost:3001
ORDERS_API_URL=http://localhost:4002
```

3. Instala dependencias:

```bash
yarn install
```

*(Si no tienes Yarn: `npm install --global yarn`)*

4. Levanta la Lambda en local:

```bash
yarn start
```

5. Verifica la salud del servicio:

👉 [http://localhost:3003/orchestrator/health](http://localhost:3003/orchestrator/health)

---

## 6. 🧭 Flujo Básico del Sistema

```
Cliente → Lambda Orchestrator → Customers API → Orders API → MySQL → ✅ Pedido confirmado
```

* El cliente envía un pedido al **Lambda Orchestrator**.
* Lambda valida si el cliente existe (**Customers API**).
* Si es válido, crea el pedido (**Orders API**).
* Orders API guarda en MySQL.
* Lambda devuelve la confirmación.

---

## 7. 🛠️ Comandos Útiles

| Comando                | Ubicación                  | Acción                                 |
| ---------------------- | -------------------------- | -------------------------------------- |
| `docker compose up -d` | raíz                       | Levanta todos los servicios con Docker |
| `docker compose down`  | raíz                       | Apaga los servicios                    |
| `yarn install`         | lambda-orchestrator        | Instala dependencias del orquestador   |
| `yarn start`           | lambda-orchestrator        | Corre la Lambda localmente             |
| `yarn dev`             | customers-api / orders-api | Corre las APIs manualmente sin Docker  |

---

## 8. 🧩 Problemas Comunes

* ❌ **Error de conexión a DB** → Verifica que `.env` en la raíz esté correcto.
* ❌ **Orchestrator no responde** → Asegúrate de que Docker esté arriba antes de levantar la Lambda.
* 🔁 Si cambias `.env`, reinicia Docker:

```bash
docker compose down
docker compose up -d
```

---

## 9. 🔹 Notas sobre los `.env` de cada ambiente

Cada API maneja **su propio `.env`** según el modo de ejecución:

### 💻 Desarrollo Local (solo MySQL arriba)

#### `customers-api/.env`

```env
PORT_CUSTOMER=3001
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=b2b_system
DB_PORT=3306
SERVICE_TOKEN=0754hYpkouFQVuK7NYOuAJg96CE
```

#### `orders-api/.env`

```env
PORT_ORDER=4002
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=b2b_system
DB_PORT=3306
SERVICE_TOKEN=0754hYpkouFQVuK7NYOuAJg96CE
CUSTOMERS_API_URL=http://localhost:3001
```

> ⚠️ Para usar este modo local, **solo MySQL debe estar corriendo**, y debes detener los contenedores de `customers-api` y `orders-api` si estaban levantados con Docker.

---

## ✅ Listo

Con esto tienes el flujo completo:

1. Clonar repo
2. Crear `.env` en raíz
3. `docker compose up -d`
4. Crear `.env` en `lambda-orchestrator`
5. `yarn install`
6. `yarn start`

🚀 Sistema funcionando localmente.
