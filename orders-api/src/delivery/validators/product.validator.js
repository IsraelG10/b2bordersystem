const { z } = require('zod');

// Schema para crear producto
const createProductSchema = z.object({
  sku: z.string().nonempty(),
  name: z.string().nonempty(),
  price_cents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
});

// Schema para actualizar producto (solo precio y stock)
const updateProductSchema = z.object({
  price_cents: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
});

// Middleware de validación para Express
const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors || err.message });
  }
};

module.exports = {
  createProductSchema,
  updateProductSchema,
  validateBody,
};
