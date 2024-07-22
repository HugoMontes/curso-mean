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

// Metodo para actualizar cancion
async function updateSong(req, res) {
    // Obtener del parametros
    var songId = req.params.id;
    // Obtener los datos del body por put
    var update = req.body;

    try {
        // Actualizar datos de la cancion
        const songUpdated = await Song.findByIdAndUpdate(songId, update, { new: true });
        // Verificar si se ha encontrado y actualizado el documento de la cancion
        if (songUpdated) {
            return res.status(200).send({ song: songUpdated });
        } else {
            return res.status(404).send({ message: 'No se ha actualizado la cancion' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar cancion', error: err });
    }
}

// Metodo para eliminar una cancion
async function deleteSong(req, res) {
    // Obtener el id de la cancion a eliminar
    var songId = req.params.id;
    try {
        // Eliminar el song mediante su id
        const songRemoved = await Song.findByIdAndDelete(songId);

        // Si no se encuentra la cancion, retornar error 404
        if (!songRemoved) {
            return res.status(404).send({ message: 'La cancion no existe' });
        }

        // Retornar datos del song eliminado
        return res.status(200).send({ song: songRemoved });
    } catch (err) {
        return res.status(500).send({ message: 'Error al eliminar cancion', error: err });
    }
}

// Metodo para subir archivos
async function uploadFile(req, res) {
    try {
        // Recibimos el id de una cancion como parametro de la url
        var songId = req.params.id;
        // Adicionamos un nombre por defecto del archivo
        var file_name = 'No subido...';
        // Comprobar si vienen files
        if (req.files) {
            // Obtener el path del archivo a subir
            var file_path = req.files.file.path;

            // Obtener el nombre de la imagen
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            // Obtener la extension del archivo
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            // Verificar si el archivo tiene la extension correcta
            if (file_ext == 'mp3' || file_ext == 'ogg') {
                // Subir la imagen
                const songUpdated = await Song.findByIdAndUpdate(songId, { file: file_name });
                if (songUpdated) {
                    // Si la cancion existe, retornar los datos de la cancion modificado
                    return res.status(200).send({ song: songUpdated });
                } else {
                    // Si la cancion NO existe en la base de datos, mostrar un mensaje de error
                    return res.status(404).send({ message: 'No se ha podido actualizar la cancion' });
                }
            } else {
                // Mandar mensaje
                res.status(401).send({ message: 'Extension del archivo no valida.' });
            }

            res.status(200).send({ message: 'El archivo se ha subido.' });
        } else {
            // En caso que no existan archivos
            res.status(200).send({ message: 'No has subido ningun archivo...' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar archivo de audio', error: err });
    }
}

// Metodo para obtener una imagen
function getSongFile(req, res) {
    var fileSong = req.params.songFile;
    var filePath = './uploads/songs/' + fileSong;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(200).send({ message: 'No existe el archivo...' });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

// Exportar metodos
module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}
