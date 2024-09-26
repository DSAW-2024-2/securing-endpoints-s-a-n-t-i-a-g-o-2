require('dotenv').config();
const express = require('express');
const app = express();  
const jwt = require('jsonwebtoken');  
app.use(express.json());  

const adminAuthorization = [  
    {
        "email": "admin@admin.com",
        "password": "admin"
    }
];

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = adminAuthorization.find(user => user.email === email && user.password === password);

    if (user) {
        const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});

function authToken(req, res, next) {
    const token = req.headers['authorization'];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = app;
