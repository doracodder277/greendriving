/******************************
//PLANS
*****************************/

var FinePlan = Backbone.Model.extend({
    defaults: {
        coarsePlans: {},
        startDate: 0,
        name: ''
    },
    initialize: function(options) {
    }
});

window.fetchFinePlans = function(email, type) 
{
    //type is n or f
    var FinePlanCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/fine-plans/" + type),
        // Reference to this collection's model.
        model: FinePlan,
        initialize: function() {
        //this.sort_key = 'relationState';
        }//,
    });
    
    return new FinePlanCollection();
}


/******************************
//NUTRITION ENTRIES
*****************************/

var NutritionPlanEntry = Backbone.Model.extend({
    defaults: {
        mealUuid: "",
        timeslot: 0,
        weekDay: "",
        achievement: "UNKNOWN",
        authorId: ""
    },
    initialize: function(options) {
    }
});
var NutritionPlanEntryCollection = Backbone.Collection.extend({
    model: NutritionPlanEntry,
    initialize: function() {
        var self = this;
        this.weekDayStats = {};
        this.weekDayStats["week_avg"] = {};
        $.each(window.weekDays, function(k, v) 
        {
            self.weekDayStats[k] = {};
            self.weekDayStats[k]["day_avg"] = {};
            
            $.each(window.mealCategories, function(k1, v2) 
            
            {
                self.weekDayStats[k][k1] = {};
                self.weekDayStats[k][k1]["count"] = 0;
                self.weekDayStats[k][k1]["avg"] = {};
                self.weekDayStats[k][k1]["total"] = {};
            }
            );
        }
        );
        
        this.on("add", function(model) 
        {
            var stats = window.meals.get(model.get("mealUuid")).mealStats;
            var day = model.get("weekDay");
            var cat = model.get("timeslot");
            self.addToCategory(cat, day, stats);
        }
        );
        
        this.on("remove", function(model) 
        {
            var stats = window.meals.get(model.get("mealUuid")).mealStats;
            var day = model.get("weekDay");
            var cat = model.get("timeslot");
            self.removeFromCategory(cat, day, stats);
        }
        );
        //this.sort_key = 'relationState';
    },
    addToCategory: function(cat, day, stats) 
    {
        var self = this;

        if(this.weekDayStats[day][cat] == undefined) return;
        this.weekDayStats[day][cat].count++;
        $.each(stats.attributes, function(k, v) {
            if (self.weekDayStats[day][cat]["total"][k] == undefined) 
            {
                self.weekDayStats[day][cat]["total"][k] = 0;
            }
            self.weekDayStats[day][cat]["total"][k] += v;
            self.weekDayStats[day][cat]["avg"][k] = self.weekDayStats[day][cat]["total"][k] ;// self.weekDayStats[day][cat].count;
        }
        );
        this.updateDay(day);
        this.updateWeek();
        this.trigger("entriesStatsUpdated", {
            weekDay: day,
            timeslot: cat
        });
    },
    removeFromCategory: function(cat, day, stats) 
    {
        var self = this;
        this.weekDayStats[day][cat].count--;
        $.each(stats.attributes, function(k, v) {
            if (self.weekDayStats[day][cat]["total"][k] == undefined) 
            {
                self.weekDayStats[day][cat]["total"][k] = 0;
            }
            
            self.weekDayStats[day][cat]["total"][k] -= v;
            
            if (self.weekDayStats[day][cat].count > 0)
                self.weekDayStats[day][cat]["avg"][k] = self.weekDayStats[day][cat]["total"][k]; // self.weekDayStats[day][cat].count;
            else
                self.weekDayStats[day][cat]["avg"][k] = 0;
        }
        );
        this.updateDay(day);
        this.updateWeek();
        this.trigger("entriesStatsUpdated", {
            weekDay: day,
            timeslot: cat
        });
    },
    updateDay: function(day) 
    {
        var self = this;
        this.weekDayStats[day]["day_avg"] = {};
        $.each(window.mealCategories, function(k, v) {
            $.each(self.weekDayStats[day][k]["avg"], function(k1, v1) {
                if (self.weekDayStats[day]["day_avg"][k1] == undefined) 
                {
                    self.weekDayStats[day]["day_avg"][k1] = 0;
                }
                self.weekDayStats[day]["day_avg"][k1] += self.weekDayStats[day][k]["avg"][k1];
            }
            );
        }
        );
    },
    updateWeek: function() 
    {
        var self = this;
        self.weekDayStats["week_avg"] = {};
        $.each(window.weekDays, function(k, v) {
            if (k != "ANYTIME" && k != "ALL") 
            {
                $.each(self.weekDayStats[k]["day_avg"], function(k1, v1) {
                    if (self.weekDayStats["week_avg"][k1] == undefined) 
                    {
                        self.weekDayStats["week_avg"][k1] = 0;
                    }
                    self.weekDayStats["week_avg"][k1] += self.weekDayStats[k]["day_avg"][k1] / 7;
                }
                );
            }
        }
        );
    }
});
window.fetchNutritionFinePlanEntries = function(email, type, planID) 
{
    //type is n or f
    var NutritionPlanEntryCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/fine-plans/" + type).orderByChild("planUuid").equalTo(planID),
        // Reference to this collection's model.
        model: NutritionPlanEntry,
        initialize: function() {
        
        }
    });
    
    return new NutritionPlanEntryCollection();
}
/******************************
//FITNESS ENTRIES
*****************************/

