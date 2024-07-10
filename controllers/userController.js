'use strict'

// Importar modulo para cifrar contraseñas
var argon2 = require('argon2');
// Importar el modelo de usuario
var User = require('../models/user');

// Crear metodo que retorna un mensaje
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del contnrolador de usuarios'
    })
}

// Metodo para registrar usuario usando async/await
async function saveUser(req, res) {
    try {
        // Instanciar un objeto user
        var user = new User();
        // Obtener los parametros de body
        var params = req.body;
        // Mostrar en consola los datos enviados
        console.log(params);
        // Obtener los parametros en user
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_ADMIN';
        user.image = null;
        // Cifrar la contraseña
        if (params.password) {
            // Cifrar contraseña usando async/await
            const hash = await argon2.hash(params.password);
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                // Guardar usuario usando async/await
                const userStored = await user.save();
                if (!userStored) {
                    return res.status(400).send({ message: 'No se ha registrado el usuario' });
                }
                return res.status(200).send({
                    message: 'Datos guardados correctamente.',
                    user: userStored
                });
            } else {
                return res.status(400).send({ message: 'Debe llenar todos los datos' });
            }
        } else {
            return res.status(400).send({ message: 'Introduce la contraseña' });
        }
    } catch (error) {
        return res.status(500).send({ message: 'Error al registrar el usuario' });
    }
}

// Exportar los metodos en un modulo
module.exports = {
    pruebas,
    saveUser
}
