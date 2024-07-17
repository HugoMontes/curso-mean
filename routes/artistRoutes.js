'use strict'

// Cargar modulo necesarios
var express = require('express');
var ArtistController = require('../controllers/artistController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
// Cargar el modulo para cargar archivos
var multipart = require('connect-multiparty');
// Indicar el directorio donde se van a subir los archivos
var md_upload = multipart({ uploadDir: './uploads/artists' });

// Crear la ruta y asociarlo con el metodo del controlador
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
// Crear ruta con parametro page opcional
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

// Exportar metodos del API
module.exports = api;