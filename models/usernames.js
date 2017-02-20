var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    nombre: String,
    socketid: String,
    userid: String,
    idroom: String,
    fecha_desconect: {type:Date},
    fecha_conect: {type:Date},
    estatus: { type: Number, default: 0 } /* 1 Conectado, 0 Desconectado */
});

module.exports = mongoose.model('usernames', userSchema);