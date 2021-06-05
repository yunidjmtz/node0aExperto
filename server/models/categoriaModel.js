//-------------------------------------------Incuyendo moongose------------------------------
const mongoose = require('mongoose');
//------------------------------------------Incorporando unique validator ----------------
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;
let categoriaSchema = new Schema({

    descripcion: { type: String, required: [true, "La descripcion es necesario"], unique: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

//---------------------Decirle al schema que utilice iniqueValidator
categoriaSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

//Exportando el modelo------------------------------------
module.exports = mongoose.model('Categoria', categoriaSchema);