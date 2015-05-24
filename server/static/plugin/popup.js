'use strict';

angular.module('pipplware',
    ['ngWebSocket',
        'ngRoute',
        'ngTable',
        'pipplware.processor.controllers',
        'pipplware.dashboard.controllers',
        'pipplware.processList.controllers',
        'pipplware.gamepad.controllers',
        'pipplware.commands.controllers'

    ])

    .factory('data', function($websocket, $rootScope) {
        var dataStream = $websocket(config.getWebsocketAddress());

        var collection = [];

        dataStream.onMessage(function(message) {
            var object = JSON.parse(message.data);
            if (object.action) {
                console.log(object);
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

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when("/login", {templateUrl: "partials/login.html", controller: "loginController"}).
            when("/dashboard", {templateUrl: "partials/dashboard.html", controller: "dashboardController"}).
            when("/processList", {templateUrl: "partials/processList.html", controller: "processListController"}).
            when("/processor", {templateUrl: "partials/processor.html", controller: "processorController"}).
            when("/gamepad", {templateUrl: "partials/gamepad.html", controller: "gamepadController"}).
            when("/commands", {templateUrl: "partials/commands.html", controller: "commandsController"}).

            otherwise({redirectTo: '/login'});
    }]);




document.addEventListener('DOMContentLoaded', function() {
    var content;
    if (chrome.extension) {
        var optionsUrl = chrome.extension.getURL("gamepad.html");
        content = '<a href="' + optionsUrl + '" target="_blank">Gamepad</a>';

    } else {
        content = '<a href="#/gamepad">Gamepad</a>';
        content = '<a href="gamepad.html" target="_blank">Gamepad</a>';
    }

     $("#linkForGamepad").append($(content));

});