//-----------------------------------------Importaciones-----------------------------------
const express = require('express');
const app = express();
//Incorporando el fileSystem 
const fs = require('fs');
//incorporando path para crear las rutas directas a las imagenes
const path = require('path');


app.get('/images/:tipo/:img', function(req, res) {

    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    //-----------------------------Verificando que exista la imagen
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }


    //-------------------------------------------------------------










});













//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;