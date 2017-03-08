var mongoose = require('mongoose');

// RegistroEmpresa Schema
var OrigenSchema = mongoose.Schema({
	
	codorig: 		String,
	desorig: 		String,


});

module.exports = mongoose.model('Origenes', OrigenSchema);