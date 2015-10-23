angular.module('appTareas', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('alta', {
                url: '/alta',
                templateUrl: 'views/alta.html',
                controller: 'ctrlAlta'
            })
            .state('editar', {
                url: '/editar',
                templateUrl: 'views/editar.html',
                controller: 'ctrlEditar'
            });

        $urlRouterProvider.otherwise('alta');
    })
    .factory('comun', function($http) {
        var comun = {}

        comun.tareas = []

        comun.tarea = {};

        comun.eliminar = function(tarea) {
            var indice = comun.tareas.indexOf(tarea);
            comun.tareas.splice(indice, 1);
        }

        /** Métodos remotos **/

        //GET
        comun.getAll = function(){
            return $http.get('/tareas')
            .success(function(data){
                angular.copy(data, comun.tareas);
                comun.tareas = data;
                return comun.tareas;
            })
        }

        //POST
        comun.postTarea = function(tarea){
            return $http.post('/tarea', tarea)
            .success(function(tareaCreada){
                comun.tareas.push(tareaCreada);
            })
        }

        //PUT
        comun.actualizarTarea = function(tarea){
            return $http.put('/tarea/' + tarea._id, tarea)
            .success(function(tareaActualizada){
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas[indice] = tareaActualizada;
            })
        }

        //DELETE
        comun.eliminarTarea = function(tarea){
            return $http.delete('/tarea/' + tarea._id)
            .success(function(){
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas.splice(indice, 1);
            })
        }

        return comun;
    })
    .controller('ctrlAlta', function($scope, $state, comun) {
        $scope.tarea = {}
            // $scope.tareas = [];

        comun.getAll();

        $scope.ejemploNodemon = Date.now();

        $scope.tareas = comun.tareas;

        $scope.prioridades = ['Baja', 'Normal', 'Alta'];

        $scope.agregar = function() {
            comun.postTarea({
                nombre: $scope.tarea.nombre,
                prioridad: parseInt($scope.tarea.prioridad)
            })

            $scope.tarea.nombre = '';
            $scope.tarea.prioridad = '';
        }

        $scope.masPrioridad = function(tarea) {
            tarea.prioridad += 1;
        }

        $scope.menosPrioridad = function(tarea) {
            tarea.prioridad -= 1;
        }

        $scope.eliminar = function(tarea) {
            comun.eliminarTarea(tarea);
        }

        $scope.procesaObjeto = function(tarea) {
            comun.tarea = tarea;
            $state.go('editar');
        }

    })
    .controller('ctrlEditar', function($scope, $state, comun) {
        $scope.tarea = comun.tarea;

        $scope.actualizar = function() {

            comun.actualizarTarea($scope.tarea);
            $state.go('alta');
        }

        $scope.eliminar = function() {
            comun.eliminarTarea($scope.tarea);
            $state.go('alta');
        }
    })
