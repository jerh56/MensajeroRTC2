var mongoose = require('mongoose');

var DescripcionSchema = mongoose.Schema({	
		
		coddep:				String,
 		descripcion:		String,
 		createdAt: 			{type:Date, default: Date.now}

});

module.exports = mongoose.model('Descripciones', DescripcionSchema);