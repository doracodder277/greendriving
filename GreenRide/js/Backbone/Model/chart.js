var ChartElement = Backbone.Model.extend({
    defaults: {
        type: "",
        data: []
    },
    initialize: function(options) {
        this.attributes["type"] = options;
        this.attributes["data"] = [];
    
    }
});
var ChartCollection = Backbone.Collection.extend({
    model: ChartElement,
    initialize: function(options) {
    }
});

window.addToCharts = function(chartTitle, chartSubtitle, chartYlabel, chartName, types) 
{
    var chart = {
        title: chartTitle,
        subtitle: chartSubtitle,
        Ylabel: chartYlabel,
        name: chartName,
        collection: new ChartCollection()
    };
    var model;
    var temp;
    if (types == null ) 
    {
        model = new ChartElement(null );
        chart.collection.add(model);
    } 
    else 
    {
        for (var i = 0; i < types.length; i++) 
        {
            temp = types[i];
            model = new ChartElement(temp);
            chart.collection.add(model);
        }
    }
    
    window.myOverviewCharts.push(chart);
}

window.convertDateToString = function(timestamp) 
{
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    //months from 1-12
    var day = date.getDate();
    var year = date.getUTCFullYear();
    
    return day + "." + month + "." + year;
}

/*window.drawGoogleCharts = function(parentId, chart)
{
    
    console.log("google charts");
    var collection = chart.collection;
    window.colors = new Array(window.labels.length + 1);
    var data = [];
    for (var t = 0; t < window.labels.length + 1; t++) {
        data[t] = [];
    }
    
    data[0].push("Date");
    for (var i = 0; i < collection.models.length; i++) {
        var val = window.enums.FilteredDataType.resolve(collection.models[i].attributes["type"], DefaultResolutionSemantics.name);
        data[0].push(val);
    }
    
    for (var j = 0; j < window.labels.length; j++) {
        data[j + 1].push(window.labels[j]);
        for (var i = 0; i < collection.models.length; i++) {
            if (collection.models[i].attributes["data"] != undefined) 
            {
                var val = collection.models[i].attributes["data"][j];
                data[j + 1].push(val);
                if (j == 0) 
                {
                    window.colors.push(window.enums.FilteredDataType.resolve(collection.models[i].attributes["type"], DefaultResolutionSemantics.color));
                }
            }
        }
    }
    var width = $("#" + parentId).width() > window.fixedContentWidth ? $("#" + parentId).width() : window.fixedContentWidth;
    var options = {
        //isStacked: true,
        width: width,
        height: 300,
        tooltip: {
            isHtml: true
        },
        chart: {
            title: chart.title,
            subtitle: chart.subtitle
        },
        series: {
            0: {
                axis: 'distance'
            },
            // Bind series 0 to an axis named 'distance'.
            //   1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
        },
        vAxis: {
            format: 'decimal'
        },
        axes: {
            y: {
                distance: {
                    label: chart.Ylabel
                },
                // Left y-axis.
                //   brightness: {side: 'right', label: 'apparent magnitude'} // Right y-axis.
            }
        },

        colors: window.colors,
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset']
        }
        /*  hAxis: {
        	viewWindow: {min:1, max:7}
        	}
    };
    
    var dataView = new google.visualization.arrayToDataTable(data);
    gchart = new google.charts.Bar(document.getElementById(parentId));
    gchart.draw(dataView, google.charts.Bar.convertOptions(options));
} */

/******************************
//PIE Charts nutrients stats
******************************/
window.drawDonut = function() 
{
    /* var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'], 
    ['Work', 11], 
    ['Eat', 2], 
    ['Commute', 2], 
    ['Watch TV', 2], 
    ['Sleep', 7]
    ]);
    
    var options = {
        height: $('#snack-charts').parent().height() +100,
        width : $('#snack-charts').parent().height()+100,
        //title: 'My Daily Activities',
        legend: 'none',
        pieHole: 0.4,
    };
    
    var chart = new google.visualization.PieChart(document.getElementById('snack-charts'));
    chart.draw(data, options);*/
    var ctx = document.getElementById("snack-charts").getContext("2d");
    var data = [
    {
        value: 300,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    }, 
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    }, 
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
    ];
    var options = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        
        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,
        
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50,
        // This is 0 for Pie charts
        
        //Number - Amount of animation steps
        animationSteps: 100,
        
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    
    };
    
    var myDoughnutChart = new Chart(ctx[1]).Doughnut(data, options);
}
