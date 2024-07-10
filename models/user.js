'use strict'

// Cargar el modulo de mongoose para acceder a la BD
var mongoose = require('mongoose');
// Crear una variable para definir schemas de la base de datos.
var Schema = mongoose.Schema;

// Crear un schema para usuario
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

// Exportar el modelo usando el schema de user
module.exports = mongoose.model('User', UserSchema);