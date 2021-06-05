//---------JWT para generar token---------------------------------
const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    //El token viaja por los headers y se leen de la siguiente forma
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                "ok": false,
                "err": err
            });
        }
        //Como en la generaion del token se envio el usuario, ya se puede enviar por el request;
        req.usuario = decoded.usuario;
        next();
    });
};
let verificarAdminRole = (req, res, next) => {

    let role = req.usuario.role;
    if (role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            "ok": false,
            "err": "El usuario no es administrador"
        });
    }
};
let verificarTokenURL = (req, res, next) => {
    //El token viaja por los headers y se leen de la siguiente forma
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                "ok": false,
                "err": err
            });
        }
        //Como en la generaion del token se envio el usuario, ya se puede enviar por el request;
        req.usuario = decoded.usuario;
        next();
    });
};
module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenURL
}