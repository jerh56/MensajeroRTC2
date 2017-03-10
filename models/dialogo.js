var mongoose = require('mongoose');
var dialogoSchema = mongoose.Schema({	
	codigo_dialogo: String,	
	descripcion_dialogo: String,
	codigo_departamento: String,
	tecla_1: String,
	tecla_2: String,
	status: {type:Boolean, default: true}	
});

module.exports = mongoose.model('Dialogo', dialogoSchema);