var app = angular.module('app', []);

app.controller('MensajeCtrl', function($scope, $http) {
    //$scope.mensaje = "Mundo desde un Controlador";
    /*$http.get('/data/dpto.json')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;
            $scope.cargarProv();
        });*/

    $http.get('/dialogos/db/dpto')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;

            $scope.cargarDialogo();
        });

    $scope.cargarDialogo = function() {
        // $http.get('/data/prov.json')
        $http.get('/dialogos/db/dialogo/' + $scope.dpto)
            .success(function(data) {
                /*data = data.filter(function(item) {
                    return (item.coddep == $scope.dpto);
                });*/
                $scope.dialogos = data;
                $scope.dialogo = data[0].coddial;
                $scope.tecla1 = data[0].tecla_1;
                $scope.tecla2 = data[0].tecla_2

               // $scope.cargarOrig();
            });
    };


});