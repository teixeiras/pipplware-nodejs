function processorGraphic(content, chartId) {
    var datasets = [];
    for (var j = 0; j< content["usage"].length; j++) {
        datasets[j] = {
            label: "Processor "+ j,
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0,0,0,0,0,0,0,0]
        }
    }
    var ctx = document.getElementById(chartId).getContext("2d");
    dataCtx = {
        labels: ["", "", "", "", "", "", "",""],
        datasets: datasets,
        datasetFill : true

    };
    processorLoad = new Chart(ctx).Line(dataCtx, {
        scaleOverride: true,
        scaleStartValue: 0,
        scaleStepWidth: 25,
        scaleSteps: 4
    });


    for (var j = 0; j< content["usage"].length; j++) {
        for (var i = processorLoad.datasets[j].points.length - 1 ; i>0;i--) {
            processorLoad.datasets[j].points[i - 1].value = processorLoad.datasets[j].points[i].value;
        }

        processorLoad.datasets[j].points[processorLoad.datasets[0].points.length - 1].value = content["usage"][j];
    }

    processorLoad.update();
}