// src/server.js
require('dotenv').config();
const app = require('./app');
const db = require('./infrastructure/db'); // importamos pool para health check

const PORT = process.env.PORT || 3001;

// Health check global
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Levanta el servidor
app.listen(PORT, () => console.log(`Customers API running on port ${PORT}`));
