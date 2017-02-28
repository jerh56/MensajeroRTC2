var ug = require('../models/ubigeo');

module.exports = exports = {

    tipificacion: function(req, res) {
 
        res.sendFile('tipificacion.html', {root: './views'});
    },

    dpto: function(req, res){
        ug.cargarDpto(function(data){
            res.json(data);
        });
    },

    orig: function(req, res){
        ug.cargarOrig(function(data){
            res.json(data);
        });
    },
   


    tipi: function(req, res){
        var cd = req.params.cd;

        ug.cargarTipi(cd, function(data){
            res.json(data);
        });
    },


};