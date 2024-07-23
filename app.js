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

// Configurar cabeceras http para evitar problemas con el control de acceso
// Configurar un middleware que se ejecute en cada solicitud que reciba el servidor
app.use((req, res, next) => {
    // Permitir solicitudes desde cualquier origen.
    res.header('Access-Control-Allow-Origin', '*');
    //  Define las cabeceras que pueden ser utilizadas durante la solicitud HTTP como Authorization, Content-Type, etc.
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    // Especifica los métodos HTTP que están permitidos al hacer solicitudes al servidor.
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // Similar a la línea anterior, esta cabecera indica los métodos HTTP que el servidor acepta.
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    // Pasar el control al siguiente middleware en la cadena de middlewares de Express.js
    next();
});

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
