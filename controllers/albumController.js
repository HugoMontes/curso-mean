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
    var albumId = req.params.id;

    // Usando populate cargar los datos de artist asociados al ID de artista
    // Usando exec y promesas
    Album.findById(albumId).populate({ path: 'artist' }).exec()
        .then(album => {
            if (!album) {
                res.status(404).send({ message: 'El albumn no existe' })
            } else {
                res.status(200).send({ album })
            }
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error en el servidor al obtener album', error: err });
        });
}

// Metodo para obtener varios albums
function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId) {
        // Sacar todos los albums de la db
        var find = Album.find({}).sort('title');
    } else {
        // Sacar los albums de un artista concreto de la db
        var find = Album.find({ artist: artistId }).sort('year');
    }
    // Con populate y path sustituimos artist por un objeto con datos del artista
    find.populate({ path: 'artist' }).exec()
        .then(albums => {
            if (!albums) {
                res.status(404).send({ message: 'No hay albums' })
            } else {
                res.status(200).send({ albums })
            }
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error en la peticion', error: err });
        });
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
    saveAlbum,
    getAlbums
};