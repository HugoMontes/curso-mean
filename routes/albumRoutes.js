'use strict'

// Cargar modulo necesarios
var express = require('express');
var AlbumController = require('../controllers/albumController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
// Indicar el directorio donde se van a subir los archivos
var md_upload = multipart({ uploadDir: './uploads/albums' });

// Crear la ruta y asociarlo con el metodo del controlador
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
// Agregamos :artist como parametro opcional para enviar el id de artista
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
// Agregamos id como parametro obligatorio
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

// Exportar metodos de rutas
module.exports = api;