var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    nombre: String,
    idroom: String,
    cantidad: { type: Number, default: 0 },
    userid: String,
    fecha_desconect: {type:Date},
    fecha_conect: {type:Date},
    estatus: { type: Number, default: 1 } /* 1 Conectado, 0 Desconectado */
});
module.exports = mongoose.model('agentnames', userSchema);