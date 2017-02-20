var mongoose = require('mongoose');



var DescripcionSchema = mongoose.Schema({
	
		
	coddep:				String,
	descripcion:		String,
	
	
});

module.exports = mongoose.model('Descripcion', DescripcionSchema);