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
//-------------------------------------------------------------------------------------------


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.status(200).json({
        "ok": true,
        "mensaje": "Peticion realizada correctamente"
    });
});

app.listen(3000, () => {
    console.log("Escuchando puerto: 3000");
});