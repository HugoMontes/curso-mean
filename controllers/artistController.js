'use strict'

// Importar modulos necesarios
var path = require('path');
var fs = require('fs');
// Importar modelos a usar
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Metodo para obtener un artista de la BD
function getArtist(req, res) {
    res.status(200).send({ message: 'Metodo getArtist del controlador artist.js' });
}

module.exports = {
    getArtist
}