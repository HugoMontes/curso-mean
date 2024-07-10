'use strict'

// Crear metodo que retorna un mensaje
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del contnrolador de usuarios'
    })
}

// Exportar los metodos en un modulo
module.exports = {
    pruebas
};