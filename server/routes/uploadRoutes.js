//-----------------------------------------Importaciones-----------------------------------
const express = require('express');
const app = express();
// Incorporar fileupload
const fileUpload = require('express-fileupload');

//Incorporando el fileSystem para eliminar las imagenes
const fs = require('fs');
//incorporando el paquete de path para construir un path para construir la ruta y borrar las imagenes
const path = require('path');
//Este middlewares lo que hace es que todo el archivo que se suba al server va para req.files
app.use(fileUpload());
//Importando los modelos para savlvar en la base de datos
const Usuario = require('../models/usuarioModel');
const Producto = require('../models/productoModel');

//----------------------------------------FIN Importaciones --------------------------------


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //Validando que sea valido el tipo en la URL--------------------------------------------
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            "ok": false,
            "err": {
                message: 'Los tipos permitidos son' + ' ' + tiposValidos.join(',')
            },
            "tipo": tipo
        });
    }
    //FIN Validando que sea valido el tipo en la URL-----------------------------------------

    //----------------Validando que exista el archivo----------------------------------------
    if (!req.files) {
        return res.status(400).json({
            "ok": false,
            "err": { message: 'No se ha seleccionado archivo' }
        });
    }
    let file = req.files.archivo;

    //---------------------------------------------Verificando la extension--------------------------
    let extensionesValidas = ['png', 'jpeg', 'gif', 'jpg'];
    //Cortando el nombre para cogerle la extension
    let nombreArchivoCortado = file.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            "ok": false,
            "err": {
                message: 'Las extensiones permitidas son' + ' ' + extensionesValidas.join(',')
            },
            "ext": extension
        });
    }
    //----------------------------------------------------------------------------------------------------
    let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //-----------------------------------Cambiar el nombre del fichero------------------------------------

    //Moviendo la imagen a la carpeta definida
    file.mv(`uploads/${tipo}/${filename}`, (err) => {
        if (err) {
            return res.status(400).json({
                "ok": false,
                "err": err
            });
        }
        if (tipo === "usuarios") {
            guardarImagenUsuario(id, res, filename);
        } else {
            guardarImagenProducto(id, res, filename);
        }
    });
});

//Metodo para agregar las imagenes a los elementos de la base de datos

function guardarImagenUsuario(id, res, filename) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(filename, "usuarios");
            return res.status(500).json({
                "ok": false,
                "err": err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(filename, "usuarios");
            return res.status(500).json({
                "ok": false,
                "err": { message: "El usuario no existe" }
            });
        }
        //Verificando que el usuario tenga una imagen, para eliminarla y agregar la nueva---------------
        borrarArchivo(usuarioDB.img, "usuarios");
        //-------------------------------------------------------------------------------------------------
        usuarioDB.img = filename;
        usuarioDB.save((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    "ok": false,
                    "err": err
                });
            }
            res.status(200).json({
                "ok": true,
                "usuario": usuarioDB
            });
        });
    });
}

function guardarImagenProducto(id, res, filename) {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(filename, "productos");
            return res.status(500).json({
                "ok": false,
                "err": err
            });
        }
        if (!productoDB) {
            borrarArchivo(filename, "productos");
            return res.status(500).json({
                "ok": false,
                "err": { message: "El producto no existe" }
            });
        }


        //Verificando que el producto no tenga una imagen antigua, en su caso se borra
        borrarArchivo(productoDB.img, "productos");

        productoDB.img = filename;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    "ok": false,
                    "err": err
                });
            }
            res.status(200).json({
                "ok": true,
                "usuario": productoDB
            });
        });
    });

}



function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}



//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;