var lm = require('../models/lista_mensaje');

module.exports = exports = {

    dialogos: function(req, res) {
        /*res.render('index', {
            titulo: "Listas Desplegables en MEAN con rutas"
        });*/
        res.sendFile('dialogos.html', {root: './views'});
    },

    dpto: function(req, res) {
        lm.cargarDpto(function(data) {
            res.json(data);
        });
    },

    dialogo: function(req, res) {
        var cd = req.params.cd;

        lm.cargarDialogo(cd, function(data) {
            res.json(data);
        });
    },


};