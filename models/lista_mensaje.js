var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGODB_URI || 'mongodb://localhost/MensajeroRTC';

MongoClient.connect(url, function(err, db) {

    if (err) throw err;

    exports.cargarDpto = function(cb) {

        var Dpto = db.collection('departamentos');

        Dpto.find().toArray(function(err, results) {
            cb(results);
        });
    };

    exports.cargarDialogo = function(cd, cb) {

        var Dialogo = db.collection('dialogos');

        Dialogo.find({codigo_departamento: cd}).toArray(function(err, results) {
            cb(results);
        });
    };



});
