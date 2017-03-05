window.fixedContentWidth = 1150;

var Plan = Backbone.Model.extend({
    defaults: {
        highLevelGoalType: "",
        dataType: '',
        endDate: 0,
        inactivationDate: 0,
        lastUpdateDate: 0,
        schedule: '',
        startDate: 0,
        state: '',
        targetValue: 0
    },
    
    initialize: function(options) {
    }
});
var PlanHistory = Backbone.Model.extend({
    defaults: {
    },
    initialize: function(options) {
    }
});
window.fetchPlanHistory = function(email) 
{
    var PlanHistoryCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/history/g/"),
        // Reference to this collection's model.
        model: PlanHistory,
        initialize: function() {
        //this.sort_key = 'relationState';
        }//,
    });
    return new PlanHistoryCollection();
}

var MyGoal = Backbone.Model.extend({
    initialize: function() {
    }
});

window.fetchGoals = function() 
{
    var MyGoalCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/goals/"),
        Model: MyGoal,
        
        initialize: function() {
        /* this.on("add", function(model, value, options) {
            model.forward("profile", new MyProfile());
            model.forward("plans", new MyPlans(), {
                collection: true
            });
            //model.forward("history", new MyHistory());
            //model.forward("comments", new MyComments());
        }
        );*/
        
        
        }
    
    });
    return new MyGoalCollection();

}

var PlanCollection = Backbone.Collection.extend({
    //url: new Firebase("https://"+ window.subpath +".firebaseio.com/" + "clients/" + email.replace(/\./g, '_')) + "/plans/"),
    //.orderByChild("authorityUserId").equalTo(window.selectedRelation.get("coachEmail")),
    //.orderByChild("coachEmail").equalTo(window.myFirebaseRef.getAuth().password.email),
    // Reference to this collection's model.
    model: Plan,
    initialize: function() {
        this.sort_key = 'startDate';
    },
    comparator: function(a, b) {
        // Assuming that the sort_key values can be compared with '>' and '<',
        // modifying this to account for extra processing on the sort_key model
        // attributes is fairly straight forward.
        a = a.get(this.sort_key);
        b = b.get(this.sort_key);
        return a < b ? 1 
        : a > b ? -1 
        : 0;
    },
    sort_by_Key: function() {
        this.sort_key = 'relationState';
        this.sort();
    }
});



