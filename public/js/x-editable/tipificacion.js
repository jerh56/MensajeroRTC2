var app = angular.module('app', []);

app.controller('TipificacionCtrl', function($scope, $http) {
    //$scope.mensaje = "Mundo desde un Controlador";
    /*$http.get('/data/dpto.json')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;
            $scope.cargarProv();
        });*/

    $http.get('/listas/db/dpto')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;


        });

});