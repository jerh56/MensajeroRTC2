var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    nombre: String,
    idroom: String,
    userid: String
});

module.exports = mongoose.model('waitlist', userSchema);