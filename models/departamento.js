var mongoose = require('mongoose');
var DepartamentoSchema = mongoose.Schema({	
	codigo_departamento: String,
	descripcion_departamento: String,
	status: {type:String, default: true},
	createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model('Departamento', DepartamentoSchema);