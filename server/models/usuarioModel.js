//-------------------------------------------Incuyendo moongose------------------------------
const mongoose = require('mongoose');
//------------------------------------------Incorporando unique validator ----------------
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    email: { type: String, required: [true, "El correo es necesario"], unique: true },
    password: { type: String, required: [true, "La clave es necesario"] },
    img: { type: String, required: false },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});
//Para evitar que el schema exporte en su JSON el password--------------------------------------
usuarioSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;
    return userObject;
};
//---------------------Decirle al schema que utilice iniqueValidator
usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

//Exportando el modelo------------------------------------
module.exports = mongoose.model('Usuario', usuarioSchema);