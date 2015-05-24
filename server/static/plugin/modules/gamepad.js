angular.module('pipplware.gamepad.controllers', [])
    .controller('gamepadController', function ($scope, data) {
        loadGamepadJSClient();
    })
