var mongoose = require('mongoose');



var dialogoSchema = mongoose.Schema({
	
		coddial: 	String,	
		desdia:		String,
		coddep:		String,
		tecla_1:	String,
		tecla_2: 	String,
		status: 	{type:Boolean, default: true}


	
});

module.exports = mongoose.model('Dialogo', dialogoSchema);