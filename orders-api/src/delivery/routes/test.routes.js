const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

router.get('/error', (req, res, next) => {
  next(new Error('Error de prueba'));
});

module.exports = router;
