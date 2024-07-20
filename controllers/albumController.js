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

// Metodo para actualizar un album
async function updateAlbum(req, res) {
    // Obtener del parametros
    var albumId = req.params.id;
    // Obtener los datos del body por post
    var update = req.body;
    try {
        // Actualizar datos del album
        const albumUpdated = await Album.findByIdAndUpdate(albumId, update, { new: true });
        // Verificar si se ha encontrado y actualizado el documento del album
        if (albumUpdated) {
            return res.status(200).send({ album: albumUpdated });
        } else {
            return res.status(404).send({ message: 'No se ha actualizado el album' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar album', error: err });
    }
}

// Metodo para eliminar album
async function deleteAlbum(req, res) {
    // Obtener el id del album a eliminar por parametro de la url
    var albumId = req.params.id;
    try {
        // Eliminar el album mediante su id
        const albumRemoved = await Album.findByIdAndDelete(albumId);

        // Si no se encuentra el álbum, retornar error 404
        if (!albumRemoved) {
            return res.status(404).send({ message: 'El album no existe' });
        }

        // Eliminar las canciones asociadas al album
        await Song.deleteMany({ album: albumRemoved._id });

        // Retornar datos del album eliminado
        return res.status(200).send({ album: albumRemoved });
    } catch (err) {
        return res.status(500).send({ message: 'Error al eliminar album', error: err });
    }
}

// Exportar metodos
module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum
};