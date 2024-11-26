const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Gestión de Usuarios');
});

module.exports = app;
