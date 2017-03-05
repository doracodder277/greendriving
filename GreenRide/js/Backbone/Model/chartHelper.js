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
    return chart;
}
window.initMyChart = function() 
{
    
    window.myOverviewCharts = [];
    //Init Steps Chart
    
    window.addToCharts("Steps Count", "Daily Overview", "steps", "steps", [window.enums.FilteredDataType.STT, 
    window.enums.FilteredDataType.ST_WALKING, 
    window.enums.FilteredDataType.ST_RUNNING, 
    window.enums.FilteredDataType.ST_OTHER, 
    window.enums.FilteredDataType.ST_UNKNOWN]);
    
    window.addToCharts("Distance Measure", "Daily Overview", "meters", "his-distance", [window.enums.FilteredDataType.DIT, 
    window.enums.FilteredDataType.DI_WALKING, 
    window.enums.FilteredDataType.DI_RUNNING, 
    window.enums.FilteredDataType.DI_BIKING, 
    window.enums.FilteredDataType.DI_OTHER, 
    window.enums.FilteredDataType.DI_UNKNOWN]);
    
    window.addToCharts("Expended Calories", "Daily Overview", "kcal", "expended-calories", [window.enums.FilteredDataType.CET, 
    window.enums.FilteredDataType.CE_WALKING,
    window.enums.FilteredDataType.CE_RUNNING, 
    window.enums.FilteredDataType.CE_BIKING, 
    window.enums.FilteredDataType.CE_OTHER, 
    window.enums.FilteredDataType.CE_UNKNOWN]);
    
    window.addToCharts("Consumed Calories", "Daily Overview", "kcal", "consumed-calories", [window.enums.FilteredDataType.CCT, 
    window.enums.FilteredDataType.CCL, 
    window.enums.FilteredDataType.CCB, 
    window.enums.FilteredDataType.CCD, 
    window.enums.FilteredDataType.CCS, 
    window.enums.FilteredDataType.CCU]);
    
    window.addToCharts("Activities Duration", "Daily Overview", "min", "his-duration", [window.enums.FilteredDataType.DUT, 
    window.enums.FilteredDataType.DU_WALKING, 
    window.enums.FilteredDataType.DU_RUNNING, 
    window.enums.FilteredDataType.DU_BIKING, 
    window.enums.FilteredDataType.DU_OTHER, 
    window.enums.FilteredDataType.DU_UNKNOWN]);
    
    
    //window.addChart("Steps Count","Daily Overview","steps",[window.enums.FilteredDataType.STT,window.enums.FilteredDataType.STW,window.enums.FilteredDataType.STN,window.enums.FilteredDataType.STO,window.enums.FilteredDataType.STU]);
}

window.initMyChartDataFromHistory = function() 
{

    console.log("update chart data");
    window.labels = [];
    
    var date = new Date(window.timeManager.get("startTimeStamp"));
    var nrOfValues;
    
    switch (window.timeManager.get("timeResolution")) {
    case timeResolotionClass.Day:
        nrOfValues = 24;
        break;
    case timeResolotionClass.Week:
        nrOfValues = 7;
        break;
    case timeResolotionClass.Month:
        nrOfValues = window.dayInMonth(window.timeManager.get("startTimeStamp"));
        break;
    default:
        break;
    }
    
    //loop over days/hours
    for (z = 0; z < nrOfValues; z++) {
        //loop over nr of charts 
        for (var i = 0; i < window.myOverviewCharts.length; i++) {
            //loop over nr of chart elements
            for (var j = 0; j < window.myOverviewCharts[i].collection.length; j++) {
                var type = window.myOverviewCharts[i].collection.models[j].get("type");
                if(window.timeManager.get("timeResolution") == timeResolotionClass.Day )
                {
                    var data = window.clientHistory.get(date.getTime()) == undefined ? 0 : window.clientHistory.get(date.getTime() ).get(type);
                }
                else
                {
                    var data = window.clientHistory.get(date.getTime() / 100000) == undefined ? 0 : window.clientHistory.get(date.getTime() / 100000).get(type);
                }
                data = data == undefined ? 0 : data;
                if (window.myOverviewCharts[i].name == "his-duration") 
                {
                    //TODO
                    data = data / (60000);
                }
                window.myOverviewCharts[i].collection.models[j].attributes["data"].push(data);
            }
        }
        window.labels.push(date);
        if(window.timeManager.get("timeResolution") == timeResolotionClass.Day )
        {
            date = window.addHoursToDate(date, 1);
        }
        else {
            date = window.addDaysToDate(date,1);
        }
    }
}

