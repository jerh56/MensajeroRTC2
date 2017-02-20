var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    userid: String,
    roomid: String,
    useridagent: String,
    fecha_creacion: 	{type:Date},
    username: String
});
module.exports = mongoose.model('rooms', userSchema);