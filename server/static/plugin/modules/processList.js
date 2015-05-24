angular.module('pipplware.processList.controllers', [])
    .controller('processListController', function ($scope, data, $filter, ngTableParams) {
        var processor;
        data.processList = function() {
            this.dataStream.send(JSON.stringify({ action: 'processList' }));
        }
        $scope.$on('processList', function(ev, object) {
            if (object.content) {
                $scope.processes=$scope.processes_original = object.content.processes;
                $scope.tableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 10           // count per page
                }, {
                    total: $scope.processes.length, // length of data
                    getData: function($defer, params) {
                        // use build-in angular filter
                        var orderedData = params.filter() ?
                            $filter('filter')($scope.processes_original, params.filter()) :
                            $scope.processes_original;

                        orderedData = params.sorting() ?
                            $filter('orderBy')(orderedData, params.orderBy()) :
                            orderedData;

                        $scope.processes  = orderedData;

                        params.total(orderedData.length); // set total for recalc pagination
                        $defer.resolve($scope.processes );
                    }
                });
            }
        });
        data.processList();


    });