$(document).ready(function(){
  $.get(chrome.extension.getURL('convo.html'), function(data) {
    $(data).appendTo('body');

    




    // chart rendering

    var ctx = document.getElementById('responseChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',

        // The data for our dataset
        data: {
            datasets: [{
                label: 'response',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
                fill: false,
            },{
              label: "y=x",
              borderColor: 'rgb(255, 99, 132)',
              data: [{
                x: 0.0,
                y: 0.0
             },{
               x: 100.0,
               y: 100.0,
             }],
              borderColor: "#fff",
              borderWidth: 1,
              pointBackgroundColor: ['#000'],
              pointRadius: 1,
              fill: false,
             showLine: true

            }]
        },
        // Configuration options go here
        options: {}
    });
  });
});