window.initMyPlanDataHistory = function(selectedPlan) 
{
    var planID = selectedPlan.get("finePlanUuid") != undefined ? selectedPlan.get("finePlanUuid") + "_" + selectedPlan.get("dataType") : selectedPlan.id;
    if (window.clientData.get("GOALHISTORY_sync"))
        window.planHistory = window.clientData.get("GOALHISTORY").where({
            id: planID
        });
    if(selectedPlan.get("dataType") == "BWE")
    {
        window.planHistory =[];
        if (window.clientData.get("PROFILEHISTORY_sync"))
        {      window.planHistory[0] = {};  window.planHistory[0]["attributes"] = {};
           $.each(window.clientData.get("PROFILEHISTORY").models, function(k, v) {
                   window.planHistory[0]["attributes"][v.get("id")/100000+""] = v.get("BWE");
           } );
        }
    }
    window.labels = [];
    window.myOverviewCharts = [];
    var type = selectedPlan.get("dataType");
    window.addToCharts("Plan History", "Daily Progress", window.enums.FilteredDataType.resolve(type, "unit"), window.enums.FilteredDataType.resolve(type, "name"), null );
    
    var start = new Date(selectedPlan.get("startDate"));
    var end = new Date();
    if(selectedPlan.get("endDate") == 0)  end = window.addDaysToDate(new Date().getTime(),30);
    else end = new Date(selectedPlan.get("endDate"));
    var nrOfValues;
    var increment;
    
    window.myOverviewCharts[0].collection.models[0].attributes["data"] = [];
    
    if (selectedPlan.get("finePlanUuid") == undefined) 
    {
        var plan = selectedPlan;
        var type = plan.get("dataType");
        var startdate = plan.get("startDate");
        var endDate = plan.get("endDate");

        if(selectedPlan.get("endDate") == 0)  endDate = window.addDaysToDate(new Date().getTime() > plan.get("startDate") ? new Date().getTime() : plan.get("startDate"),30).getTime();
        else endDate = new Date(selectedPlan.get("endDate")).getTime();

        var planSchedule = plan.get("schedule");
        window.myOverviewCharts[0]["todayValue"] = 0;
        lastvalue = 0;
        if(selectedPlan.get("dataType") == "BWE" )
         lastvalue = selectedPlan.get("initialValue");
        switch (planSchedule) {
        case "DAY":
            
            while (startdate < endDate) {
                var val = 0;
                var hv = undefined;
                $.each(window.planHistory, function(k, v) {
                    
                    var t = v.attributes[(startdate / 100000).toString()];
                    if (t != undefined) 
                    {
                        val = t;
                        lastvalue = val;
                    }
                    else  if(selectedPlan.get("dataType") == "BWE" )
                    {
                        val = lastvalue;
                    }
                });
                if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                {
                    val = val / 60000;
                    window.planHisLabel = "min";
                } 
                else 
                {
                    window.planHisLabel = window.enums.FilteredDataType.resolve(selectedPlan.attributes.dataType, "unit");
                }
                
                window.myOverviewCharts[0].collection.models[0].attributes["data"].push(parseFloat(val.toFixed(2)));
                if (startdate == window.clearDate(new Date()).getTime())
                    window.myOverviewCharts[0]["todayValue"] = parseFloat(val.toFixed(2));
                window.labels.push(startdate);
                startdate = addDaysToDate(startdate, 1).getTime();
            }
            break;
        case "WEEK":
            while (startdate < endDate) {
                for (var i = 0; i < 7; i++) 
                {
                    var val = 0;
                    var hv = undefined;
                    $.each(window.planHistory, function(k, v) {
                        var t = v.attributes[(startdate / 100000).toString()];
                        if (t != undefined) 
                        {
                            hv = t;
                        }
                    });
                    
                    if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                    {
                        val += hv != undefined ? hv / 60000 : 0;
                    } 
                    else 
                    {
                        val += hv != undefined ? hv : 0;
                    }
                    
                    
                    startdate = addDaysToDate(startdate, 1).getTime();
                }
                if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                {
                    window.planHisLabel = "min";
                } 
                else 
                {
                    window.planHisLabel = window.enums.FilteredDataType.resolve(selectedPlan.attributes.dataType, "unit");
                }
                
                window.myOverviewCharts[0].collection.models[0].attributes["data"].push(parseFloat(val.toFixed(2)));
                
                window.labels.push(startdate);
            
            }
            
            break;
        
        case "MONTH":
            while (startdate < endDate) {
                var currentmonth = new Date(startdate).getMonth();
                var lastmonth = new Date(startdate).getMonth();
                var temdate = startdate;
                while (currentmonth == lastmonth) 
                {
                    var val = 0;
                    var hv = undefined;
                    $.each(window.planHistory, function(k, v) {
                        var t = v.attributes[(startdate / 100000).toString()];
                        if (t != undefined) 
                        {
                            hv = t;
                        }
                    });
                    
                    if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                    {
                        val += hv != undefined ? hv / 60000 : 0;
                    } 
                    else 
                    {
                        val += hv != undefined ? hv : 0;
                    }
                    
                    
                    startdate = addDaysToDate(startdate, 1).getTime();
                    currentmonth = new Date(startdate).getMonth();
                }
                if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                {
                    window.planHisLabel = "min";
                } 
                else 
                {
                    window.planHisLabel = window.enums.FilteredDataType.resolve(selectedPlan.attributes.dataType, "unit");
                }
                
                window.myOverviewCharts[0].collection.models[0].attributes["data"].push(parseFloat(val.toFixed(2)));
                
                window.labels.push(startdate);
            }
            
            break;
        default:
            
            var val = 0;
            //var lasValue = 0;
            while (startdate < endDate) {
                
                var hv = undefined;
                $.each(window.planHistory, function(k, v) {
                    var t = v.attributes[(startdate / 100000).toString()];
                    if (t != undefined) 
                    {
                        hv = t;
                    }
                });
                
                if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                {
                    val += hv != undefined ? hv / 60000 : 0;
                } 
                else if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "WEIGHT") 
                {
                    val = hv != undefined ? hv : 0;
                } 
                else 
                {
                    val += hv != undefined ? hv : 0;
                }
                startdate = addDaysToDate(startdate, 1).getTime();
                window.labels.push(startdate);
                window.myOverviewCharts[0].collection.models[0].attributes["data"].push(parseFloat(val.toFixed(2)));
            }
            if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
            {
                window.planHisLabel = "min";
            } 
            else 
            {
                window.planHisLabel = window.enums.FilteredDataType.resolve(selectedPlan.attributes.dataType, "unit");
            }
        
        
        
        
        }
    } 
    else 
    {
        var fineplanid = selectedPlan.get("finePlanUuid");
        var mode = fineplanid.split("_")[0] == "F" ? "pf" : "pn";
        var myFirebaseRef = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans/" + mode + "/" + fineplanid);
        
        myFirebaseRef.on("value", function(snapshot) {
            var startdate = snapshot.val()["startDate"];
            for (var i = 0; i < 7; i++) 
            {
                var val = 0;
                var hv = undefined;
                $.each(window.planHistory, function(k, v) {
                    
                    var t = v.attributes[(startdate / 100000).toString()];
                    
                    if (t != undefined) 
                    {
                        hv = t;
                    }
                });
                if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                {
                    val += hv != undefined ? hv / 60000 : 0;
                } 
                else 
                {
                    val += hv != undefined ? hv : 0;
                }
                if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION") 
                {
                    window.planHisLabel = "min";
                } 
                else 
                {
                    window.planHisLabel = window.enums.FilteredDataType.resolve(selectedPlan.attributes.dataType, "unit");
                }
                window.myOverviewCharts[0].collection.models[0].attributes["data"].push(parseFloat(val.toFixed(2)));
                
                window.labels.push(startdate);
                startdate = addDaysToDate(startdate, 1).getTime();
            }
        }
        );
    
    }
    /*if (window.planHistory.length > 0) 
    {
        var keys = Object.keys(window.planHistory[0].attributes);
        for (var i = 0; i < keys.length - 1; i++) {
            //var per = (100 * (window.planHistory[0].attributes[keys[i]]) / parseFloat(selectedPlan.get("targetValue")));
            //per = per > 100 ? 100 : per;
            var per = window.planHistory[0].attributes[keys[i]];
            if (window.enums.FilteredDataType.properties[selectedPlan.attributes.dataType].field == "DURATION")
            {
                per = per / 60000;
                window.planHisLabel = "min";
            } 
            else 
            {
                window.planHisLabel = window.enums.FilteredDataType.resolve(selectedPlan.attributes.dataType, "unit");
            }
            window.myOverviewCharts[0].collection.models[0].attributes["data"].push(per);
            
            window.labels.push(window.convertDateToString(parseFloat(keys[i]) * 100000));
        
        }
    }*/
    
    window.myOverviewCharts[0]["labels"] = window.labels;
    return window.myOverviewCharts[0];

}

