'use strict'

// Importar los modulos necesarios
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

// Crear una funcion para comprobar si los datos del token son correctos
exports.ensureAuth = function (req, res, next) {
    // Verificar si existe la cabecera de authorization
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticacion' });
    }
    // Obtener el token de authorization 
    // Quitar las comillas simples y dobles que podrian estar al inicio y al final de la cadena
    // Reemplazar las comillas dobles y simples por una cadena vacia ''
    var token = req.headers.authorization.replace(/['"]+/g, '');

    // Captura el error al momento de codificar el token
    try {
        // Obtener el objeto que esta guardado en el token
        var payload = jwt.decode(token, secret);
        // Verificar si la fecha de expiracion es menor a la fecha actual
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (ex) {
        // console.log(ex);
        return res.status(404).send({ message: 'Token no valido' });
    }
    // Adicionar al request los datos del usuario/payload para evitar decodificar dentro un
    // controlador que necesite los datos del usuario.
    // Dentro de un controlador obtendremos los datos de user desde req
    req.user = payload;
    // Salimos del middleware con next()
    next();
};