'use strict'

var express = require('express');

// Importar express
var app = express();

// Configuracion de middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar cabeceras http

// Configurar rutas base
app.get('/pruebas', function (req, res) {
    res.status(200).send({ message: 'Bienvenido al curso de NodeJS' });
});

// Exportar el modulo
module.exports = app;
