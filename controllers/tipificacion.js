var TipificacionController = require('../models/tipificacion');

module.exports = exports = {



    departamento: function(req, res){
        TipificacionController.cargarDepartamento(function(data){
            res.json(data);
        });
    },

    origen: function(req, res){
        TipificacionController.cargarOrigen(function(data){
            res.json(data);
        });
    },
   


    incidencia: function(req, res){
        var incidencia = req.params.incidencia;

        TipificacionController.cargarIncidencia(incidencia, function(data){
            res.json(data);
        });
    },


};