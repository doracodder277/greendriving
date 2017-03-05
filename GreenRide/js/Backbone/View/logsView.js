var LogsView = Backbone.View.extend({
    events: {
    },
    el: "#logs-overview-content",
    fitnessLogsContainer: "",
    fitnessLogsTemplate: "",
    nutritionLogsContainer: "",
    nutritionLogsTemplate: "",
    initialize: function() {
        var self = this;
        this.nutritionLogsTemplate = _.template($('#nutrition-log-template').html());
        this.fitnessLogsTemplate = _.template($('#fitness-log-template').html());
        this.nutritionLogsContainer = $('#nutrition-log-container');
        this.fitnessLogsContainer = $('#fitness-log-container');
        this.show();
        _.bindAll(this, "hide");
    
    
    },
    hide: function() 
    {
        this.$el.addClass("hide");
        this.stopListening();
    },
    update: function() 
    {
        var self = this;
        
        var email = window.selectedRelation.get("clientEmail");
        
        if (email != "") 
        {
            var fitnessLogs = window.fetchLog(email, "fitness");
            self.listenTo(fitnessLogs, "sync", function() {
                self.renderAllFitnessLogs(fitnessLogs);
            });
            //self.renderAllFitnessLogs(fitnessLogs);
            var nutritionLogs = window.fetchLog(email, "meals");
            self.listenTo(nutritionLogs, "sync", function() {
                self.renderAllNutritionLogs(nutritionLogs);
            });
            //self.renderAllNutritionLogs(nutritionLogs);
        }
    
    },
    renderAllFitnessLogs: function(logs) 
    {
        var self = this;
        self.fitnessLogsContainer.empty();
        $.each(logs.models, function(k, v) 
        {
            var values = v.get("values");
            if (values != undefined) 
            {
                var name = "UNKNOWN";
                $.each(values, function(k1, v1) 
                {
                    var activityID = k1.replace(k1.split("_")[0] + "_", "");
                    var activityName = window.enums.FitnessActivity.properties[activityID].name;
                    if (activityID == undefined)
                        return;
                    var fitnessLog = self.fitnessLogsTemplate({
                        name: activityName,
                        startTS: v.get("startTS")
                    });
                    
                    self.fitnessLogsContainer.append(fitnessLog);
                });
            }
        });
    },
    renderAllNutritionLogs: function(logs) 
    {
        
        var self = this;
        self.nutritionLogsContainer.empty();
        $.each(logs.models, function(k, v) 
        {
            var meal = window.meals.get(v.get("mealUuid"));
            var url = "images/meal.png"
            if (meal != undefined && meal.get("photoURI") != "")
                url = meal.get("photoURI");
            var mealName = v.get("name");
            if (mealName == undefined)
                return;
            var nutritionLog = self.nutritionLogsTemplate({
                name: mealName,
                startTS: v.get("startTS"),
                url: url
            });
            console.log(nutritionLog);
            self.nutritionLogsContainer.append(nutritionLog);
        });
    },
    show: function() 
    {
        this.$el.removeClass("hide");
        this.listenTo(window.selectedRelation, "change:clientEmail", this.update);
        this.update();
    },
    render: function() {
        this.$el.removeClass("hide");
    }
});
