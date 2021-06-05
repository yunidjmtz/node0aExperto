//Definiendo el puerto
process.env.PORT = process.env.PORT || 3000;

//Definiendo el SEED y caducidad del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || "yunidjmtz_89121927467";