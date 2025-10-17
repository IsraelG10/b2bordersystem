// src/server.js
require('dotenv').config();
const app = require('./app');
const db = require('./infrastructure/db'); // importamos pool para health check

const PORT = process.env.PORT_CUSTUMER || 3001;

// Health check usando Knex
app.get('/health', async (req, res, next) => {
  try {
    await db.raw('SELECT 1'); // ✅ Knex usa raw()
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    next(err); // pasa el error al errorHandler
  }
});


// Levanta el servidor
app.listen(PORT, () => console.log(`Customers API running on port ${PORT}`));
