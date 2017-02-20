var MongoClient = require('mongodb').MongoClient;

var url = process.env.MONGODB_URI || 'mongodb://localhost/MensajeroRTC';

MongoClient.connect(url, function(err, db) {

    if (err) throw err;

    exports.cargarDpto = function(cb) {

        var Dpto = db.collection('dpto');

        Dpto.find().toArray(function(err, results) {
            cb(results);
        });
    };


    exports.cargarOrig = function(co) {

        var Orig = db.collection('origs');

        Orig.find().toArray(function(err, results) {
            co(results);
        });
    };    

    exports.cargarTipi = function(cd, cb) {

        var Tipi = db.collection('tipis');

        Tipi.find({coddep: cd}).toArray(function(err, results) {
            cb(results);
        });
    };


});
