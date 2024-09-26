const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const loginRoutes = require('./login/auth'); // Importar las rutas de login
const { authToken } = require('./login/auth'); // Importar authToken por separado

app.use(express.json());


// Ruta para el login, sin protección (no requiere token JWT)
app.use('/login', loginRoutes);

// Protege las siguientes rutas con el middleware de autenticación JWT
app.use('/users', authToken, usersRoutes);        // Rutas de usuarios
app.use('/products', authToken, productsRoutes);  // Rutas de productos
app.use('/orders', authToken, ordersRoutes);      // Rutas de pedidos

// Ruta principal, accesible sin autenticación
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
