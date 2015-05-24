angular.module('pipplware.commands.controllers', [])
    .controller('commandsController', function ($scope, data) {
        data.script = function(script) {
            this.dataStream.send(JSON.stringify({
                    action: 'script',
                    content:{
                        script:script
                    }
                }
            ));
        }

        $("#reboot").click(function (){
            data.script('reboot');
        });

        $("#both").click(function (){
            data.script('both');
        });

        $("#emulation").click(function (){
            data.script('emulation');
        });

        $("#kodi").click(function (){
            data.script('kodi');
        });

        $("#xfce").click(function (){
            data.script('xfce');
        });

        $("#terminal").click(function (){
            data.script('terminal');
        });

        $("#restartXbmc").click(function (){
            data.script('restartXbmc');
        });

        $scope.$on("$destroy", function(){
        });

    })
