//------------------------------------------Leyendo express---------------------------------
//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();

//-------------------------------------Importando Modelo------------------------------------
const Usuario = require('../models/usuarioModel');

//--------Incorporando bcrypt para encriptar la contraseña del usuario en el post---------------------
const bcrypt = require('bcrypt');

//---------JWT para generar token---------------------------------
const jwt = require('jsonwebtoken');


app.post('/login', function(req, res) {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                "ok": false,
                "err": err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                "ok": false,
                "message": "Credenciales Incorrectas --email",
                "err": err
            });
        }
        //Comparando la contraseña encriptada
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                "ok": false,
                "message": "Credenciales Incorrectas --password",
                "err": err
            });
        }

        //Generando el token
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(200).json({
            "ok": true,
            "usuario": usuarioDB,
            "token": token
        });
    });
});

//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;