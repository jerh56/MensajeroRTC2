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

        var Origen = db.collection('origenes');

        Origen.find().toArray(function(err, results) {
            orig(results);
        });
    };    

    exports.cargarIncidencia = function(incidencia, dpto) {//cd

        var Incidencia = db.collection('incidencias');

        Incidencia.find({ $and: [ {coddep: incidencia}, {status : true} ]}).toArray(function(err, results) {

            dpto(results);

        });
    };
});
