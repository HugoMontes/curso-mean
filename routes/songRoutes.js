'use strict'

// Cargar modulo necesarios
var express = require('express');
var SongController = require('../controllers/songController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
// Indicar el directorio donde se van a subir los archivos
var md_upload = multipart({ uploadDir: './uploads/songs' });

// Crear la ruta y asociarlo con el metodo del controlador
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);

// Exportar metodos de rutas
module.exports = api;