'use strict';

angular.module('pipplware',
    ['ngWebSocket',
        'ngRoute',
        'pipplware.processor.controllers',
        'pipplware.memory.controllers'
    ])

    .factory('data', function($websocket, $rootScope) {
        var dataStream = $websocket(config.getWebsocketAddress());

        var collection = [];

        dataStream.onMessage(function(message) {
            var object = JSON.parse(message.data);
            if (object.action) {
                $rootScope.$broadcast(object.action, object);
            }


            collection.push();
        });

        var methods = {
            collection: collection,
            dataStream:dataStream,
            get: function() {
                dataStream.send(JSON.stringify({ action: 'get' }));
            }

        };

        return methods;
    })
    .controller('loginController', function ($scope) {
        if (true) {
            console.log("redirect");
            window.location = "#/dashboard"
        }
    })
    .controller('dashboardController', function ($scope) {

    })

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when("/login", {templateUrl: "partials/login.html", controller: "loginController"}).
            when("/dashboard", {templateUrl: "partials/dashboard.html", controller: "dashboardController"}).
            when("/memory", {templateUrl: "partials/memory.html", controller: "memoryController"}).
            when("/processList", {templateUrl: "partials/processList.html", controller: "processListController"}).
            when("/processor", {templateUrl: "partials/processor.html", controller: "processorController"}).
            otherwise({redirectTo: '/login'});
    }]);