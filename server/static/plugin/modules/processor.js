angular.module('pipplware.processor.controllers', [])
    .controller('processorController', function ($scope, data) {
    var processor;
    data.sys_state = function() {
        this.dataStream.send(JSON.stringify({ action: 'sys_state' }));
    }
    $scope.$on('sys_state', function(ev, object) {
        if (object.content) {
            if (typeof processor === "undefined") {
                processor = new processorGraphic("myChart", object.content.usage.length);
            }
            processor.addData(object.content.usage);
        }
    });
    setInterval(function () {

        data.sys_state();
    }, 1000);
})

processorGraphic = function (chartId, numberOfCPUS ) {

    this.draw(numberOfCPUS, chartId);



}
processorGraphic.prototype.addData = function (data) {
    for (var j = 0; j< this.processorLoad.datasets.length; j++) {
        for (var i = 0; i< this.processorLoad.datasets[j].points.length - 1 ; i++) {
            this.processorLoad.datasets[j].points[i].value = this.processorLoad.datasets[j].points[i + 1].value;
        }

        this.processorLoad.datasets[j].points[this.processorLoad.datasets[j].points.length - 1].value = data[j];

    }
    this.processorLoad.update();


}

processorGraphic.prototype.draw = function(numberOfCPUS, chartId) {

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var datasets = [];
    for (var j = 0; j< numberOfCPUS; j++) {
        var color = "rgba("+(Math.floor(Math.random() * 1000 % 255))+", " +
                Math.floor(Math.random() * 1000 % 255)+"," +
                Math.floor(Math.random()* 1000 % 255)+",[[opacity]])";
        datasets[j] = {
            label: "Processor "+ j,
            fillColor: color.replace("[[opacity]]", 0.2),
            strokeColor: color.replace("[[opacity]]", 1),
            pointColor: color.replace("[[opacity]]", 1),
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0,0,0,0,0,0,0,0]
        }
    }
    var ctx = document.getElementById(chartId).getContext("2d");
    var dataCtx = {
        labels: ["", "", "", "", "", "", "",""],
        datasets: datasets,
        datasetFill : true

    };
    this.processorLoad = new Chart(ctx).Line(dataCtx, {
        scaleOverride: true,
        scaleStartValue: 0,
        scaleStepWidth: 25,
        scaleSteps: 4
    });
}
