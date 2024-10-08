const express = require('express');
const router = express.Router();
let users = require('../data/users');
const { authToken } = require('../login/auth'); // Importar la función authToken

// Función para validar que el nombre solo tenga letras y espacios
const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

// Función para validar el formato de email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Obtener todos los usuarios
router.get('/', (req, res) => {
  res.json(users);
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  let { id, name, email, age } = req.body;

  // Verificar que todos los campos están presentes
  if (!id || !name || !email || age === undefined) {
    return res.status(400).json({ message: 'Todos los campos son requeridos: id, name, email, age' });
  }

  // Verificar que todos los campos son strings
  if (typeof id !== 'string' || typeof name !== 'string' || typeof email !== 'string' || typeof age !== 'string') {
    return res.status(400).json({ message: 'Todos los campos deben ser strings' });
  }

  // Validar el nombre
  if (!validateName(name)) {
    return res.status(400).json({ message: 'El nombre solo puede contener letras y espacios' });
  }

  // Validar el email
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Email no es válido. Debe contener una arroba (@).' });
  }

  // Crear el nuevo usuario
  const newUser = { id, name, email, age };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json(user);
});

// Actualizar un usuario por ID
router.put('/:id', (req, res) => {
  let { name, email, age } = req.body;
  const user = users.find(u => u.id === req.params.id);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  // Verificar y validar los campos si se envían
  if (name && (typeof name !== 'string' || !validateName(name))) {
    return res.status(400).json({ message: 'El nombre debe ser un string y solo puede contener letras y espacios' });
  }
  if (email && (typeof email !== 'string' || !validateEmail(email))) {
    return res.status(400).json({ message: 'Email no es válido. Debe contener una arroba (@) y un dominio válido.' });
  }
  if (age && typeof age !== 'string') {
    return res.status(400).json({ message: 'La edad debe ser un string' });
  }

  // Actualizar los campos del usuario
  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;

  res.json(user);
});

// Eliminar un usuario por ID
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Usuario no encontrado' });

  users.splice(index, 1);
  res.status(200).json({ message: 'Usuario eliminado correctamente!!!' });
});

module.exports = router;
