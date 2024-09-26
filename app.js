const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const { authToken } = require('./login/auth') 
const { router: loginRoute, authToken } = require('./login/auth'); 

app.use(express.json());

app.use('/login', loginRoute);

app.use(authToken);

app.use('/users', usersRoutes);        // Rutas de usuarios
app.use('/products', productsRoutes);  // Rutas de productos
app.use('/orders', ordersRoutes);      // Rutas de pedidos


// Ruta principal
app.get('/', (req, res) => {
  res.send('Bienvenido!!');
});

// Manejar rutas no definidas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});