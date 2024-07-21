'use strict'

// Importar modulos necesarios
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination-v2');

// Importar modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Crer un metodo de prueba
function getSong(req, res){
    res.status(200).send({message: 'Controlador cancion'});
}

// Exportar metodos
module.exports = {
    getSong
}
