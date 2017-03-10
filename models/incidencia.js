var mongoose = require('mongoose');
var IncidenciaSchema = mongoose.Schema({		
	codigo_incidencia:		String,
	descripcion_incidencia:		String,
	codigo_departamento:		String,
	status: 	{type:Boolean, default: true}
});

module.exports = mongoose.model('Incidencias', IncidenciaSchema);