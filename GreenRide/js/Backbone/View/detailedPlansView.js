var DetailedPlansView = Backbone.View.extend({
    events: {
    },
    
    el: "#plans-list-content",
    planListContainer: "#finePlans-container",
    planTemplate: "",
    displayMode: "",
    
    initialize: function() {
        
        var self = this;
        
        this.planTemplate = _.template($('#fine-plan-template').html());
        this.displayMode = "pn";
        this.hide();
        this.listenTo(window.selectedRelation, "change", this.resetPlans);
        this.resetPlans();
        
        $("#plans-list-selector").click(function(e) 
        {
            
            self.displayMode = self.displayMode == "pn" ? "pf" : "pn";
            window.activeEditMode = self.displayMode == "pn" ? "Nutrition" : "Fitness";
            self.resetPlans();
        }
        );
        //render buttons template
        _.bindAll(this, "hide");
    
    },
    resetPlans: function() 
    {
        if (window.selectedRelation.get("clientEmail") != "") 
        {
            var sync = false;
            if (this.displayMode == "pf") 
            {
                window.finePlans = window.clientData.get("FINEFITNESSPLANS");
                sync = window.clientData.get("FINEFITNESSPLANS_sync");
            } 
            else 
            {
                window.finePlans = window.clientData.get("FINENUTRITIONPLANS");
                sync = window.clientData.get("FINENUTRITIONPLANS_sync");
            }
            
            if (sync) 
            {
                this.updateListener();
            } 
            else 
            {
                this.listenToOnce(window.finePlans, "sync", this.updateListener);
            }
        
        }
    
    },
    updateListener: function() 
    {
        this.listenTo(window.finePlans, "add", this.addPlan);
        this.listenTo(window.finePlans, "remove", this.removePlan);
        if (this.displayMode == "pf") 
        {
            if (window.clientData.get("FINEFITNESSPLANSENTRIES_sync")) 
            {
                this.renderAllPlans();
            } 
            else 
            {
                this.listenTo(window.clientData.get("FINEFITNESSPLANSENTRIES"), "sync", this.renderAllPlans);
            }
        } 
        else 
        {
            if (window.clientData.get("FINENUTRITIONPLANSENTRIES_sync")) 
            {
                this.renderAllPlans();
            } 
            else 
            {
                this.listenTo(window.clientData.get("FINENUTRITIONPLANSENTRIES"), "sync", this.renderAllPlans);
            }
        }
    
    },
    removePlan: function(model) 
    {
        $("#" + model.id).remove();
        if (window.finePlans.models.length == 0) 
        {
            $(".toast").remove();
            Materialize.toast('The user has no fine plans. Please create some plans!', 4000);
            $("#plans-list").addClass("hide");
        
        }
    },
    hide: function() 
    {
        this.$el.addClass("hide");
        $("#planListContainer").empty();
        this.stopListening();
    },
    show: function() 
    {
        var self = this;
        this.$el.removeClass("hide");
        //sync plans
        //render plans
        this.listenTo(window.selectedRelation, "change", this.resetPlans);
        this.resetPlans();
    },
    renderAllPlans: function() 
    {
        
        
        $(this.planListContainer).empty();
        var self = this;
        if (window.finePlans.models.length == 0) 
        {
            $(".toast").remove();
            Materialize.toast('The user has no fine plans. Please create some plans!', 4000);
            $("#plans-list").addClass("hide");
            return;
        }
        
        //for each plan this add plan
        $.each(window.finePlans.models, function(k, v) 
        {
            var uri = null ;
            var entry = window.clientData.get("FINENUTRITIONPLANSENTRIES").findWhere({
                planUuid: v.get("id")
            });
            if (self.displayMode == "pn" && entry != undefined)
                uri = window.meals.get(entry.get("mealUuid")).get("photoURI");
            self.addPlan(v, uri);
        }
        );
    
    },
    addPlan: function(model, uri) 
    {
        $("#plans-list").removeClass("hide");
        var self = this;
        
        var j = model.attributes;
        j["uri"] = uri;
        $(self.planListContainer).append(self.planTemplate(model.attributes));
        $("#remove" + model.id).click(function(e) 
        {
            window.finePlans.remove(window.finePlans.get(e.currentTarget.id.split("remove")[1]));
            window.selectedFinePlanEntries = new NutritionPlanEntryCollection();
            window.removePlannedEntries(e.currentTarget.id.split("remove")[1].split("_")[1], self.displayMode == "pn" ? "en" : "ef", false);
        }
        );
        $("#edit" + model.id).click(function(e) 
        {
            window.selectedFinePlan.set(window.finePlans.get(e.currentTarget.id.split("edit")[1]).attributes);
            window.activeEditMode = self.displayMode == "pn" ? "Nutrition" : "Fitness";
            $("#mobile-client-fine-plan").trigger("click");
        }
        );
    
    },
    render: function() {
    
    }

});