window.convertDateToString = function(timestamp) 
{
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();
    
    return day + "." + month + "." + year;
}

window.convertHoursToString = function(timestamp)
{
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();

    return day + "." + month + "." + year + " " + date.getUTCHours() +":00";
}

window.drawGoogleCharts_back = function(parentId, chart) 
{
    
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
    var width = $("#" + parentId).width() > window.fixedContentWidth ? $("#" + parentId).width() - 200 : window.fixedContentWidth - 200;
    width = 300;
    
    
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
        	}*/
    };
    
    var dataView = new google.visualization.arrayToDataTable(data);
    gchart = new google.charts.Bar(document.getElementById(parentId));
    gchart.draw(dataView, google.charts.Bar.convertOptions(options));
}

/******************************
//PIE Charts nutrients stats
******************************/
window.initDayChartData = function(cat) 
{
    var data = [];
    //var colors = [];
    if (window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay].day_avg.GCAL == 0 || window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay].day_avg.GCAL == undefined) 
    {
        return data;
    }
    var catdata = window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay].day_avg;
    
    var counter = 0;
    
    $.each(window.BLSToEnumC[cat], function(k, v) 
    {
        if (v.split("_")[0] != "GLOBAL" && v != "UNKNOWN" && catdata[k] != undefined && catdata[k] != 0)
        {
            var temp = {};
            temp["label"] = window.enums.Nutrient.properties[v].nutrientName;
            temp["value"] = catdata[k].toFixed(2);
            //colors[counter] = '#' + Math.floor(Math.random() * 100).toString(16);
            //Omit total (fats, sugar, acids ... ) for charts
            //if( (temp["label"].toLocaleLowerCase().indexOf("total") > -1 )&& (temp["label"].indexOf("total") == -1) )return;
            data[counter++] = temp;
        
        }
    }
    );

    return data;
}
window.initPieChartData = function(cat) 
{
    var data = [];
    //var colors = [];
    if (window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay][cat].count == 0) 
    {
        return data;
    }
    var catdata = window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay][cat]["avg"];
    var counter = 0;
    
    $.each(window.BLSToEnumC["GLOBAL"], function(k, v) 
    {
        if (v.split("_")[0] != "GLOBAL" && v != "UNKNOWN") 
        {
            if (catdata[k] != undefined && catdata[k] != 0) 
            {
                var temp = {};
                temp["label"] = window.enums.Nutrient.properties[v].nutrientName;
                temp["value"] = catdata[k].toFixed(2);
                //colors[counter] = '#' + Math.floor(Math.random() * 100).toString(16);
                data[counter++] = temp;
            }
        }
    }
    );
    return data;
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function cleanData(data)
{
    result = [];
    counter = 0;
    for(var t in data)
    {
        var value = data[t];
        if(value.label != window.enums.Nutrient.properties.CALORIES.nutrientName &&
            value.label != window.enums.Nutrient.properties.TOTAL_MASS.nutrientName)
        {
            var temp = {};
            temp["value"]= value.value;
            temp["label"] = value.label;
            result[counter ++] = temp;
        }
    }
    return result;
}
window.drawDonut = function(elementID, data)
{
    Morris.Donut({
        element: elementID,
        data: cleanData(data),
        colors: ["#a072bf", "#72bfa8", "#bfb372", "#bf9c72", "#7cbf72", "#72bfb4", "#bf72b3", "#bfb872", "#bf9472", "#72bfab", "#72b9bf", "#727bbf", "#8772bf", "#72a3bf", "#72bfb6", "#bf72a3", "#bf7280", "#bfba72", "#bf7281", "#98bf72", "#bfb372", "#bfa172", "#72bf7b", "#78bf72", "#b3bf72", "#72a8bf", "#7291bf", "#72bf73", "#bf7c72", "#9d72bf"]
    });
}
window.initActivityPieChartData = function(cat) 
{
    var data = [];
    if (window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay][cat].count == 0) 
    {
        return data;
    }
    var counter = 0;
    $.each(window.selectedFinePlanEntries.where({
        timeslot: cat,
        weekDay: window.selectedWeekDay
    }), function(k, v) 
    {
        if (v.fitnessStats.attributes["energy"] != undefined && v.fitnessStats.attributes["energy"] != 0) 
        {
            var temp = {};
            temp["label"] = v.get("name");
            temp["value"] = parseFloat(v.fitnessStats.attributes["energy"]);
            //colors[counter] = '#' + Math.floor(Math.random() * 100).toString(16);
            data[counter++] = temp;
        }
    }
    );
    return data;
}
window.initActivityDayChartData = function(cat) 
{
    var data = [];
    //var colors = [];
    if (window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay]["day-total"][cat] == 0 || window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay]["day-total"][cat] == undefined) 
    {
        return data;
    }
    var catdata = window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay].day_avg;
    
    var counter = 0;
    
    $.each(window.selectedFinePlanEntries.where({
        weekDay: window.selectedWeekDay
    }), function(k, v) 
    {
        if (v.fitnessStats.attributes[cat] != undefined && v.fitnessStats.attributes[cat] != 0) 
        {
            var temp = {};
            temp["label"] = v.get("name");
            
            temp["value"] = parseFloat(v.fitnessStats.attributes[cat]);
            if (cat == "duration")
                temp["value"] = temp["value"] / (60 * 1000);
            //colors[counter] = '#' + Math.floor(Math.random() * 100).toString(16);
            data[counter++] = temp;
        }
    }
    );
    return data;
}
window.initSunChartData = function(cat)
{
    var data = [];
    //var colors = [];
    if (window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay]["day-total"][cat] == 0 || window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay]["day-total"][cat] == undefined)
    {
        return data;
    }
    var catdata = window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay].day_avg;

    var counter = 0;

    $.each(window.selectedFinePlanEntries.where({
        weekDay: window.selectedWeekDay
    }), function(k, v)
    {
        if (v.fitnessStats.attributes[cat] != undefined && v.fitnessStats.attributes[cat] != 0)
        {
            var temp = {};
            temp["label"] = v.get("name");

            temp["value"] = parseFloat(v.fitnessStats.attributes[cat]);
            if (cat == "duration")
                temp["value"] = temp["value"] / (60 * 1000);
            //colors[counter] = '#' + Math.floor(Math.random() * 100).toString(16);
            data[counter++] = [temp["label"],temp["value"]];
        }
    }
    );
    return data;
}

