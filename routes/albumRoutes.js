'use strict'

// Cargar modulo necesarios
var express = require('express');
var AlbumController = require('../controllers/albumController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' });

// Crear la ruta y asociarlo con el metodo del controlador
api.get('/album', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);

// Exportar metodos de rutas
module.exports = api;