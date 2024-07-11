'use strict'

// Importar los modulos necesarios
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

// Mediante una funcion guardar los datos de user en un token codificado
exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    // Devolver el token con el payload cifrado
    // Generar el hash mediante una clave secreta
    return jwt.encode(payload, secret);
};
// sub: guarda el id del usuario
// iat: fecha actual de creacion del token
// exp: fecha de expiracion del token