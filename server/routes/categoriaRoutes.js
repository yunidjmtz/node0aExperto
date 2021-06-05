//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();

//-------------------------------------Importando Modelo------------------------------------
const Categoria = require('../models/categoriaModel');

//--------Incluyendo el underscore para filtrar los elementos que viajan en el body--------------------
const _ = require('underscore');

//-----------------middlewares para la autenticacion------------------
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');


//Mostrar todas las categorias
app.get('/categoria', verificarToken, function(req, res) {


    let desde = req.query.desde || 0; //req.query viajan los parametros opcionales
    let limite = req.query.limite || 5;


    Categoria.find({}, 'descripcion')
        .sort('descripcion') //Para ordenar los elementos
        .populate('usuario', 'nombre email') //Permite buscar la tabla que tiene relacionada
        .skip(Number(desde)) //Convirtiendolo en un numero con el Number
        .limit(Number(limite))
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    "ok": false,
                    "err": err
                });
            }
            Categoria.countDocuments({}, (err, cantRegistros) => { //Contar todos los usuarios

                res.status(200).json({
                    "ok": true,
                    "categorias": categorias,
                    "totalRegistros": cantRegistros
                });
            });

        });
});

//Mostrar categoria por id
app.get('/categoria/:id', function(req, res) {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                "ok": false,
                "err": err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                "ok": false,
                "err": "El id no es correcto"
            });
        }
        res.status(200).json({
            "ok": true,
            "categoria": categoriaDB
        });
    });

});

//Agregar Categoria
app.post('/categoria', verificarToken, function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                "ok": false,
                "err": err
            });
        }
        res.status(200).json({
            "ok": true,
            "categoria": categoriaDB
        });

    });
});

//Editar Categoria
app.put('/categoria/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    //En este caso se aplica el metodo pick de underscore para filtrar que elementos se necesitan de los que viajan en el body
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                "ok": false,
                "err": err
            });
        }
        res.status(200).json({
            "ok": true,
            "categoria": categoriaDB
        });
    });
});

//Eliminar Categoria
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], function(req, res) {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                "ok": false,
                "err": err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                "ok": false,
                "err": { message: 'Categoria no encontrado' }
            });
        }
        res.status(200).json({
            "ok": true,
            "categoriaE": categoriaBorrada
        });
    });

});




//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;