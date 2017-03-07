var app = angular.module('app', []);

app.controller('TipificacionCtrl', function($scope, $http) {


    $http.get('/tipificacion/db/departamento')
        .success(function(data) {
            $scope.departamentos = data;
            $scope.departamento = data[0].coddep;

            $scope.cargarIncidencia();
        });

    $scope.cargarIncidencia = function() {
        $http.get('/tipificacion/db/incidencia/' + $scope.departamento)
            .success(function(data) {

                $scope.incidencias = data;
                $scope.incidencia = data[0].codpro;

            });
    };

    
        $http.get('/tipificacion/db/origen/')
            .success(function(data){

                $scope.origenes = data;
                $scope.origen = data[0].codorig;

            });
    //};
});