var FitnessStats = Backbone.Model.extend({
    defaults: {
        duration: 0,
        distance: 0,
        energy: 0,
        stepsCount: 0,
    },
    initialize: function(options) {
    }
});

var FitnessPlanEntry = Backbone.Model.extend({
    defaults: {
        goals: {},
        timeslot: 0,
        weekDay: "",
        startDate: 0,
        goalPercentage: 0,
        achievement: "UNKNOWN",
        authorId: ""
    },
    initialize: function(options) {
        
        var self = this;
        this.fitnessStats = new FitnessStats();
        this.updateStats();
        
        this.on("change : goals", function(model) 
        {
            self.updateStats();
        }
        );
    },
    updateStats: function() 
    {
        var self = this;
        
        $.each(this.attributes.goals, function(k, v) 
        {
            if (k.split("DU").length > 1) 
            {
                self.fitnessStats.attributes.duration = v;
            } 
            else if (k.split("ST").length > 1) 
            {
                self.fitnessStats.attributes.stepsCount = v;
            } 
            else if (k.split("DI").length > 1) 
            {
                self.fitnessStats.attributes.distance = v;
            } 
            else if (k.split("CE").length > 1) 
            {
                self.fitnessStats.attributes.energy = v;
            }
            if (k.split("_").length > 2)
                self.set("name", k.split("_")[1] + "_" + k.split("_")[2]);
            else
                self.set("name", k.split("_")[1]);
        }
        );
        self.id = self.get("name") + "_" + self.get("weekDay") + "_" + self.get("timeslot");
    }
});
var FitnessPlanEntryCollection = Backbone.Collection.extend({
    model: FitnessPlanEntry,
    initialize: function(options) {
        var self = this;
        
        this.weekDayStats = {};
        $.each(window.weekDays, function(k, v) 
        {
            self.weekDayStats[k] = {};
            self.weekDayStats[k]["day-total"] = {};
            
            $.each(window.fitnessCategories, function(k1, v2) 
            {
                self.weekDayStats[k][k1] = {};
                self.weekDayStats[k][k1]["count"] = 0;
                self.weekDayStats[k][k1]["cat-total"] = {};
            }
            );
        }
        );
        
        this.entriesStats = new FitnessStats();
        this.on("add", function(model) 
        {
            var stats = model.fitnessStats;
            var day = model.get("weekDay");
            var cat = model.get("timeslot");
            self.addToCategory(cat, day, stats);
        }
        );
        this.on("remove", function(model) 
        {
            var stats = model.fitnessStats;
            var day = model.get("weekDay");
            var cat = model.get("timeslot");
            self.removeFromCategory(cat, day, stats);
        }
        );
    
    },
    addToCategory: function(cat, day, stats) 
    {
        var self = this;
        //if(this.weekDayStats[day][cat] == undefined) return;
        this.weekDayStats[day][cat].count++;
        $.each(stats.attributes, function(k, v) {
            if (self.weekDayStats[day][cat]["cat-total"][k] == undefined) 
            {
                self.weekDayStats[day][cat]["cat-total"][k] = 0;
            }
            self.weekDayStats[day][cat]["cat-total"][k] += parseFloat(v);
        }
        );
        this.updateDay(day);
        this.updateWeek();
        this.trigger("entriesStatsUpdated", {
            weekDay: day,
            timeslot: cat
        });
    },
    removeFromCategory: function(cat, day, stats) 
    {
        var self = this;
        this.weekDayStats[day][cat].count--;
        $.each(stats.attributes, function(k, v) {
            if (self.weekDayStats[day][cat]["cat-total"][k] == undefined) 
            {
                self.weekDayStats[day][cat]["cat-total"][k] = 0;
            }
            
            self.weekDayStats[day][cat]["cat-total"][k] -= parseFloat(v);
        
        }
        );
        this.updateDay(day);
        this.updateWeek();
        this.trigger("entriesStatsUpdated", {
            weekDay: day,
            timeslot: cat
        });
    },
    updateDay: function(day) 
    {
        var self = this;
        this.weekDayStats[day]["day-total"] = {};
        $.each(window.fitnessCategories, function(k, v) {
            $.each(self.weekDayStats[day][k]["cat-total"], function(k1, v1) {
                if (self.weekDayStats[day]["day-total"][k1] == undefined) 
                {
                    self.weekDayStats[day]["day-total"][k1] = 0;
                }
                self.weekDayStats[day]["day-total"][k1] += parseFloat(self.weekDayStats[day][k]["cat-total"][k1]);
            }
            );
        }
        );
    },
    updateWeek: function() 
    {
        var self = this;
        self.weekDayStats["week-total"] = {};
        $.each(window.weekDays, function(k, v) {
            if (k != "ANYTIME" && k != "ALL") 
            {
                $.each(self.weekDayStats[k]["day-total"], function(k1, v1) {
                    if (self.weekDayStats["week-total"][k1] == undefined) 
                    {
                        self.weekDayStats["week-total"][k1] = 0;
                    }
                    self.weekDayStats["week-total"][k1] += parseFloat(self.weekDayStats[k]["day-total"][k1]) / 7;
                }
                );
            }
        }
        );
    }
});

