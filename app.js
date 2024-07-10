'use strict'

var express = require('express');

// Importar express
var app = express();

// Cargar rutas
var user_routes = require('./routes/userRoutes');

// Configuracion de middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar cabeceras http

// Configurar rutas base
// Agregar /api por delante de la ruta y cargar el archivo de ruta de user 
app.use('/api', user_routes);

// app.get('/pruebas', function (req, res) {
//     res.status(200).send({ message: 'Bienvenido al curso de NodeJS' });
// });

// Exportar el modulo
module.exports = app;
