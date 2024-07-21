'use strict'

var express = require('express');

// Importar express
var app = express();

// Cargar rutas
var user_routes = require('./routes/userRoutes');
var artist_routes = require('./routes/artistRoutes');
var album_routes = require('./routes/albumRoutes');
var song_routes = require('./routes/songRoutes');

// Configuracion de middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar cabeceras http

// Configurar rutas base
// Agregar /api por delante de la ruta y cargar el archivo de ruta de user 
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

// app.get('/pruebas', function (req, res) {
//     res.status(200).send({ message: 'Bienvenido al curso de NodeJS' });
// });

// Exportar el modulo
module.exports = app;
