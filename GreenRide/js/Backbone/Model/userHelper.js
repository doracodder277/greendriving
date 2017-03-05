var ClientHelper = Backbone.Model.extend({
    default: 
    {
    
    },
    initialize: function(options) {
        var self = this;
        self.on("client_synced", function() 
        {
            console.log("Client Fully Synchronized");
        });
        
        if (window.selectedRelation == undefined)
            return;
        window.selectedRelation.on("change:clientEmail", function(model) 
        {
            if (model.get("clientEmail") == "" || model.get("relationState") != 1) 
            {
                //self.off();
                $.each(window.clientHelper.properties, function(k, v) {
                //self.get(k).off();
                })
                return;
            }
            var selectedClientEmail = model.get("clientEmail");
            self.syncCounter = 0;
            
            $.each(window.clientHelper.properties, function(k, v) {
                
                if (self.get(k) != undefined)
                    self.get(k).off();
                /*if(v.isModel) self.set(k, new Empty());
                else  self.set(k, new EmptyCollection()); */
                self.set(k, window.fetchData(k));
                self.set(k + "_sync", false);
                self.syncCounter++;
                self.get(k).on("sync", function() 
                {
                    self.syncCounter--;
                    if (self.syncCounter == 0)
                        self.trigger("client_synced");
                    self.set(k + "_sync", true);
                
                });
                
                
                
                
                /*if(v.child != null)
                {
                    self.get(k).once("sync", function(coll)
                    {
                       $.each(coll,function(k1,v1)
                       {
                            var planID = v1.get("id");
                            v1["children"] =
                       });

                    });

                }*/
            });
        });
    
    }
});
var Empty = Backbone.Model.extend({

});
var EmptyCollection = Backbone.Collection.extend({
    model: Empty
});
window.syncUser = function() 
{
    if (window.selectedRelation == undefined)
        return;
    window.selectedRelation.on("change", function(model) 
    {
        if (model.get("clientEmail") == "" && model.get("relationState") != 1)
            return;
        
        var selectedClientEmail = model.get("clientEmail");
        window.selectedClientProfile = window.fetchClient(selectedClientEmail);
        
        window.selectedClientNutritionFinePlans = window.fetchFinePlans(fetchFinePlans, "pn");
        window.selectedClientFitnessFinePlans = window.fetchFinePlans(fetchFinePlans, "pf");
        
        window.selectedClientDayHistory = window.fetchClientHistory(clientEmail, "d", 0, new Date().getTime());
        window.selectedClientHourHistory = window.fetchClientHistory(clientEmail, "h", 0, new Date().getTime());
        window.selectedClientGoalHistory = window.fetchClientHistory(clientEmail, "g", 0, new Date().getTime());
        
        
        
        //window.selectedClientNutritionFinePlansEntries = window.fetchFinePlans(fetchFinePlans,"en");
        //window.selectedClientFitnessFinePlansEntries = window.fetchFinePlans(fetchFinePlans,"ef");
    });
}
window.clientHelper = 
{
    "PROFILE": "profile",
    "COARSEPLANS": "coarse_plans",
    "FINENUTRITIONPLANS": "fine_nutrition_plans",
    "FINEFITNESSPLANS": "fine_fitness_plans",
    "DAYHISTORY": "day_history",
    "HOURHISTORY" : "Hour History",
    "GOALHISTORY": "goal_history",
    "FINENUTRITIONPLANSENTRIES": "fine_nutrition_plan_entries",
    "FINEFITNESSPLANSENTRIES": "fine_fitness_plan_entries",
     "PROFILEHISTORY": "profile_history",
    properties: 
    {
        "PROFILE": {
            name: "profile",
            subpath: "/profile/",
            isModel: true,
            sortKey: null ,
            orderBy: null ,
            orderValue: null ,
            child: null 
        },
        "PROFILEHISTORY": {
                    name: "prefileHis",
                    subpath: "/history/p/",
                    isModel: false,
                    sortKey: "id" ,
                    orderBy: null ,
                    orderValue: null ,
                    child: null
                },
        "COARSEPLANS": {
            name: "coarse_plans",
            subpath: "/plans/",
            isModel: false,
            sortKey: "startDate",
            orderBy: "finePlanUuid",
            orderValue: null ,
            child: null 
        },
        "FINENUTRITIONPLANS": {
            name: "fine_nutrition_plans",
            subpath: "/fine-plans/pn/",
            isModel: false,
            sortKey: "startDate",
            orderBy: null ,
            orderValue: null ,
            child: "FINENUTRITIONPLANSENTRIES"
        },
        "FINEFITNESSPLANS": {
            name: "fine_fitness_plans",
            subpath: "/fine-plans/pf/",
            isModel: false,
            sortKey: "startDate",
            orderBy: null ,
            orderValue: null ,
            child: "FINEFITNESSPLANSENTRIES"
        },
        "DAYHISTORY": {
            name: "day_history",
            subpath: "/history/d/t/",
            isModel: false,
            sortKey: "id",
            orderBy: null ,
            orderValue: null ,
            child: null 
        },
        "HOURHISTORY" :
        {name : "hour_history",subpath : "/history/h/t/", isModel : false, sortKey: "id", orderBy : null, orderValue : null, child : null },
        "GOALHISTORY": {
            name: "goal_history",
            subpath: "/history/g/",
            isModel: false,
            sortKey: "id",
            orderBy: null ,
            orderValue: null ,
            child: null 
        },
        "FINENUTRITIONPLANSENTRIES": {
            name: "fine_nutrition_plan_entries",
            subpath: "/fine-plans/en/",
            isModel: false,
            sortKey: "finePlanUuid",
            orderBy: null ,
            orderValue: null ,
            child: null 
        },
        "FINEFITNESSPLANSENTRIES": {
            name: "fine_fitness_plan_entries",
            subpath: "/fine-plans/ef/",
            isModel: false,
            sortKey: "finePlanUuid",
            orderBy: null ,
            orderValue: null ,
            child: null 
        }
    }
}

window.fetchData = function(dataType) 
{
    var data = window.clientHelper.properties[dataType];
    
    if (!data.isModel) 
    {
        return window.fetchSelectedClientCollection(data.subpath, data.sortKey, data.orderBy, data.orderValue);
    } 
    else 
    {
        return window.fetchSelectedClientModel(data.subpath);
    }
}

window.fetchSelectedClientCollection = function(subpath, sortKey, orderBy, orderValue) 
{
    var url = null ;
    
    if (orderBy != null )
        url = new Firebase("https://" + window.subpath + ".firebaseio.com/clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + subpath).orderByChild(orderBy).equalTo(orderValue);
    else
        url = new Firebase("https://" + window.subpath + ".firebaseio.com/clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + subpath);
    
    var MyPlanCollection = Backbone.Firebase.Collection.extend({
        url: url,
        Model: Empty,
        
        initialize: function() {
            var self = this;
            this.sort_key = sortKey;
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
            this.sort_key = sortKey;
            this.sort();
        }
    
    });
    return new MyPlanCollection();
}

window.fetchSelectedClientModel = function(subpath) 
{
    var MyModel = Backbone.Firebase.Model.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + subpath),
        
        initialize: function() {
        
        }
    });
    return new MyModel();
}
