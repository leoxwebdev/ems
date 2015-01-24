$(document).on('pageshow', '#index', function () {

   MakeChart("container1");
   MakeChart("container2");
   MakeChart("container3");
   MakeChart("container4");


});

function MakeChart(containerid){
     // Set up the chart
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: containerid,
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }
        },
        title: {
            text: 'Chart demo'
        },
        subtitle: {
            text: 'Data for Sales'
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });   
}