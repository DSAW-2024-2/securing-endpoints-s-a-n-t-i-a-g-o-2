const express = require('express');
const router = express.Router();
let users = require('../data/users');
const { authToken } = require('../login/auth');// Importar la función authToken

// Obtener todos los usuarios 
router.get('/', authToken,(req, res) => {
  res.json(users);
});

// Crear un nuevo usuario 
router.post('/', authToken, (req, res) => {
  let { id, name, email, age } = req.body;

  // Verificar que todos los campos son strings excepto age que debe ser numérico
  if (typeof id !== 'string' || typeof name !== 'string' || typeof email !== 'string' || typeof age !== 'string') {
    return res.status(400).json({ message: 'Verifique que los campos id, name, email y age sean strings' });
  }

  // Verificar que el nombre no contenga números
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'El nombre solo puede contener letras y espacios' });
  }

  // Verificar que el email tenga un formato válido y contenga arroba
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email no es válido. Debe contener una arroba (@).' });
  }

  // Verificar que todos los campos están presentes
  if (!id || !name || !email || age === undefined) {
    return res.status(400).json({ message: 'Todos los campos son requeridos: id, name, email, age' });
  }

  // Crear el nuevo usuario
  const newUser = { id, name, email, age };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Obtener un usuario por ID 
router.get('/:id', authToken,(req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});

// Actualizar un usuario por ID 
router.put('/:id', authToken, (req, res) => {
  let { name, email, age } = req.body;
  const user = users.find(u => u.id === req.params.id);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  // Verificar que los campos sean del tipo correcto si se envían
  if (name && typeof name !== 'string') {
    return res.status(400).json({ message: 'El nombre debe ser un string' });
  }
  if (email && typeof email !== 'string') {
    return res.status(400).json({ message: 'El email debe ser un string' });
  }
  if (age && typeof age !== 'string') {
    return res.status(400).json({ message: 'La edad debe ser un string' });
  }

  // Verificar que el nombre no contenga números si se actualiza
  const nameRegex = /^[A-Za-z\s]+$/;
  if (name && !nameRegex.test(name)) {
    return res.status(400).json({ message: 'El nombre solo puede contener letras y espacios' });
  }

  // Verificar que el email tenga un formato válido y contenga arroba si se actualiza
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email no es válido. Debe contener una arroba (@) y un dominio válido.' });
  }

  // Actualizar los campos del usuario
  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;

  res.json(user);
});

// Eliminar un usuario por ID 
router.delete('/:id', authToken, (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Usuario no encontrado' });

  users.splice(index, 1);
  res.status(200).json({ message: 'Usuario eliminado correctamente!!!' });
});

module.exports = router;
