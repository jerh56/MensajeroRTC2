var mongoose = require('mongoose');

// RegistroEmpresa Schema
var DepartamentoSchema = mongoose.Schema({
	
	coddep:				String,
	desdep: 			String,
	status: 			{type:String, default: true},
	createdAt: 			{type:Date, default: Date.now}
});

module.exports = mongoose.model('Departamento', DepartamentoSchema);