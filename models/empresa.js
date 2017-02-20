var mongoose = require('mongoose');



var empresaSchema = mongoose.Schema({
	
		
	Nombre:			String,
	Razon_Social:	String,
	RFC:			String,
	Pais:			String,
	Estado:			String,
	Ciudad:			String,
	Colonia:		String,
	Calle:			String,
	Numero:			String,
	Telefono:		String,

	
});

module.exports = mongoose.model('Empresa', empresaSchema);