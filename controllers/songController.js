'use strict'

// Importar modulos necesarios
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination-v2');

// Importar modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Obtener una cancion y album
function getSong(req, res) {
    var songId = req.params.id;
    // Usar populate para obtener datos del album asociado
    Song.findById(songId).populate({ path: 'album' }).exec()
        .then(song => {
            if (!song) {
                res.status(404).send({ message: 'La cancion no existe' })
            } else {
                res.status(200).send({ song })
            }
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error en el servidor al obtener cancion', error: err });
        });
}

// Metodo para obtener canciones
function getSongs(req, res) {
    // Obtener mediante la URL el ID de algun album 
    var albumId = req.params.album;
    // Verificar si se envio albumId
    if (!albumId) {
        // Obtener todas las canciones de la BD
        var find = Song.find({}).sort('number');
    } else {
        // Obtener las canciones de un album especifico
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
        // Populamos el album de cada cancion 
        path: 'album',
        // Tambien podriamos prepopular los datos de artistas
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec()
        .then(songs => {
            if (!songs) {
                res.status(404).send({ message: 'No hay canciones' })
            } else {
                res.status(200).send({ songs })
            }
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error en la peticion', error: err });
        });
}

// Metodo para guardar cancion
async function saveSong(req, res) {
    var song = new Song();
    var params = req.body;
    try {
        song.number = params.number;
        song.name = params.name;
        song.duration = params.duration;
        song.file = null;
        song.album = params.album;
        // Guardar la cancion
        const songStored = await song.save();
        if (!songStored) {
            return res.status(400).send({ message: 'No se ha guardado la cancion' });
        }
        return res.status(200).send({
            message: 'Datos guardados correctamente.',
            song: songStored
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor', error: err });
    }
}

// Exportar metodos
module.exports = {
    getSong,
    saveSong,
    getSongs
}
