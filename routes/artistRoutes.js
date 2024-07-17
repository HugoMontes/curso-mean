'use strict'

// Cargar modulo necesarios
var express = require('express');
var ArtistController = require('../controllers/artistController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Crear la ruta y asociarlo con el metodo del controlador
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
// Crear ruta con parametro page opcional
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);

// Exportar metodos del API
module.exports = api;