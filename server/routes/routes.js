//------------------------------------------Leyendo express---------------------------------
const express = require('express');
const app = express();

//----------------------Usando las rutas------------------
app.use(require('./indexRoutes'));
app.use(require('./loginRoutes'));
app.use(require('./usuarioRoutes'));
app.use(require('./categoriaRoutes'));
app.use(require('./productoRoutes'));
app.use(require('./uploadRoutes'));
app.use(require('./imagenesRoutes'));

module.exports = app;