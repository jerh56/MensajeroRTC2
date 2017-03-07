var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGODB_URI || 'mongodb://localhost/MensajeroRTC';

MongoClient.connect(url, function(err, db) {

    if (err) throw err;

    exports.cargarDepartamento = function(dpto) {//cb

        var Departamento = db.collection('departamentos');

        Departamento.find().toArray(function(err, results) {
            dpto(results);
        });
    };


    exports.cargarOrigen = function(orig) {//co

        var Origen = db.collection('origs');

        Origen.find().toArray(function(err, results) {
            orig(results);
        });
    };    

    exports.cargarIncidencia = function(incidencia, dpto) {//cd

        var Incidencia = db.collection('tipis');

        Incidencia.find({coddep: incidencia}).toArray(function(err, results) {
            dpto(results);
        });
    };


});
