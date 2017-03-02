var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    userid: String,
    roomid: String,
    useridagent: String,
    fecha_creacion: {type:Date}
});
module.exports = mongoose.model('apartado', userSchema);