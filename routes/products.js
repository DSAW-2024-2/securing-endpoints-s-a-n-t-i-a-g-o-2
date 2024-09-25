const express = require('express');
const router = express.Router();
let products = require('../data/products');

// Obtener todos los productos
router.get('/', (req, res) => {
  res.json(products);
});

// Traer un producto por ID
router.get('/:id', (req,res) => {
  const product=products.find(p=> p.id === req.params.id);
  if(!product){
    return res.status(404).json({message: 'Producto no encontrado'});
  }
  res.json(product);
})


// Crear un nuevo producto
router.post('/', (req, res) => {
  let { id, name, price, category } = req.body;

  // Verificar que todos los campos son strings
  if ([id, name, price, category].some(param => typeof param !== "string")) {
    return res.status(400).json({ message: 'Todos los campos deben ser strings' });
  }

  // Verificar que id y price contengan solo números
  const numberRegex = /^[0-9]+$/;
  if (!numberRegex.test(id) || !numberRegex.test(price)) {
    return res.status(400).json({ message: 'El id y el price deben contener solo números.' });
  }

  // Verificar que name y category contengan solo letras
  const letterRegex = /^[A-Za-z\s]+$/;
  if (!letterRegex.test(name) || !letterRegex.test(category)) {
    return res.status(400).json({ message: 'El name y el category deben contener solo letras.' });
  }

  // Verificar que todos los campos están presentes
  if (!id || !name || !price || !category) {
    return res.status(400).json({ message: 'Todos los campos son requeridos: id, name, price, category' });
  }

  // Crear el nuevo producto
  const newProduct = { id, name, price, category };
  products.push(newProduct);
  res.status(201).json(newProduct);
});


// Actualizar un producto por ID
router.put('/:id', (req, res) => {
  let { id, name, price, category } = req.body;

  if (!id || !name || !price || !category) {
    return res.status(400).json({ message: 'Todos los campos son requeridos: id, name, price, category' });
  }

  // Convertir id y price a string
  id = String(id);
  price = String(price);

  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  product.name = name;
  product.price = price;
  product.category = category;

  res.json(product);
});

// Eliminar un producto por ID
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  products.splice(index, 1);
  res.status(200).json({ message: 'Producto eliminado correctamente!!!' });
});

module.exports = router;

