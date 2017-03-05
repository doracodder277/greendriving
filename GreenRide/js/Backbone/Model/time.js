window.timeResolotionClass = 
{
    Day: "Day",
    Week: "Week",
    Month: "Month",
    properties: 
    {
        Day: {
            name: "Day"
        },
        Week: {
            name: "Week"
        },
        Month: {
            name: "Month"
        }
    }
}

var TimeManager = Backbone.Model.extend({
    defaults: {
        startTimeStamp: new Date().getTime(),
        endTimeStamp: new Date().getTime(),
        timeResolution: window.timeResolotionClass["Day"],
    },
    initialize: function() {
        this.on('change', this.updateStamps, this);
        //this.on('change : startTimeStamp', this.updateStamps,this);
        this.updateStamps();
    },
    decrementOne: function() 
    {
        switch (this.get("timeResolution")) {
        case timeResolotionClass.Day:
            this.attributes["startTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), -1).getTime();
            break;
        case timeResolotionClass.Week:
            this.attributes["startTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), -7).getTime();
            break;
        case timeResolotionClass.Month:
            var startDate = new Date(this.get("startTimeStamp"));
            this.attributes["startTimeStamp"] = new Date(startDate.getFullYear(),startDate.getMonth() - 1,1).getTime();
            break;
        default:
            break;
        }
        this.attributes["startTimeStamp"] = window.clearDate(new Date(this.attributes["startTimeStamp"]));
        window.currentDate = this.attributes["startTimeStamp"];
        this.updateStamps();
        this.trigger('change', this);
    },
    incrementOne: function() 
    {
        if (!window.isToDay(this.get("endTimeStamp")) || this.get("timeResolution") == window.timeResolotionClass.Day) 
        {
            this.attributes["startTimeStamp"] = this.get("endTimeStamp");
            this.attributes["startTimeStamp"] = window.clearDate(new Date(this.attributes["startTimeStamp"]));
            window.currentDate = this.attributes["startTimeStamp"];
            this.updateStamps();
            this.trigger('change', this);
        }
    
    },
    changeDataScope: function() 
    {
        switch (this.get("timeResolution")) {
        case timeResolotionClass.Day:
            this.set({
                timeResolution: timeResolotionClass.Week
            });
            break;
        case timeResolotionClass.Week:
            this.set({
                timeResolution: timeResolotionClass.Month
            });
            break;
        case timeResolotionClass.Month:
            this.set({
                timeResolution: timeResolotionClass.Day
            })
            break;
        default:
            break;
        }
    },
    updateStamps: function(model) 
    {
        switch (this.get("timeResolution")) {
        case timeResolotionClass.Day:
            var startDate = new Date(this.get("startTimeStamp"));
            this.attributes["startTimeStamp"] = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0).getTime();
            this.attributes["endTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), 1).getTime();
            break;
        case timeResolotionClass.Week:
            this.attributes["startTimeStamp"] = window.getFirstDayOfWeek(this.get("startTimeStamp"));
            this.attributes["endTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), 7).getTime();
            break;
        case timeResolotionClass.Month:
            this.attributes["startTimeStamp"] = window.getFirstDayOfMonth(this.get("startTimeStamp"));
            this.attributes["endTimeStamp"] = window.addDaysToDate(this.get("startTimeStamp"), window.dayInMonth(this.get("startTimeStamp"))).getTime();
            break;
        default:
            break;
        }
        this.attributes["startTimeStamp"] = window.clearDate(new Date(this.attributes["startTimeStamp"]));
        if (this.get("endTimeStamp") > new Date().getTime()) 
        {
            this.attributes["endTimeStamp"] = new Date().getTime();
        }
        /*console.log("Updating Time Manager StartDate and EndDate:");
		console.log("Current Resolution is :"+ this.get("timeResolution"));
		console.log("Calculated new startDate is :"+ new Date(this.get("startTimeStamp")));
		console.log("Calculated new EndDate is :"+ new Date(this.get("endTimeStamp"))); */
    }
});



//Date Helpers
window.addHoursToDate = function(date, hours)
{
    var future = new Date(date);
    future.setHours(future.getHours() + hours);
    return future;
}
window.addDaysToDate = function(date, daysToAdd) 
{
    var future = new Date(date);
    future.setDate(future.getDate() + daysToAdd);
    return window.clearDate(future);
}
window.clearDate = function(startDate) 
{
    return new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),0,0,0);
}
window.addMonthsToDate = function(date, monthsToAdd) 
{
    var future = new Date(date);
    future.setMonth(future.getMonth() + monthsToAdd);
    return window.clearDate(future);
}
window.isToDay = function(timestamp) 
{
    var date = new Date(timestamp);
    var today = new Date();
    return ( date.getFullYear() == today.getFullYear() && date.getDate() == today.getDate() && date.getMonth() == today.getMonth()) ;
}
window.getFirstDayOfWeek = function(startTimestamp) 
{
    var startDate = new Date(startTimestamp);
    var day = startDate.getDay();
    diff = startDate.getDate() - day + (day == 0 ? -6 : 1);
    startDate.setDate(diff);
    return startDate.getTime();
}
window.getFirstDayOfMonth = function(startTimestamp) 
{
    var startDate = new Date(startTimestamp);
    startDate = new Date(startDate.getFullYear(),startDate.getMonth(),1);
    return startDate.getTime();
}
window.dayInMonth = function(startTimestamp) 
{
    var date = new Date(startTimestamp);
    return new Date(date.getFullYear(),date.getMonth() + 1,0).getDate();
}