window.drawGoogleCharts = function(parentId, chart) {
    
//    var type = window.timeManager.get("timeResolution") == "Day" ? "column" : "areaspline";
    var type =  "areaspline";

    var data = [];
    window.colors = [];
    var j = 0;
    window.colors = new Array(window.labels.length + 1);
    for (var i = 0; i < chart.collection.models.length; i++) {
        if (chart.collection.models[i].attributes["data"] != undefined) 
        {
            var noData = true;
            var temp = {
                name: "",
                data: []
            };
            var date = window.labels[0];
            if(chart.collection.models[i].attributes["type"] == undefined) console.log(chart.collection.models[i]);
            temp["name"] = window.enums.FilteredDataType.resolve(chart.collection.models[i].attributes["type"], DefaultResolutionSemantics.name);
            temp["data"] = chart.collection.models[i].attributes["data"];
            temp["pointStart"] = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
            temp["pointInterval"] = window.timeManager.get("timeResolution") == "Day" ? 3600 * 1000 :24 * 3600 * 1000;
            temp["stacking"] = true;
            
            if (i == 0) 
            {
                temp["type"] = type;
                temp["name"] = "Total";
            }
            
            
            if (j == 0) 
            {
                window.colors[i] = (window.enums.FilteredDataType.resolve(chart.collection.models[i].attributes["type"], DefaultResolutionSemantics.color));
            }
            for (var key in temp["data"]) 
            {
                if (temp["data"][key] != 0)
                    noData = false;
            }
            if (noData)
                temp["data"] = [];
            data[i] = temp;
        }
    
    }
    
    data.splice(0, 1);
    
    /* if(noData)
     {
        for (var key in data)
        {
          data[key]["data"] = [];
        }

     }     */
    
    //if (noData)
    //    data = [];
    //console.log(window.colors);
    //data["pointStart"] = window.labels[0];
    //data["pointInterval"] = 24 * 3600 * 1000;
    //var width =  $("#" + parentId).width() > window.fixedContentWidth ? $("#" + parentId).width()- 10 : window.fixedContentWidth -10;
    var labels = window.timeManager.get("timeResolution") != "Day" ? {} :   {formatter: function () {
        return Highcharts.dateFormat('%H', this.value);

    }};
    
    $('#' + parentId).highcharts({
        chart: {
            type: type
            //    width:width
        },
        
        title: {
            text: chart.title
        },
        subtitle: {
            text: chart.subtitle
        },
        global: {
            useUTC: false
        },

        xAxis: {
            // categories: window.labels,
            //crosshair: true,
            type: 'datetime',
            dateTimeLabelFormats: {
                // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            },
            labels: labels
        },
        yAxis: {
            min: 0,
            title: {
                text: chart.Ylabel
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + 
            '<td style="padding:0"><b>{point.y:.1f} ' + chart.Ylabel + ' </b></td></tr>',
            footerFormat: '</table>',
            formatter: function() {
                            var value = window.timeManager.get("timeResolution") == "Day" ? window.convertHoursToString(this.x) : window.convertDateToString(this.x);
                            var s = '<b>'+ value +'</b>',
                                sum = 0;
                            $.each(this.points, function(i, point) {
                                        s += '<br/><span style="color:'+ point.series.color +'">'+ point.series.name +'</span>: '  + point.y;
                                        sum += point.y;
                                    });

                            s += '<br/>Total : '+sum

                            return s;
                        },
            shared: true,
            useHTML: true
        },
        plotOptions: {
            stacking: 'normal',
            areaspline: {
                marker: {
                    enabled: false
                }
            },
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                point: {
                    events: {
                        click: function () {

                            if(window.timeManager.get("timeResolution") != "Day")
                            {
                                window.currentDate = parseInt(this.x)  + new Date().getTimezoneOffset() * 60*1000;
                                window.timeManager.set({timeResolution: timeResolotionClass.Day});
                                window.timeManager.set({startTimeStamp : window.currentDate});
                            }

                        }
                },
                    legendItemClick: function(event) {
                        
                        var seriesIndex = this.index;
                        var series = this.chart.series;
                        
                        if (!this.visible) 
                        {
                            for (var i = 0; i < series.length; i++) 
                            {
                                if (series[i].index != seriesIndex) 
                                {
                                    
                                    series[i].hide();
                                } 
                                else 
                                {
                                    series[i].show();
                                }
                            }
                            return false;
                        
                        } 
                        else 
                        {
                            for (var i = 0; i < series.length; i++) 
                            {
                                if (series[i].index != seriesIndex) 
                                {
                                    series[i].visible ? 
                                    series[i].hide() : 
                                    series[i].show();
                                }
                            }
                            return false;
                        
                        }
                    
                    }
                }
            }
        },
        colors: window.colors,
        //["#bf7281", "#98bf72", "#bfb372", "#bfa172", "#72bf7b", "#78bf72", "#b3bf72", "#72a8bf", "#7291bf", "#72bf73", "#bf7c72", "#9d72bf"],
        series: data
    });
    $(".highcharts-button").remove();
}

window.drawGauge = function (id) {

                       $('#'+id).highcharts({
                           height:150,
                           chart: {
                               type: 'gauge',
                               plotBackgroundColor: 'rgba(255, 255, 255, 0.1)',
                               plotBackgroundImage: null,
                               plotBorderWidth: 0,
                               plotShadow: false
                           },

                           title: {
                               text: 'Speedometer'
                           },

                           pane: {
                               startAngle: -90,
                               endAngle: 90,

                           },

                           // the value axis
                           yAxis: {
                               min: 0,
                               max: 200,

                               minorTickInterval: 'auto',
                               minorTickWidth: 1,
                               minorTickLength: 10,
                               minorTickPosition: 'inside',
                               minorTickColor: '#666',

                               tickPixelInterval: 30,
                               tickWidth: 2,
                               tickPosition: 'inside',
                               tickLength: 10,
                               tickColor: '#666',
                               labels: {
                                   step: 2,
                                   rotation: 'auto'
                               },
                               title: {
                                   text: 'km/h'
                               },
                               plotBands: [{
                                   from: 0,
                                   to: 120,
                                   color: '#55BF3B' // green
                               }, {
                                   from: 120,
                                   to: 160,
                                   color: '#DDDF0D' // yellow
                               }, {
                                   from: 160,
                                   to: 200,
                                   color: '#DF5353' // red
                               }]
                           },

                           series: [{
                               name: 'Speed',
                               data: [80],
                               tooltip: {
                                   valueSuffix: ' km/h'
                               }
                           }]

                       },
                       // Add some life
                       function (chart) {
                           if (!chart.renderer.forExport) {
                               setInterval(function () {
                                   var point = chart.series[0].points[0],
                                       newVal,
                                       inc = Math.round((Math.random() - 0.5) * 20);

                                   newVal = point.y + inc;
                                   if (newVal < 0 || newVal > 200) {
                                       newVal = point.y - inc;
                                   }

                                   point.update(newVal);

                               }, 3000);
                           }
                       });
                   };
