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

// Metodo para guardar un artista
async function saveArtist(req, res) {
    try {
        var artist = new Artist();
        // Obtener los datos a guardar
        var params = req.body;
        artist.name = params.name;
        artist.description = params.description;
        artist.image = null;
        // Guardar datos
        const artistStored = await artist.save();
        if (!artistStored) {
            return res.status(400).send({ message: 'No se ha registrado el artista' });
        }
        return res.status(200).send({
            message: 'Datos guardados correctamente.',
            artist: artistStored
        });
    } catch (error) {
        return res.status(500).send({ message: 'Error al registrar artista' });
    }
}

module.exports = {
    getArtist,
    saveArtist
}