//Plan Manager

var PlanManager = Backbone.Model.extend({
    defaults: {
        startTimeStamp: new Date().getTime(),
        endTimeStamp: new Date().getTime(),
        timeResolution: "DAY",
        planStartDate: new Date().getTime(),
        planEndDate: new Date().getTime(),
        currentvalue: 0,
        targetvalue: 0,
        isActive: false,
        elapsedTime: 0,
        remainingTime: 0,
        scheduleDuration: 0,
        planDuration: 0
    },
    
    initialize: function(plan) {
        
        this.attributes["timeResolution"] = plan.get("schedule");
        this.attributes["planStartDate"] = plan.get("startDate");
        this.attributes["planEndDate"] = plan.get("endDate");
        this.attributes["targetValue"] = plan.get("targetValue");
        //this.attributes["currentValue"] = plan.get("currentValue");
        
        this.on('change', this.updateStamps, this);
        //this.on('change : startTimeStamp', this.updateStamps,this);
        this.updateStamps();
    },
    updateStamps: function(model) 
    {
        if (this.get("planStartDate") > new Date().getTime() || this.get("planEndDate") < new Date().getTime()) 
        {
            this.attributes["isActive"] = false;
        } 
        else 
        {
            this.attributes["isActive"] = true;
            switch (this.get("timeResolution")) {
            case "DAY":
                var startDate = new Date();
                this.attributes["startTimeStamp"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0).getTime();
                this.attributes["endTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), 1).getTime();
                this.attributes["scheduleDuration"] = 24 * 1000 * 60 * 60;
                break;
            case "WEEK":
                this.attributes["startTimeStamp"] = window.getFirstDayOfWeek(this.get("startTimeStamp"));
                this.attributes["endTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), 7).getTime();
                this.attributes["scheduleDuration"] = 24 * 1000 * 60 * 60 * 7;
                break;
            case "MONTH":
                this.attributes["startTimeStamp"] = window.getFirstDayOfMonth(this.get("startTimeStamp"));
                this.attributes["endTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), window.dayInMonth(this.get("startTimeStamp"))).getTime();
                this.attributes["scheduleDuration"] = 24 * 1000 * 60 * 60 * window.dayInMonth(this.get("startTimeStamp"));
                break;
            default:
                this.attributes["startTimeStamp"] = this.attributes["planStartDate"];
                this.attributes["endTimeStamp"] = this.attributes["planEndDate"];
                this.attributes["scheduleDuration"] = this.attributes["endTimeStamp"] - this.attributes["startTimeStamp"];
                break;
            }
            this.attributes["planDuration"] = this.attributes["planEndDate"] - this.attributes["planStartDate"];
            var d = new Date().getTime();
            this.attributes["remainingTime"] = this.attributes["endTimeStamp"] - d;
            this.attributes["elapsedTime"] = d - this.attributes["startTimeStamp"];
        }
    },
    getRemainingTime: function() 
    {
        return window.convertMillisToString(this.attributes["remainingTime"]);
    },
    getElapsedTime: function() 
    {
        return window.convertMillisToString(this.attributes["elapsedTime"]);
    },
    getElapsedTimeInPer: function() 
    {
        return window.planManager.get("scheduleDuration") == 0 ? window.planManager.get("elapsedTime") : Math.round(100 * window.planManager.get("elapsedTime") / window.planManager.get("scheduleDuration"));
    }
});


window.convertMillisToString = function(t) 
{
    var cd = 24 * 60 * 60 * 1000;
    var ch = 60 * 60 * 1000;
    var d = Math.floor(t / cd);
    var h = Math.floor((t - d * cd) / ch);
    var m = Math.round((t - d * cd - h * ch) / 60000);
    var pad = function(n) {
        return n < 10 ? '0' + n : n;
    }
    ;
    if (m === 60) {
        h++;
        m = 0;
    }
    if (h === 24) {
        d++;
        h = 0;
    }
    return [d, pad(h), pad(m)].join(':');
}

window.drawGooglePlanChart_back = function(parentId, chart) 
{
    
    var collection = chart.collection;
    window.colors = new Array(window.labels.length + 1);
    var data = [];
    for (var t = 0; t < window.labels.length + 1; t++) {
        data[t] = [];
    }
    
    //  data[0] = ["Date","% accomplished","% fail"]
    data[0] = ["Date", window.planHisLabel];
    for (var j = 0; j < window.labels.length; j++) {
        data[j + 1].push(window.labels[j]);
        for (var i = 0; i < collection.models.length; i++) {
            if (collection.models[i].attributes["data"] != undefined) 
            {
                data[j + 1].push(collection.models[i].attributes["data"][j]);
                // data[j + 1].push(100 - collection.models[i].attributes["data"][j]);
            
            }
        }
    }
    var width = $("#" + parentId).width() > window.fixedContentWidth ? $("#" + parentId).width() : window.fixedContentWidth;
    var options = {
        isStacked: true,
        width: width,
        height: 300,
        tooltip: {
            isHtml: true
        },
        vAxis: {
            format: 'decimal'
        },
        chart: {
            title: chart.title,
            subtitle: chart.subtitle
        },
        series: {
            0: {
                axis: 'distance'
            }
            // Bind series 0 to an axis named 'distance'.
            //   1: { axis: 'brightness' } // Bind series 1 to an axis named 'brightness'.
        },
        vAxis: {
            format: 'decimal'
        },
        
        colors: ["#4285F4", "#FF0000"],
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset']
        }
        /*  hAxis: {
        	viewWindow: {min:1, max:7}
        	}*/
    };
    var option2 = {
        isStacked: true,
        width: $("#" + parentId).width() - 5,
        height: 300,
        title: 'Company Performance',
        vAxis: {
            title: 'Year'
        },
        series: [{
            color: 'red',
            visibleInLegend: true
        }, {
            color: 'red',
            visibleInLegend: true
        }]
    };
    
    var dataView = new google.visualization.arrayToDataTable(data);
    gchart = new google.charts.Bar(document.getElementById(parentId));
    gchart.draw(dataView, google.charts.Bar.convertOptions(options));
}

window.calculateAchievmentLevel = function(target, current) 
{
    var diff = current - target;
    var sign = diff <= 0 ? -1 : 1;
    var percent = ((100 * Math.abs(diff)) / Math.abs(target)) - 20;
    percent = percent <= 0 ? 0 : percent;
    percent = percent >= 100 ? 100 : percent;
    var e = 100;
    var b = 0;
    if (sign == -1) 
    {
        e = 100 - percent;
    } 
    else 
    {
        b = percent;
    }
    
    
    return {
        "e": e,
        "b": b
    };
}
window.fetchActivePlans = function(dataType, collection) 
{
    
    var MyPlanCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/plans/").orderByChild("dataType").equalTo(dataType),
        Model: Plan,
        
        initialize: function() {
            var self = this;
            this.sort_key = 'startDate';
            this.on("add", function(model) 
            {
                if (model.get("finePlanUuid") == null  && model.get("endDate") >= window.clearDate(new Date()).getTime()) 
                {
                    collection.add(model);
                }
            });
            this.on("sync", function() 
            {
                collection.trigger("sync");
            });
        
        },
        comparator: function(a, b) {
            // Assuming that the sort_key values can be compared with '>' and '<',
            // modifying this to account for extra processing on the sort_key model
            // attributes is fairly straight forward.
            a = a.get(this.sort_key);
            b = b.get(this.sort_key);
            return a > b ? 1 
            : a < b ? -1 
            : 0;
        },
        sort_by_Key: function() {
            this.sort_key = 'relationState';
            this.sort();
        }
    
    });
    
    return new MyPlanCollection();
}
window.fetchPlans = function() 
{
    var MyPlanCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/plans/").orderByChild("finePlanUuid").equalTo(null ),
        Model: Plan,
        
        initialize: function() {
            var self = this;
            this.sort_key = 'startDate';
        
        },
        comparator: function(a, b) {
            // Assuming that the sort_key values can be compared with '>' and '<',
            // modifying this to account for extra processing on the sort_key model
            // attributes is fairly straight forward.
            a = a.get(this.sort_key);
            b = b.get(this.sort_key);
            return a > b ? 1 
            : a < b ? -1 
            : 0;
        },
        sort_by_Key: function() {
            this.sort_key = 'relationState';
            this.sort();
        }
    
    });
    return new MyPlanCollection();
}

