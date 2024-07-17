'use strict'

// Importar el modulo de mongoose
var mongoosePaginate = require('mongoose-paginate-v2');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
    name: String,
    description: String,
    image: String
});

// Añadir la funcionalidad de paginacion al esquea de artist
ArtistSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Artist', ArtistSchema);