window.fetchFitnessFinePlanEntries = function(email, type, planID) 
{
    //type is n or f
    var FitnessPlanEntryCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/fine-plans/" + type).orderByChild("planUuid").equalTo(planID),
        // Reference to this collection's model.
        model: FitnessPlanEntry,
        initialize: function() {
        
        }
    });
    
    return new FitnessPlanEntryCollection();
}
/******************************
//HELPERS
*****************************/
//MODE en or ep
window.removePlannedEntries = function(startDate, mode, save) 
{
    var planUuid = mode == "en" ? "N_" + startDate : "F_" + startDate;
  //  var temp = mode != "en" ? window.clientData.get("FINEFITNESSPLANSENTRIES").where({planUuid : planUuid , authorId : window.coach.get("email")}) : window.clientData.get("FINENUTRITIONPLANSENTRIES").where({planUuid : planUuid , authorId : window.coach.get("email")});

    //DIRTY TARK CHANGE ARCHITECTURE USE PLAN ID !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //var ens = window.fetchNutritionFinePlanEntries(window.selectedRelation.get("clientEmail"), mode, planUuid);
    var entries = {};
    $.each(window.selectedFinePlanEntries.models, function(k, v)
    {
      var prefix="1-";
                if (v.get("mealUuid").charAt(0)==="R"){
                         prefix="A100-";
                     }
                     var id  = guid();
        entries[id] =v.attributes;
        entries[id]["mealUuid"] =prefix+v.get("mealUuid").substring(2);
        entries[id]["planUuid"] =planUuid;
        entries[id]["authorId"] =window.coach.get("email");
    }
    );
    var temp = {};
     $.each(window.clientData.get("FINENUTRITIONPLANSENTRIES").models, function(k, v)
        {
            if(v.get("planUuid") != planUuid)
            entries[v.get("id")] =  v.attributes;
        }
        );
    var ref = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans/" + mode + "/");//.orderByChild("planUuid").equalTo(planUuid);

   //sef.set(null);
   ref.set(entries);
  /*  $.each(temp,function(k,v)
    {
        if(mode == "en")
        {
            window.clientData.get("FINENUTRITIONPLANSENTRIES").remove(temp);
        }
        else
        {
            window.clientData.get("FINEFITNESSPLANSENTRIES").remove(temp);
        }
         //var ref = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans/" + mode + "/"+k+"/");
         //ref.set(null);
    });    */
   // var ref = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans/" + mode + "/");
   // ref.once("value", function(snap)
    //{
        //var temp = snap.val();

       // ref.set(temp);
         console.log("entries removed");
        if (save) 
        {
            window.saveCoarsePlans(startDate, mode);
           // window.savePlannedEntries(entries, startDate, mode);
        } 
        else 
        {
            window.removeCoarsePlans(startDate, mode, false);
        }
  //  });
    
    /* self.listenToOnce(ens, "sync", function()
    {
        
        while (ens.models.length > 0) 
        {
            var elem = new Firebase("https://"+ window.subpath +".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans/" + mode + "/" + ens.models[0].id);
            if (ens.models[0].get("authorId") != "")
                elem.remove();
            else
                ens.models.splice(0, 1);
        }

    
    }
    ); */


}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
window.savePlannedEntries = function(entries, startDate, mode) 
{
    var planUuid = mode == "en" ? "N_" + startDate : "F_" + startDate;
     var en = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans/" + mode + "/");
    $.each(entries, function(k, v)
    {

        var authorid = v.get("authorId");

        if (mode == "en")
        {
            var prefix="1-";
            if (v.get("mealUuid").charAt(0)==="R"){
                     prefix="A100-";
                 }

            en.push({
                planUuid: planUuid,
                //FIXME hackish
                mealUuid: prefix+v.get("mealUuid").substring(2),
                timeslot: v.get("timeslot"),
                weekDay: v.get("weekDay"),
                achievement: v.get("achievement"),
                authorId: authorid
            });
        } 
        else if (mode != "en" && authorid != "") 
        {
            var entryStartDate = window.addDaysToDate(startDate, window.weekDays[v.get("weekDay")] - 2);
            //entryStartDate.setHours(window.fitnessCategories[v.get("timeslot")]);
            en.push({
                planUuid: planUuid,
                goals: v.get("goals"),
                timeslot: v.get("timeslot"),
                weekDay: v.get("weekDay"),
                startDate: entryStartDate.getTime(),
                achievement: v.get("achievement"),
                authorId: authorid,
                goalPercentage: v.get("goalPercentage")
            });
        }
    
    }
    );
    
    window.saveCoarsePlans(startDate, mode);
}
window.removeCoarsePlans = function(startDate, mode, save) 
{
    var planUuid = mode == "en" ? "N_" + startDate : "F_" + startDate;
    /*var existingPlans = window.clientPlans.where({
        finePlanUuid: planUuid
    });
    if (existingPlans.length != 0) 
    {
        $.each(existingPlans, function(k, v) 
        {
            //remove plan
            var plan = new Firebase("https://"+ window.subpath +".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/plans/" + v.id);
            plan.remove();
        }
        );
    }*/

    var plans = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/plans/");
    plans.once("value", function(snap) 
    {
        var temp = snap.val();
        for (var t in temp) 
        {
            if (temp[t]["finePlanUuid"] == planUuid) 
            {
                delete temp[t];
            }
        }
        plans.set(temp);
        if (save)
            window.saveFinePlanCoarses();
    
    });
}
window.saveCoarsePlans = function(startDate, mode) 
{
    var g = mode == "en" ? "HEALTHY_EATING" : "SPORTS";
    var goal = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/goals/" + g);
    goal.set({
        type: g
    });
    
    
    window.removeCoarsePlans(startDate, mode, true);
}
;
window.saveFinePlanCoarses = function() 
{
    var plans = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/plans/");
    
    $.each(window.coarsePlans.models, function(k, v) 
    {
        if (v.get("targetValue") != undefined && v.get("targetValue") != 0)
            plans.push(v.attributes);
    }
    );
}
;

