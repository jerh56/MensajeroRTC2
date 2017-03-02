var app = angular.module('app', []);

app.controller('TipificacionCtrl', function($scope, $http) {


    $http.get('/tipificacion/db/departamento')
        .success(function(data) {
            $scope.dptos = data;
            $scope.dpto = data[0].coddep;

            $scope.cargarTipi();
        });

    $scope.cargarTipi = function() {
        $http.get('/tipificacion/db/tipi/' + $scope.dpto)
            .success(function(data) {

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