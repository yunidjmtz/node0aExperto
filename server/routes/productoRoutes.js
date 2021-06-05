//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();

//-------------------------------------Importando Modelo------------------------------------
const Producto = require('../models/productoModel');


//--------Incluyendo el underscore para filtrar los elementos que viajan en el body--------------------
const _ = require('underscore');

//-----------------middlewares para la autenticacion------------------
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');


//Obtener Todos los Productos
app.get('/producto', verificarToken, function(req, res) {

    let desde = req.query.desde || 0; //req.query viajan los parametros opcionales
    let limite = req.query.limite || 5;

    Producto.find({ disponible: true }, 'nombre precioUni descripcion')
        .populate('categoria', 'descripcion') //Para ordenar los elementos
        .populate('usuario', 'nombre email') //Permite buscar la tabla que tiene relacionada
        .skip(Number(desde)) //Convirtiendolo en un numero con el Number
        .limit(Number(limite))
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    "ok": false,
                    "err": err
                });
            }
            if (productos) {
                res.status(200).json({
                    "ok": true,
                    "productos": productos,
                    "totalRegistros": productos.length
                });
            } else {
                res.status(200).json({
                    "ok": true,
                    "message": "No existen elementos"
                });

            }
        });
});

//Obtener un producto por ID
app.get('/producto/:id', verificarToken, function(req, res) {

    let id = req.params.id;



    Producto.findById(id, 'nombre precioUni descripcion')
        .populate('categoria', 'descripcion') //Para ordenar los elementos
        .populate('usuario', 'nombre email') //Permite buscar la tabla que tiene relacionada        
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    "ok": false,
                    "err": err
                });
            }
            if (producto) {
                res.status(200).json({
                    "ok": true,
                    "productos": producto
                });
            } else {
                res.status(200).json({
                    "ok": true,
                    "message": "No existen elementos"
                });

            }
        });
});

//buscar un producto por una condicion
app.get('/producto/buscar/:termino', verificarToken, function(req, res) {

    let termino = req.params.termino;
    //Creando expresion regular basada en el termino
    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    "ok": false,
                    "err": err
                });
            }
            res.status(200).json({
                "ok": true,
                "productos": productos
            });

        });




});

//Crear productos
app.post('/producto', verificarToken, function(req, res) {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                "ok": false,
                "err": err
            });
        }
        res.status(200).json({
            "ok": true,
            "producto": productoDB
        });

    });

});

//Actualizar productos
app.put('/producto/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    //En este caso se aplica el metodo pick de underscore para filtrar que elementos se necesitan de los que viajan en el body
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                "ok": false,
                "err": err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                "ok": false,
                "err": { message: "El producto no existe" }
            });
        }
        res.status(200).json({
            "ok": true,
            "producto": productoDB
        });
    });
});

app.delete('/producto/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    //En este caso se aplica el metodo pick de underscore para filtrar que elementos se necesitan de los que viajan en el body
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                "ok": false,
                "err": err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                "ok": false,
                "err": { message: "El producto no existe" }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    "ok": false,
                    "err": err
                });
            }
            res.status(200).json({
                "ok": true,
                "message": "Producto eliminado correctamente"
            });

        });


    });
});

//Eliminar productos
//debe mantenerse solo se cambia el estado

//Exportando el fichero para poderlo utilizar en otros elementos
module.exports = app;