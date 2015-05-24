angular.module('pipplware.dashboard.controllers', [])
    .controller('dashboardController', function ($scope, data) {
        data.memory = function() {
            this.dataStream.send(JSON.stringify({ action: 'memory' }));
        }


        $scope.$on('memory', function(ev, object) {

            if (object.content) {

                var percentage = Math.round (object.content.usedmem / object.content.totalmem * 100);
                $('#memory').children('span').css('width',percentage+'%');


            }
        });
        data.memory();
        var interval = setInterval(function () {
            data.memory();
        }, 7000);

        data.genericInformation = function() {
            this.dataStream.send(JSON.stringify({ action: 'genericInformation' }));
        }


        $scope.$on('genericInformation', function(ev, object) {

            if (object.content) {
                $scope.generic_information = object.content;

            }
        });
        data.genericInformation();



        $scope.$on("$destroy", function(){
            clearInterval(interval);
        });

    })
