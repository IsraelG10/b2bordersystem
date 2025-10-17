// server.js
require('dotenv').config();
const app = require('./app');
const db = require('./infrastructure/db');

const PORT = process.env.PORT_ORDER || 3002;

// Health check usando Knex
app.get('/health', async (req, res, next) => {
  try {
    await db.raw('SELECT 1'); // ✅ Knex usa raw()
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    next(err); // pasa el error al errorHandler
  }
});

app.listen(PORT, () => console.log(`Orders API running on port ${PORT}`));
