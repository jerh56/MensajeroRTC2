var mongoose = require('mongoose');
var OrigenSchema = mongoose.Schema({	
	codigo_origen: String,
	descripcion_origen: String,
});

module.exports = mongoose.model('Origenes', OrigenSchema);