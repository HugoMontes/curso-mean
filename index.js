'use strict'

// Cargamos el modulo mongoose
var mongoose = require('mongoose');
// Cargar el modulo app para cargar las configuraciones
var app = require('./app');
// Configurar un puerto para el API
var port = process.env.PORT || 3977;

// Función asíncrona para conectar a la base de datos
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/curso_mean');
        app.listen(port, function () {
            console.log("Servidor del API rest de musica escuchando en http://localhost:" + port);
        });
        console.log("La conexion a la base de datos está funcionando correctamente...");
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err);
        throw err;
    }
}

// Llamamos a la función para conectar a la base de datos
connectDB();