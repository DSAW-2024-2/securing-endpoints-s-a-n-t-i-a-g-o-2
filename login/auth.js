require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Datos de autorización del administrador (esto solo para ejemplo, en producción se debería usar una base de datos)
const adminAuthorization = [
    {
        email: 'admin@admin.com',
        password: 'admin'
    }
];

// Ruta para el login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Busca el usuario por email y password
    const user = adminAuthorization.find(user => user.email === email && user.password === password);

    if (user) {
        // Genera un token JWT
        const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        // Respuesta de error si el email o password son incorrectos
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});

// Middleware de autenticación con token JWT
function authToken(req, res, next) {
    // Obtiene el header de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Toma el token, ignorando "Bearer"

    if (!token) {
        // Si no hay token, retorna 401 (no autorizado)
        return res.sendStatus(401);
    }

    // Verifica el token con la clave secreta
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Si el token no es válido, retorna 403 (prohibido)
            return res.sendStatus(403);
        }
        // Si el token es válido, guarda el usuario en la request y pasa al siguiente middleware
        req.user = user;
        next();
    });
}

// Exporta el router y el middleware de autenticación
module.exports = router;
module.exports = authToken;
