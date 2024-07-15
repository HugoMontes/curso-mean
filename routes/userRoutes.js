'use strict'

// Cargar modulo de express
var express = require('express');
// Cargar el controlador
var UserController = require('../controllers/userController');
// Cargar ruter de express
var api = express.Router();
// Importar el middleware para autenticacion
var md_auth = require('../middlewares/authenticated');
// Cargar el modulo para cargaer archivos
var multipart = require('connect-multiparty');
// Indicar el directorio donde se van a subir los archivos
var md_upload = multipart({ uploadDir: './uploads/users' });

// Crear la ruta y asociarlo con el metodo del controlador
// Para usar un middleware lo pasamos como segundo parametro en el metodo.
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
// Para recoger los archivos que llegan por file usar md_upload
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

// Exportar en un modulo 
module.exports = api;
