'use strict'

var myapp = angular.module('MEAN', [
        'ngRoute',
        'angularFileUpload'
    ]).
    config(['$routeProvider', function ($routeProvider) {

        // These are the routes for our angular SPA
        // To see the routes for the REST api look at ../../routes.js

        $routeProvider.
            when('/', {templateUrl: '/partials/home.html'}).
            when('/file-upload/', {templateUrl: '/partials/file-upload.html', controller: FileUploadCtrl}). // userCtrl is defined below
            otherwise({redirectTo: '/'});
    }]);

// Controllers

function FileUploadCtrl($scope, $upload) {
    $scope.image = null;

    $scope.onFileSelect = function (files) {
        $scope.image = null;
        angular.forEach(files,function(file){
            $scope.upload = $upload.upload({
                url: '/api/images/' + file.name, //upload.php script, node.js route, or servlet url
                method: 'PUT',
                file: file
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                $scope.image = data;
            });
        });
    };

}