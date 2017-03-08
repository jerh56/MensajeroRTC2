var mongoose = require('mongoose');

	// RegistroEmpresa Schema
	var IncidenciaSchema = mongoose.Schema({
		
		codpro:		String,
		despro:		String,
		coddep:		String,
		status: 	{type:Boolean, default: true}

	});

module.exports = mongoose.model('Incidencias', IncidenciaSchema);