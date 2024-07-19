'use strict'

// Importar modulos necesarios
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination-v2');

// Importar modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Metodo para obtener un artista de la BD
function getAlbum(req, res) {
    return res.status(200).send({ message: 'Accion getAlbum' });
}

// Metodo para guardar un album
async function saveAlbum(req, res) {
    try {
        var album = new Album();
        var params = req.body;
        album.title = params.title;
        album.description = params.description;
        album.year = params.year;
        album.image = null;
        album.artist = params.artist;

        const albumStored = await album.save();
        if (!albumStored) {
            return res.status(400).send({ message: 'No se ha guardado el album' });
        }
        return res.status(200).send({
            message: 'Datos guardados correctamente.',
            album: albumStored
        });

    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor al registrar album' });
    }
}

// Exportar metodos
module.exports = {
    getAlbum,
    saveAlbum
};