'use strict'

// Importar modulo para trabajar con sistema de ficheros
var fs = require('fs');
// Importar modulo para trabajar con las rutas
var path = require('path');
// Importar modulo para cifrar contraseñas
var argon2 = require('argon2');
// Importar el modelo de usuario
var User = require('../models/user');
// Importar los metodos del servicio jwt
var jwt = require('../services/jwt');

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

// Función para loguearse
async function loginUser(req, res) {
    try {
        const params = req.body;
        // Obtener los datos desde params
        const email = params.email;
        const password = params.password;

        // Buscar un usuario con un determinado email en la base de datos
        const user = await User.findOne({ email: email.toLowerCase() });
        // Verificar que exista
        if (!user) {
            return res.status(404).send({ message: 'El usuario no existe' });
        }

        // Comprobar que contraseña enviada sea la misma que la que se tiene en BD
        const success = await argon2.verify(user.password, password);
        // Verificar que sean iguales las contraseñas
        if (success) {
            // Devolver los datos del usuario logueado
            if (params.gethash) {
                // Devolver un token de jwt
                res.status(200).send({
                    token: jwt.createToken(user)
                });
            } else {
                return res.status(200).send({ user });
            }
        } else {
            return res.status(404).send({ message: 'El usuario no ha podido loguearse' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}

// Metodo para actualizar datos de user
async function updateUser(req, res) {
    try {
        // Obtener la id desde la url
        var userId = req.params.id;
        // Obtener el body de la peticion
        var update = req.body;

        // Actualizar los datos de usuario
        const userUpdated = await User.findByIdAndUpdate(userId, update, { new: true });
        // Verificar si se ha encontrado el usuario
        if (userUpdated) {
            // Si el usuario existe, retornar los datos del usuario modificado
            return res.status(200).send({ user: userUpdated });
        } else {
            // Si el usuario NO existe en la base de datos, mostrar un mensaje de error
            return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar el usuario', error: err });
    }
}

// Metodo para subir archivos
async function uploadImage(req, res) {
    try {
        // Recibimos un userId como parametro de la url
        var userId = req.params.id;
        // Adicionamos un nombre por defecto del archivo
        var file_name = 'No subido...';
        // Comprobar si vienen files
        if (req.files) {
            // Obtener el path del archivo a subir
            var file_path = req.files.image.path;
            // Mostar por consola la ruta del archivo
            // console.log(file_path);
            // return res.status(200).send({ message: 'La imagen se ha subido' });

            // Obtener el nombre de la imagen
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            // Obtener la extension del archivo
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            // Verificar si el archivo tiene la extension correcta
            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
                // Subir la imagen
                const userUpdated = await User.findByIdAndUpdate(userId, { image: file_name });
                if (userUpdated) {
                    // Si el usuario existe, retornar los datos del usuario modificado
                    return res.status(200).send({
                        image: file_name,
                        user: userUpdated
                    });
                } else {
                    // Si el usuario NO existe en la base de datos, mostrar un mensaje de error
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
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
        return res.status(500).send({ message: 'Error al actualizar el usuario', error: err });
    }
}

// Metodo para obtener una imagen
function getImageFile(req, res) {
    var fileImage = req.params.imageFile;
    var filePath = './uploads/users/' + fileImage;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(200).send({ message: 'No existe la imagen...' });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

// Exportar los metodos en un modulo
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}
