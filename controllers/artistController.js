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

// Metodo para actualizar artista
async function updateArtist(req, res) {
    // Obtener del parametro de la url el id del artista
    var artistId = req.params.id;
    // Obtener los datos del body por post
    var update = req.body;
    try {
        // Actualizar datos de artista
        const artistUpdated = await Artist.findByIdAndUpdate(artistId, update, { new: true });
        // Verificar si se ha encontrado y actualizado el documento del artista
        if (artistUpdated) {
            // Si el registro existe, retornar los datos del registro modificado
            return res.status(200).send({ user: artistUpdated });
        } else {
            // Si el registro NO existe en la base de datos, mostrar un mensaje de error
            return res.status(404).send({ message: 'No se ha podido actualizar el artista' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar el usuario', error: err });
    }
}

// Metodo para eliminar un artista, albums y canciones
async function deleteArtist(req, res) {
    // Obtener del parametro de la url el id del artista
    var artistId = req.params.id;
    try {
        // Eliminar el documento de artista
        const artistRemoved = await Artist.findByIdAndDelete(artistId);
        if (!artistRemoved) {
            return res.status(404).send({ message: 'No se ha podido eliminar el artista' });
        }
        // En este punto se podria probar si elimina unicamente el artista
        // return res.status(200).send({ artist: artistRemoved });

        // Eliminar todos los albums asociados al artista
        const albumsRemoved = await Album.deleteMany({ artist: artistRemoved._id });

        // Eliminar las canciones asociadas a los álbumes eliminados
        if (albumsRemoved.deletedCount > 0) {
            await Song.deleteMany({ album: { $in: albumsRemoved.deletedCount } });
        }

        // Retornar datos del artista eliminado
        return res.status(200).send({ artist: artistRemoved });

    } catch (err) {
        return res.status(500).send({ message: 'Error al eliminar artista', error: err });
    }
}

// Metodo para subir archivos
async function uploadImage(req, res) {
    try {
        // Recibimos un artistId como parametro de la url
        var artistId = req.params.id;
        // Adicionamos un nombre por defecto del archivo
        var file_name = 'No subido...';
        // Comprobar si vienen files
        if (req.files) {
            // Obtener el path del archivo a subir
            var file_path = req.files.image.path;

            // Obtener el nombre de la imagen
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            // Obtener la extension del archivo
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            // Verificar si el archivo tiene la extension correcta
            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
                // Subir la imagen
                const artistUpdated = await Artist.findByIdAndUpdate(artistId, { image: file_name });
                if (artistUpdated) {
                    // Si el artista existe, retornar los datos del artista modificado
                    return res.status(200).send({ artist: artistUpdated });
                } else {
                    // Si el artista NO existe en la base de datos, mostrar un mensaje de error
                    return res.status(404).send({ message: 'No se ha podido actualizar el artista' });
                }
            } else {
                // Mandar mensaje
                res.status(401).send({ message: 'Extension del arvhivo no valida.' });
            }

            res.status(200).send({ message: 'La imagen se ha subido.' });
        } else {
            // En caso que no existan archivos
            res.status(200).send({ message: 'No has subido ninguna imagen...' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar el artista', error: err });
    }
}

// Metodo para obtener una imagen
function getImageFile(req, res) {
    var fileImage = req.params.imageFile;
    var filePath = './uploads/artists/' + fileImage;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(200).send({ message: 'No existe la imagen...' });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}