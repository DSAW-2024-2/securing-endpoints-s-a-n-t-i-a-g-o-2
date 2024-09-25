const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

app.use(express.json());

// Rutas
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido!!');
});

// Manejar rutas no definidas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port',{PORT});
});
