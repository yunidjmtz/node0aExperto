//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();

//-------------------------------------Importando Modelo------------------------------------
const Usuario = require('../models/usuarioModel');

//--------Incorporando bcrypt para encriptar la contraseña del usuario en el post---------------------
const bcrypt = require('bcrypt');

//--------Incluyendo el underscore para filtrar los elementos que viajan en el body--------------------
const _ = require('underscore');



//Rutas para el CRUD-------------------------------------------------
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0; //req.query viajan los parametros opcionales
    let limite = req.query.limite || 5;


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(Number(desde)) //Convirtiendolo en un numero con el Number
        .limit(Number(limite))
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    "ok": false,
                    "err": err
                });
            }
            Usuario.count({ estado: true }, (err, cantRegistros) => { //Contar todos los usuarios

                res.status(200).json({
                    "ok": true,
                    "usuarios": usuarios,
                    "totalRegistros": cantRegistros
                });





            });

        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //Encriptando la contrasena
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
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

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //En este caso se aplica el metodo pick de underscore para filtrar que elementos se necesitan de los que viajan en el body
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Dentro de las opciones de findByIdAndUpdate esta la de (new) que es para decir si usuarioDB sea el nuevo o el viejo en la respuesta y (runValidators) que es para ejecutar las validaciones del schema y (context) para que ejecute las validaciones de uniqueValidator

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
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

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                "ok": false,
                "err": err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                "ok": false,
                "err": { message: 'Usuario no encontrado' }
            });
        }
        res.status(200).json({
            "ok": true,
            "usuarioE": usuarioBorrado
        });


    });

});





//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;