window.drawGooglePlanChart = function(selectedPlan, parentid, chart) {
    
    var labels = chart["labels"];
    var data = [];
    var j = 0;
    window.colors = new Array(labels.length + 1);
    
    var target = {};
    target["yAxis"] = 1;
    target["type"] = "spline";
    target["name"] = "target";
    target["data"] = [];
    
    $.each(labels, function(k, v) {
        if (selectedPlan.get("finePlanUuid") == undefined) 
        {
            target["data"].push([labels[k], parseFloat(selectedPlan.get("targetValue"))]);
        } 
        else 
        {
            //var label = v.split(".");
            //var date = new Date(label[2],label[1] - 1,label[0],0,0);
            var plan = window.clientPlans.findWhere({
                finePlanUuid: selectedPlan.get("finePlanUuid"),
                startDate: window.clearDate(new Date(v)).getTime(),
                dataType: selectedPlan.get("dataType")
            });
            var value = plan == undefined ? 0 : plan.get("targetValue").toFixed(2);
            target["data"].push({
                x: labels[k],
                y: parseFloat(value),
                color: "green"
            });
        }
    }
    );
    
    for (var i = 0; i < chart.collection.models.length; i++) {
        if (chart.collection.models[i].attributes["data"] != undefined) 
        {
            var temp = {
                name: "",
                data: []
            };
            var noData = true;
            temp["name"] = chart.name;
            // +"( "+chart.Ylabel+" )";
            temp["data"] = chart.collection.models[i].attributes["data"];
            
            for (var key in temp["data"]) 
            {
                if (temp["data"][key] != 0)
                    noData = false;
            }
            data[i] = temp;
        
        }
    }
    
    var myseries = [];
    var series = {
        data: []
    };
    series.name = chart.name + " (" + chart.Ylabel + ")";
    series.yAxis = 1;
    series.type = "column";
    
   // if (chart.name == "weight")
        series.type = "spline";
    
    $.each(labels, function(k, v) {
        var temp = {};
        
        
        if (target["data"][k][1] == data[0]["data"][k]) 
        {
            temp.color = "#92D74F";
            /* var t = target.data[k];
            target.data[k] = {
                y: t,
                marker: {
                    symbol: 'url(http://t3.gstatic.com/images?q=tbn:ANd9GcQ57TUY0adeFsAXk173TuQe10MG9g_8O2BHF18FQ7VFwHHdDHL65U5g)'
                }
            }*/
        } 
        else if ((Math.abs(target["data"][k][1] - data[0]["data"][k]) * 100 / Math.abs(target["data"][k][1]) < 10) ) 
        {
            temp.color = "#FFD166";
        } 
        else 
        {
            temp.color = "#8D0D30";
        
        }
        //data[0]["data"][k] = data[0]["data"][k]  == 0 ? null : data[0]["data"][k];
        temp.y = data[0]["data"][k];
        temp.x = labels[k];
        //temp.data = temp;
        if (temp.y != 0)
            series.data.push(temp);
    
    }
    );
    
    //if (noData)
    //    data = [];
    myseries.push(target);
    myseries.push(series);
    
    $('#' + parentid).highcharts({
        chart: {
        //zoomType: 'column'
        //renderTo: 'container',
        //defaultSeriesType: 'bar'
        },
        title: {
            text: chart.title
        },
        subtitle: {
            text: chart.subtitle
        },
        
        /*xAxis: [{
            categories: labels,
            crosshair: true
        }], */
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: [{
            // Primary yAxis
            title: {
                text: chart.Ylabel,
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, 
        {
            // Secondary yAxis
            title: {
                text: data[0]["name"],
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + 
            '<td style="padding:0"><b>{point.y:.1f} ' + chart.Ylabel + ' </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: myseries
    });
    
    
    $(".highcharts-button").remove();
}