window.initActivityAutoComplete = function() 
{
    var map = [];
    var counter = 0;
    $.each(window.enums.MyFitnessActivity, function(k, v1) 
    {
        var v = window.enums.FitnessActivity.properties[k];
        var temp = {};
        temp.label = v.name;
        temp.label = temp.label.replace(/\_/g, ' ');
        temp.label = temp.label.split(".").length > 1 ? temp.label.split(".")[1] + " " + temp.label.split(".")[0] : temp.label;
        temp.value = k;
        map[counter++] = temp;
    
    }
    );
    
    
    return map;
}
//
window.enums.MyFitnessActivity = {
    AEROBICS: "AEROBICS",
    BADMINTON: "BADMINTON",
    BASEBALL: "BASEBALL",
    BASKETBALL: "BASKETBALL",
    BIATHLON: "BIATHLON",
    BIKING: "BIKING",
    //BIKING_HAND : "BIKING_HAND",
    BIKING_MOUNTAIN: "BIKING_MOUNTAIN",
    //BIKING_ROAD : "BIKING_ROAD",
    BIKING_SPINNING: "BIKING_SPINNING",
    //BIKING_STATIONARY : "BIKING_STATIONARY",
    //BIKING_UTILITY : "BIKING_UTILITY",
    BOXING: "BOXING",
    CALISTHENICS: "CALISTHENICS",
    //CIRCUIT_TRAINING : "CIRCUIT_TRAINING",
    CRICKET: "CRICKET",
    CROSSFIT: "CROSSFIT",
    CURLING: "CURLING",
    DANCING: "DANCING",
    DIVING: "DIVING",
    //ELLIPTICAL : "ELLIPTICAL",
    ERGOMETER: "ERGOMETER",
    FENCING: "FENCING",
    FOOTBALL_AMERICAN: "FOOTBALL_AMERICAN",
    FOOTBALL_AUSTRALIAN: "FOOTBALL_AUSTRALIAN",
    FOOTBALL_SOCCER: "FOOTBALL_SOCCER",
    FRISBEE_DISC: "FRISBEE_DISC",
    //GARDENING : "GARDENING",
    GOLF: "GOLF",
    GYMNASTICS: "GYMNASTICS",
    HANDBALL: "HANDBALL",
    //HIGH_INTENSITY_INTERVAL_TRAINING : "HIGH_INTENSITY_INTERVAL_TRAINING",
    HIKING: "HIKING",
    HOCKEY: "HOCKEY",
    HORSEBACK_RIDING: "HORSEBACK_RIDING",
    //HOUSEWORK : "HOUSEWORK",
    ICE_SKATING: "ICE_SKATING",
    //INTERVAL_TRAINING : "INTERVAL_TRAINING",
    //IN_VEHICLE : "IN_VEHICLE",
    JUMP_ROPE: "JUMP_ROPE",
    KAYAKING: "KAYAKING",
    KETTLEBELL_TRAINING: "KETTLEBELL_TRAINING",
    KICKBOXING: "KICKBOXING",
    KICK_SCOOTER: "KICK_SCOOTER",
    KITESURFING: "KITESURFING",
    MARTIAL_ARTS: "MARTIAL_ARTS",
    MEDITATION: "MEDITATION",
    //MIXED_MARTIAL_ARTS : "MIXED_MARTIAL_ARTS",
    //ON_FOOT : "ON_FOOT",
    //OTHER : "OTHER",
    //P90X : "P90X",
    PARAGLIDING: "PARAGLIDING",
    PILATES: "PILATES",
    POLO: "POLO",
    RACQUETBALL: "RACQUETBALL",
    ROCK_CLIMBING: "ROCK_CLIMBING",
    ROWING: "ROWING",
    //ROWING_MACHINE : "ROWING_MACHINE",
    RUGBY: "RUGBY",
    RUNNING: "RUNNING",
    //RUNNING_JOGGING : "RUNNING_JOGGING",
    //RUNNING_SAND : "RUNNING_SAND",
    //RUNNING_TREADMILL : "RUNNING_TREADMILL",
    SAILING: "SAILING",
    SCUBA_DIVING: "SCUBA_DIVING",
    SKATEBOARDING: "SKATEBOARDING",
    SKATING: "SKATING",
    //SKATING_CROSS : "SKATING_CROSS",
    //SKATING_INDOOR : "SKATING_INDOOR",
    //SKATING_INLINE : "SKATING_INLINE",
    SKIING: "SKIING",
    //SKIING_BACK_COUNTRY : "SKIING_BACK_COUNTRY",
    //SKIING_CROSS_COUNTRY : "SKIING_CROSS_COUNTRY",
    //SKIING_DOWNHILL : "SKIING_DOWNHILL",
    SKIING_KITE: "SKIING_KITE",
    //SKIING_ROLLER : "SKIING_ROLLER",
    SLEDDING: "SLEDDING",
    //SLEEP : "SLEEP",
    //SLEEP_AWAKE : "SLEEP_AWAKE",
    //SLEEP_DEEP : "SLEEP_DEEP",
    //SLEEP_LIGHT : "SLEEP_LIGHT",
    //SLEEP_REM : "SLEEP_REM",
    SNOWBOARDING: "SNOWBOARDING",
    SNOWMOBILE: "SNOWMOBILE",
    //SNOWSHOEING : "SNOWSHOEING",
    SQUASH: "SQUASH",
    STAIR_CLIMBING: "STAIR_CLIMBING",
    //STAIR_CLIMBING_MACHINE : "STAIR_CLIMBING_MACHINE",
    //STANDUP_PADDLEBOARDING : "STANDUP_PADDLEBOARDING",
    //STILL : "STILL",
    //STRENGTH_TRAINING : "STRENGTH_TRAINING",
    SURFING: "SURFING",
    SWIMMING: "SWIMMING",
    //SWIMMING_OPEN_WATER : "SWIMMING_OPEN_WATER",
    //SWIMMING_POOL : "SWIMMING_POOL",
    TABLE_TENNIS: "TABLE_TENNIS",
    //TEAM_SPORTS : "TEAM_SPORTS",
    TENNIS: "TENNIS",
    //TILTING : "TILTING",
    TREADMILL: "TREADMILL",
    //UNKNOWN : "UNKNOWN",
    VOLLEYBALL: "VOLLEYBALL",
    //VOLLEYBALL_BEACH : "VOLLEYBALL_BEACH",
    //VOLLEYBALL_INDOOR : "VOLLEYBALL_INDOOR",
    WAKEBOARDING: "WAKEBOARDING",
    WALKING: "WALKING",
    //WALKING_FITNESS : "WALKING_FITNESS",
    //WALKING_NORDIC : "WALKING_NORDIC",
    //WALKING_STROLLER : "WALKING_STROLLER",
    //WALKING_TREADMILL : "WALKING_TREADMILL",
    //WATER_POLO : "WATER_POLO",
    WEIGHTLIFTING: "WEIGHTLIFTING",
    WHEELCHAIR: "WHEELCHAIR",
    WINDSURFING: "WINDSURFING",
    YOGA: "YOGA",
    ZUMBA: "ZUMBA",
    //ALL : "ALL"
};
