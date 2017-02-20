var app = angular.module('app', []);

app.controller('TipificacionCtrl', function($scope, $http) {
    //$scope.mensaje = "Mundo desde un Controlador";
    /*$http.get('/data/dpto.json')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;
            $scope.cargarProv();
        });*/

    $http.get('/tipificacion/db/dpto')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;

            $scope.cargarTipi();
        });

    $scope.cargarTipi = function() {
        // $http.get('/data/prov.json')
        $http.get('/tipificacion/db/tipi/' + $scope.dpto)
            .success(function(data) {
                /*data = data.filter(function(item) {
                    return (item.coddep == $scope.dpto);
                });*/
                $scope.tipis = data;
                $scope.tipi = data[0].codpro;

            });
    };

    
    //$scope.cargarOrig = function(){

        $http.get('/tipificacion/db/orig/')
            .success(function(data){

                $scope.origs = data;
                $scope.orig = data[0].codorig;

            });
    //};
});