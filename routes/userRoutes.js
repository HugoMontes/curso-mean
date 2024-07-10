'use strict'

// Cargar modulo de express
var express = require('express');
// Cargar el controlador
var UserController = require('../controllers/userController');
// Cargar ruter de express
var api = express.Router();

// Crear la ruta y asociarlo con el metodo del controlador
api.get('/probando-controlador', UserController.pruebas);

// Exportar en un modulo 
module.exports = api;
