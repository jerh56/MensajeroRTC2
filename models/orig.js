var mongoose = require('mongoose');

// RegistroEmpresa Schema
var OrigSchema = mongoose.Schema({
	
	codorig: 		String,
	desorig: 		String,


});

module.exports = mongoose.model('Orig', OrigSchema);