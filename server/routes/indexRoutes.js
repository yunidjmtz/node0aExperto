//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.status(200).json({
        "ok": true,
        "mensaje": "Peticion realizada correctamente"
    });
});


//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;