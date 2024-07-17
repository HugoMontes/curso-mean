'use strict'

// Importar modulos necesarios
var path = require('path');
var fs = require('fs');
// Importar modulo de paginacion
var mongoosePaginate = require('mongoose-pagination-v2');

// Importar modelos a usar
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Metodo para obtener un artista de la BD
async function getArtist(req, res) {
    try {
        // Recoger el parametro id de artista que llega por URL 
        var artistId = req.params.id;
        // Buscar el artista por su id
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).send({ message: 'El artista no existe' });
        } else {
            return res.status(200).send({ artist });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error en la peticion buscar artista', error: err });
    }
}

// Metodo para obtener artistas paginados
async function getArtists(req, res) {
    // Inicializamos los parametros de la paginacion
    // Obtener parametro de page en caso que exista
    var page = parseInt(req.params.page) || 1;
    var itemsPerPage = 3;
    try {
        var options = {
            page: page,
            limit: itemsPerPage,
            sort: { name: 1 } // Ordenar por nombre de manera ascendente
        };
        // Obtener todos los artistas ordenados por nombre y paginados
        var result = await Artist.paginate({}, options);
        var artists = result.docs;
        var total = result.totalDocs;
        if (!artists || artists.length === 0) {
            return res.status(404).send({ message: 'No hay artistas' });
        } else {
            return res.status(200).send({
                total_items: total,
                artists: artists
            });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error en la peticion' });
    }
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
    saveArtist,
    getArtists
}