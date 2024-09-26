const express = require('express');
const router = express.Router();
let orders = require('../data/orders');
let users = require('../data/users');
let products = require('../data/products');
const { authToken } = require('../login/auth')  // Importar la función authToken

// Obtener todos los pedidos (requiere token JWT válido)
router.get('/', authToken, (req, res) => {
  res.json(orders);
});

// Obtener pedido por ID (requiere token JWT válido)
router.get('/:id', authToken, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  res.json(order);
});

// Crear un nuevo pedido (requiere token JWT válido)
router.post('/', authToken, (req, res) => {
  const { id, userId, productId, quantity, status } = req.body;

  // Verificar que todos los campos estén presentes
  if (!id || !userId || !productId || !quantity || !status) {
    return res.status(400).json({ message: 'Todos los campos son requeridos: id, userId, productId, quantity, status' });
  }

  // Verificar que todos los datos sean strings
  if (typeof id !== 'string' || typeof userId !== 'string' || typeof productId !== 'string' || typeof quantity !== 'string' || typeof status !== 'string') {
    return res.status(400).json({ message: 'Todos los campos deben ser strings' });
  }

  // Verificar que la cantidad sea mayor que 0
  if (parseInt(quantity) <= 0) {
    return res.status(400).json({ message: 'La cantidad debe ser un número mayor que 0' });
  }

  // Validar que el status contenga solo letras
  const letterRegex = /^[A-Za-z\s]+$/;
  if (!letterRegex.test(status)) {
    return res.status(400).json({ message: 'El status solo debe contener letras.' });
  }

  // Validar que el usuario y el producto existan
  const user = users.find(u => u.id === userId);
  const product = products.find(p => p.id === productId);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  // Crear el nuevo pedido
  const newOrder = { id, userId, productId, quantity, status };
  orders.push(newOrder);

  res.status(201).json(newOrder);
});

module.exports = router;
