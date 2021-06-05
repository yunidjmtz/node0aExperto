//-----------------------------------------Leyendo Config-----------------------------------
require('./server/config/config');
//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();
//------------------------------------------Leyendo Body Parse-------------------------------
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//-------------------------------------------Incuyendo moongose------------------------------
const mongoose = require('mongoose');
//Importando rutas-------------------------------------------------------------------------
const routes = require('./server/routes/routes');
//RUTAS-----------------------------------------------------------------------------------------
app.use(routes);
//Inicializando la conexion a la base de datos-----------------------------------------------
mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) { throw err; }
    console.log('BASE DE DATOS ONLINE');
});
//------------------------Inicializando la api ------------------------------
app.listen(3000, () => {
    console.log("Escuchando puerto: 3000");
});