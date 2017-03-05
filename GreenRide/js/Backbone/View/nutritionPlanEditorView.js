var NutritionPlanEditorView = Backbone.View.extend({
    
    mealTemplate: "",
    mealSideTemplate: "",
    mealsContainer: "",
    mobileMealsContainer: "",
    activityTemplate: "",
    ingredientTemplate: "",
    mealStatsTemplate: "",
    editMode: "Nutrition",
    activeFitnessCategory: "",
    selectedFitnessActivity: "",
    activityEntryTemplate: "",
    events: {
    
    },
    initialize: function() {

        
        var self = this;
        this.viewCounter = 0;
        this.mealSideTemplate = _.template($('#plan-side-meal-template').html());
        this.mealTemplate = _.template($('#plan-side-meal-template').html());
        this.activityTemplate = _.template($('#plan-side-activity-template').html());
        this.activityEntryTemplate = _.template($('#plan-side-activity-entry-template').html());
        this.mealsContainer = ".plan-meals-container";
        this.mobileMealsContainer = ".mobile-plan-meals-container";
        this.ingredientTemplate = _.template($('#meal-ingredient-template').html());
        this.mealStatsTemplate = _.template($("#meal-stats-template").html());



        $(".activator").click(function(e) {
            var catID = e.currentTarget.parentElement.parentElement.id;
            //DIRTY HACK
            setTimeout(function() {
                self.drawCharts(catID);
            }
            , 10);
        }
        );
        
        $("#edit-new-target-value").click(function(e) {
            $(".toast").remove();
            Materialize.toast('Value has been updated successfully !', 4000);
            var plan = window.clientPlans.get(window.selectedPlan.id);
            plan.set({
                targetValue: $("#new-target-value").val()
            });
        }
        );
        
        $(".nutritionRef").on("click", function(e) {
            window.dataType = e.currentTarget.attributes["data-act"].value;
            if (window.dataType == undefined)
                return;
            var plans = window.clientPlans.where({
                dataType: window.dataType
            });
            var plan = undefined;
            $.each(plans, function(k, v) 
            {
                if (v.get("finePlanUuid") == undefined) 
                {
                    plan = v;
                }
            });
            if (plan == undefined) 
            {
                $(".toast").remove();
                Materialize.toast('There exists no active plan for the selected category. Please add one first.', 5000);
                Materialize.toast('<span>Would you like create a plan now?</span><a class="btn-flat yellow-text" onclick = "return false;" id="create-ref-plan">Accept<a>', 5000);
                $("#create-ref-plan").on("click", function() {
                    $(".toast").remove();
                    $("#add-plan-modal").openModal();
                });
            } 
            else 
            {
                $("#new-target-value").parent().children("label").addClass("active");
                $("#new-target-value").val(plan.get("targetValue"));
                window.selectedPlan = plan;
                $("#edit-plan-value-modal").openModal();
            }
        });
        $(".fitnessRef").on("click", function(e) {
            window.dataType = e.currentTarget.attributes["data-act"].value;
            if (window.dataType == undefined)
                return;
            console.log(plan);
            var plans = window.clientPlans.where({
                dataType: window.dataType
            });
            var plan = undefined;
            $.each(plans, function(k, v) 
            {
                if (v.get("finePlanUuid") == undefined) 
                {
                    plan = v;
                }
            });
            if (plan == undefined) 
            {
                $(".toast").remove()
                Materialize.toast('There exists no active plan for the selected category. Please add one first.', 5000);
                Materialize.toast('<span>Would you like create a plan now?</span><a class="btn-flat yellow-text" onclick = "return false;" id="create-ref-plan">Accept<a>', 5000);
                $("#create-ref-plan").on("click", function() {
                    $(".toast").remove();
                    $("#add-plan-modal").openModal();
                });
            } 
            else 
            {
                $("#new-target-value").parent().children("label").addClass("active");
                $("#new-target-value").val(plan.get("targetValue"));
                window.selectedPlan = plan;
                $("#edit-plan-value-modal").openModal();
            }
        });
        $("#show-prev").on("click", function(e) 
        {
            console.log("previous");
            self.viewCounter--;
            var max = self.editMode == "Nutrition" ? 8 : 4;
            if (self.viewCounter < 0)
                self.viewCounter = max - 1;
            self.enableDayStats();
        
        });
        $("#show-next").on("click", function(e) 
        {
            self.viewCounter++;
            
            var max = self.editMode == "Nutrition" ? 8 : 4;
            if (self.viewCounter >= max)
                self.viewCounter = 0;
            self.enableDayStats();
        });
        $("#show-day-stats").on("click", function(e) 
        {
            
            $("#day-stats").openModal();
            self.enableDayStats();
        }
        );
        
        $(".weekday").click(function(e) 
        {
            window.selectedWeekDay = e.currentTarget.id;
            $(".activeDay").removeClass("activeDay");
            $("#" + window.selectedWeekDay).addClass("activeDay");
            self.updateView();
        }
        );
        $(".save-fine-plan-button").click(function(e) 
        {
            self.savePlan();
        }
        );
        
        $("#add-activity-entry").click(function(e) 
        {
            var duration = parseFloat($("#duration-value").val()) * 1000 * 60;
            var distance = $("#distance-value").val();
            var steps = $("#steps-value").val();
            var calories = $("#calories-value").val();
            self.addNewEntryToPlan({
                duration: duration,
                distance: distance,
                steps: steps,
                calories: calories,
                authorId: window.selectedRelation.get("coachEmail")
            });
        }
        );
        $("#switch-plan-type").click(function(e) 
        {
            
            var target = self.editMode == "Nutrition" ? "Fitness" : "Nutrition";
            self.switchEditMode(target);
        }
        );
        
        
        _.bindAll(this, "hide");
        this.bindAutocomplete("#meal-name", window.allMeals);
    },
    switchEditMode: function(target) 
    {
        if (target != this.editMode) 
        {
            $("#" + this.editMode).addClass("hide");
            this.editMode = this.editMode == "Nutrition" ? "Fitness" : "Nutrition";
            $("#" + this.editMode).removeClass("hide");
            //$("#switch-plan-type").html(this.editMode + " Plan");
            this.chageMode();
        }
    
    },
    chageMode: function() 
    {
        var mode = "pn";
        if (this.editMode == "Nutrition") 
        {
            $(".fitnessRef").addClass("hide");
            $(".nutritionRef").removeClass("hide");
            $("#save-nutrition-plan").attr("href", "#save-nutrition-plan-modal");
            this.bindAutocomplete("#meal-name", window.allMeals);
            this.renderAllMeals();
            window.list = window.fetchNutritionFinePlanEntries(window.selectedRelation.get("clientEmail"), "en", "N_" + window.selectedFinePlan.get("startDate"));
        } 
        else 
        {
            $(".fitnessRef").removeClass("hide");
            $(".nutritionRef").addClass("hide");
            $("#save-nutrition-plan").attr("href", "#save-fitness-plan-modal");
            mode = "pf";
            this.bindAutocomplete("#meal-name", window.activityAutoCom);
            this.renderAllActivities();
            window.list = window.fetchFitnessFinePlanEntries(window.selectedRelation.get("clientEmail"), "ef", "F_" + window.selectedFinePlan.get("startDate"));
        }
        
        window.finePlans = window.fetchFinePlans(window.selectedRelation.get("clientEmail"), mode);

        this.listenToOnce(window.list, "sync", this.updateListeners);
    },
    drawCharts: function(catID) 
    {
        if (this.editMode == "Nutrition") 
        {
            var data = window.initPieChartData(catID);
        } 
        else 
        {
            var data = window.initActivityPieChartData(catID);
        }
        var id = catID + "-charts";
        $("#" + id).empty();
        window.drawDonut(id, data);
    },
    drawDayCharts: function(catID) 
    {
        var data = this.editMode == "Nutrition" ? window.initDayChartData(catID) : window.initActivityDayChartData(catID);
        var id = this.editMode == "Nutrition" ? catID : catID + "-charts";
        
        $("#day-charts-container").empty();
        var name = this.editMode == "Nutrition" ? window.enums.Category.properties[catID].name : catID;
        var key = this.editMode == "Nutrition" ? window.enums.Category.properties[catID].key : "";
        //$("#GLOBAL").prepend("<div>" + name + "</div>");
        $("#stats-title").html(name);
        if (this.editMode != "Nutrition") 
        {
            this.updateFitnessRef();
        } 
        else 
        {
            var totalData = window.initDayChartData("GLOBAL");
            if (totalData[0] == undefined) 
            {
                window.initReferenceViews();
                return;
            }
            this.updateReference(totalData);
        }
        if (data[0] == undefined) 
        {
            //$("#day-charts-error-container").removeClass("hide");
            this.sunBurstChart = new SunBurstChart({}, {}, name, key);
            //$("#container").append("<div id=\"day-charts-error-container\" class=\"center\">NO DATA </div>");
            return;
        }
        
        //$("#day-charts-error-container").addClass("hide");
        if (this.editMode == "Nutrition")
            this.sunBurstChart = new SunBurstChart(struct, window.selectedFinePlanEntries.weekDayStats[window.selectedWeekDay].day_avg, name, key);
        else
        {
            console.log("draw donut");
            this.sunBurstChart.cleanChart();
            this.sunBurstChart.hide();
            window.drawDonut("container", data);
            $("#stats-title").html(catID);
            //this.sunBurstChart.currentChartData = data;
            //this.sunBurstChart.renderChart();
        }
        //window.drawDonut("day-charts-container", data);
    },
    updateFitnessRef: function() 
    {
        var f = new FitnessStats();
        for (var attr in f.attributes) 
        {
            
            var data = window.initActivityDayChartData(attr);
            var sum = 0;
            for (var d in data) 
            {
                sum += data[d]["value"];
            }
            if (window.reference[attr] == undefined)
                return;
            var percentage = sum / window.reference[attr] * 100;
            // percentage = percentage > 100 ? 100: percentage;
            percentage = percentage < 0 ? 0 : percentage;
            if (window.referenceViews[attr] != undefined)
                window.referenceViews[attr].update(parseFloat(percentage).toFixed(0));
        
        }
    
    
    },
    hide: function() 
    {
        //$(".plans-container").removeClass("hide");
        //$(".relations-container").removeClass("hide");
        $("#weekday-container").addClass("hide");
        $("#plan-meals-container").addClass("hide");
        $("#edit-nutrition-plan-content").addClass("hide");
        //$("#save-btn").addClass("hide");
        this.stopListening();
    },
    
    show: function() 
    {

        var start = new Date().getTime();

        var self = this;
        //$("#action-btn").addClass("hide");
        window.clientPlans = window.fetchPlans();
        window.clientPlans.on("sync", function() 
        {
            window.updateReferences();
            self.renderDayStats();
        });
        
        //$("#save-btn").removeClass("hide");
        $(".plans-container").addClass("hide");
        $(".relations-container").addClass("hide");
        $("#weekday-container").removeClass("hide");
        $("#plan-meals-container").removeClass("hide");
        //$("#relation-side-navigation-container").addClass("hide");
        $("#edit-nutrition-plan-content").removeClass("hide");
        
        if (window.activeEditMode != this.editMode) 
        {
            $("#switch-plan-type").trigger("click");
        }
        
        $(".nutritionCategory").droppable({
            drop: function(event, ui) {
                window.event = event;
                window.ui = ui;
                self.addNewEntryToPlan({
                    mealID: ui.draggable.attr("data-mealid"),
                    timeslot: this.id,
                    authorId: window.selectedRelation.get("coachEmail")
                });
            }
        });
        
        $(".activityCategory").droppable({
            drop: function(event, ui) {
                self.activeFitnessCategory = this.id;
                self.selectedFitnessActivity = ui.draggable.attr("data-activityid");
                $("#add-activity-entry-modal").openModal();
            }
        });
        
        $("body").droppable({
            drop: function(event, ui) {
                var cat = ui.draggable.offsetParent()[0].id;
                if (self.editMode == "Nutrition") 
                {
                    self.removeEntryFromPlan(ui.draggable.attr("data-mealid"), cat);
                } 
                else 
                {
                    self.removeEntryFromPlan(ui.draggable.attr("data-activityid"), cat);
                }
            
            }
        });
        this.chageMode();
        //$("img.lazy").lazyload();
        console.log("duration  : " + (new Date().getTime() - start));
    },
    enableDayStats: function() 
    {
        /* if ($(".day-stats-conainer").hasClass("hide"))
        {
            $(".day-stats-conainer").removeClass("hide");
            this.renderDayStats();
        } 
        else 
        {
            $(".day-stats-conainer").addClass("hide");
        }*/
        this.renderDayStats();
    },
    renderDayStats: function() 
    {
        var self = this;
        
        if (this.editMode == "Nutrition") 
        {
            /* $.each(window.enums.Category.properties, function(k, v)
            {
                self.drawDayCharts(window.enums.Category,this.viewCounter);
            }
            ); */
            self.drawDayCharts(getPosAttribute(window.enums.Category, this.viewCounter));
        } 
        else 
        {
            var f = new FitnessStats();
            /*$.each(f.attributes, function(k, v)
            {
                self.drawDayCharts(k);
            }
            );*/
            self.drawDayCharts(getPosAttribute(f.attributes, this.viewCounter));
        
        }
    
    },
    updateReference: function(data) 
    {
        
        
        
        for (var p in data) 
        {
            var label = data[p]["label"];
            var percentage = 0;
            
            
            if (window.reference[label] != undefined)
                percentage = data[p]["value"] / window.reference[label] * 100;
            
            // percentage = percentage > 100 ? 100: percentage;
            percentage = percentage < 0 ? 0 : percentage;
            
            // $("#" + label).css('max-height', percentage+"%");
            if (window.referenceViews[label] != undefined)
                window.referenceViews[label].update(parseFloat(percentage).toFixed(0));
        
        }
    },
    changedActivity: function() 
    {
        this.updateView();
    },
    addEntryToPlan: function(model) 
    {
        
        var entry = [];
        
        if (this.editMode == "Nutrition")
            entry = window.selectedFinePlanEntries.where({
                timeslot: model.get("timeslot"),
                weekDay: model.get("weekDay"),
                mealUuid: model.get("mealUuid")
            });
        else
            entry = window.selectedFinePlanEntries.where({
                timeslot: model.get("timeslot"),
                weekDay: model.get("weekDay"),
                goals: model.get("goals")
            });
        
        if (entry.length == 0) 
        {
            if (this.editMode != "Nutrition")
                window.selectedFinePlanEntries.add(new FitnessPlanEntry(model.attributes));
            else 
            {
                window.selectedFinePlanEntries.add(new NutritionPlanEntry(model.attributes));
            }
            if (model.get("weekDay") == window.selectedWeekDay) 
            {
                //console.log(model.get("weekDay"));
                console.log(window.selectedWeekDay);
            
            }
            this.updateView();
        }
    
    
    
    },
    removePlannedExistingPE: function(model) 
    {
        
        var entry = window.selectedFinePlanEntries.where(model.attributes);
        if (entry.length > 0) 
        {
            window.selectedFinePlanEntries.remove(entry[0]);
            if (model.get("weekDay") == window.selectedWeekDay) 
            {
                this.updateView();
            }
        }
    },
    updateListeners: function() 
    {

        this.listenTo(window.list, "add", this.addEntryToPlan);
        this.listenTo(window.list, "remove", this.removePlannedExistingPE);
        this.listenTo(window.list, "change", this.changedActivity);
        
        var self = this;
        if (this.editMode == "Nutrition") 
        {
            window.selectedFinePlanEntries = new NutritionPlanEntryCollection();
            //window.listBack = new NutritionPlanEntryCollection();
            $.each(window.list.models, function(k, v) {
                window.selectedFinePlanEntries.add(new NutritionPlanEntry(v.attributes));
            }
            );
        } 
        else 
        {
            window.selectedFinePlanEntries = new FitnessPlanEntryCollection();
            //window.listBack = new FitnessPlanEntryCollection();
            $.each(window.list.models, function(k, v) {
                window.selectedFinePlanEntries.add(new FitnessPlanEntry(v.attributes));
            }
            );
        
        }
        
        this.updateView();
        
        window.selectedFinePlanEntries.on("entriesStatsUpdated", function(options) 
        {
            self.renderCategory(options);
        }
        );
    
    
    },
    overwritePlan: function() 
    {
        this.stopListening();
        var startDate;
        var planName;
        var path;
        var mode
        if (this.editMode == "Nutrition") 
        {
            startDate = $("#n-fine-plan-start-date").pickadate("picker").get("select").pick;
            planName = $("#n-fine-plan-name").val();
            path = "/pn/N_";
            mode = "en";
        } 
        else 
        {
            startDate = $("#f-fine-plan-start-date").pickadate("picker").get("select").pick;
            planName = $("#f-fine-plan-name").val();
            path = "/pf/F_";
            mode = "ef";
        }
        
        startDate = new Date(startDate);
        var day = startDate.getDay();
        diff = startDate.getDate() - day + (day == 0 ? -6 : 1);
        startDate = new Date(startDate.setDate(diff));
        
        var coarsePlans = {};
        var att = {
            startDate: startDate.getTime(),
            name: planName,
            trackedBy: window.tags
        };
        
        var p = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans" + path + startDate.getTime());
        p.set(att);
        console.log("overwrite");
        window.removePlannedEntries(startDate.getTime(), mode, true);
        
        $(".toast").remove();
        Materialize.toast('The plan has been successfully saved !', 4000);
        this.listenToOnce(window.list, "sync", this.updateListeners);
    },
    createCoarsePlans: function(fieldID, datatype, startDate) 
    {
        var planUuid = startDate;
        var hlg;
        var statName;
        
        if (this.editMode == "Nutrition") 
        {
            hlg = "HEALTHY_EATING";
            statName = "day_avg";
            planUuid = "N_" + startDate;
        } 
        else 
        {
            hlg = "SPORTS";
            statName = "day-total";
            planUuid = "F_" + startDate;
        }
        
        $.each(window.weekDays, function(k, v) 
        {
            if (v > 1) 
            {
                var plan = new Plan();
                var startD = window.addDaysToDate(startDate, v - 2);
                var endDate = window.addDaysToDate(startD.getTime(), 1);
                var targetValue = window.selectedFinePlanEntries.weekDayStats[k][statName][fieldID];
                
                plan.set({
                    //currentValue: 0,
                    dataType: datatype,
                    endDate: endDate.getTime(),
                    highLevelGoalType: hlg,
                    inactivationDate: -1,
                    lastUpdateDate: -1,
                    schedule: "DAY",
                    startDate: startD.getTime(),
                    state: "ACTIVE",
                    targetValue: targetValue,
                    finePlanUuid: planUuid
                });
                
                plan.id = plan.get("finePlanUuid").split("_")[0] + startDate + plan.get("dataType");
                
                if (targetValue != 0)
                    window.coarsePlans.add(plan);
            
            }
        
        }
        );
    },
    savePlan: function() 
    {
        this.stopListening();
        var self = this;
        var startDate;
        var planName;
        var path;
        var mode;
        
        if (window.selectedFinePlanEntries.models.length == 0) 
        {
            $(".toast").remove();
            Materialize.toast("Please add some activities before saving the plan.", 4000);
            return;
        }
        
        if (this.editMode == "Nutrition") 
        {
            path = "/pn/N_";
            mode = "en";
            startDate = $("#n-fine-plan-start-date").pickadate("picker").get("select").pick;
            planName = $("#n-fine-plan-name").val();
        } 
        else 
        {
            path = "/pf/F_";
            mode = "ef";
            startDate = $("#f-fine-plan-start-date").pickadate("picker").get("select").pick;
            planName = $("#f-fine-plan-name").val();
        }
        
        startDate = new Date(startDate);
        var day = startDate.getDay();
        diff = startDate.getDate() - day + (day == 0 ? -6 : 1);
        startDate = new Date(startDate.setDate(diff));
        var plan = window.finePlans.findWhere({
            startDate: startDate.getTime()
        });
        window.tags = {};
        window.coarsePlans = new PlanCollection();


        //TODO Enable coarse plan tracking
        /*if (this.editMode == "Nutrition")
        {
            $.each($(".nutrition-plan-tag"), function(k, v) 
            {
                if (v.checked) 
                {
                    self.createCoarsePlans(v.id, $(v).data("act"), startDate.getTime());
                    window.tags[$(v).data("act")] = "true";
                }
            }
            );
        } 
        else 
        {
            $.each($(".fitness-plan-tag"), function(k, v) 
            {
                if (v.checked) 
                {
                    self.createCoarsePlans(v.id, $(v).data("act"), startDate.getTime());
                    window.tags[$(v).data("act")] = "true";
                }
            }
            );
        }*/
        
        if (plan != undefined) 
        {
            $(".toast").remove();
            Materialize.toast('<span>A plan already exists for the selected start date. Would you like to overwrite it?</span><a class="btn-flat yellow-text" onclick = "return false;" id="overwrite-plan">Accept<a>', 5000);
            $("#overwrite-plan").click(function(e) 
            {
                self.overwritePlan();
                e.currentTarget.parentElement.remove();
            }
            );
            return;
        } 
        else 
        {
            var coarsePlans = {};
            
            
            var att = {
                startDate: startDate.getTime(),
                name: planName,
                trackedBy: window.tags
            };
            var p = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/fine-plans" + path + startDate.getTime());
            p.set(att);
            window.savePlannedEntries(window.selectedFinePlanEntries.models, startDate.getTime(), mode);
            $(".toast").remove();
            Materialize.toast('The plan has been successfully added !', 4000);
            this.listenToOnce(window.list, "sync", this.updateListeners);
        }
    },
    removeEntryFromPlan: function(id, timeslot) 
    {
        if (this.editMode == "Nutrition") 
        {
            var att = {
                timeslot: timeslot,
                mealUuid: id,
                weekDay: window.selectedWeekDay
            };
            var entry = window.selectedFinePlanEntries.findWhere(att);
            if (entry != undefined && entry.get("authorId") == "") 
            {
                return;
            }
            window.selectedFinePlanEntries.remove(entry);
            this.renderDayStats();
        } 
        else 
        {
            var att = {
                timeslot: timeslot,
                name: id,
                weekDay: window.selectedWeekDay
            };
            var entry = window.selectedFinePlanEntries.findWhere(att);
            if (entry != undefined && entry.get("authorId") == "") 
            {
                return;
            }
            
            window.selectedFinePlanEntries.remove(entry);
            this.renderDayStats();
        }
    },
    updateView: function() 
    {
        if (this.editMode == "Nutrition") 
        {
            this.renderCategory({
                timeslot: "SNACKS",
                weekDay: window.selectedWeekDay
            });
            this.renderCategory({
                timeslot: "DINNER",
                weekDay: window.selectedWeekDay
            });
            this.renderCategory({
                timeslot: "BREAKFAST",
                weekDay: window.selectedWeekDay
            });
            this.renderCategory({
                timeslot: "LUNCH",
                weekDay: window.selectedWeekDay
            });
        } 
        else 
        {
            this.renderCategory({
                timeslot: "AFTERNOON",
                weekDay: window.selectedWeekDay
            });
            this.renderCategory({
                timeslot: "MORNING",
                weekDay: window.selectedWeekDay
            });
            this.renderCategory({
                timeslot: "NIGHT",
                weekDay: window.selectedWeekDay
            });
            this.renderCategory({
                timeslot: "EVENING",
                weekDay: window.selectedWeekDay
            });
        }
        
        this.renderDayStats();
    },
    addNewEntryToPlan: function(map) 
    {
        if (this.editMode == "Nutrition") 
        {
            var att = {
                timeslot: map.timeslot,
                mealUuid: map.mealID,
                weekDay: window.selectedWeekDay,
                //authorId : window.selectedRelation.get("coachEmail")
            };
            var entry = window.selectedFinePlanEntries.findWhere(att);
            if (entry == null ) 
            {
                att["authorId"] = window.selectedRelation.get("coachEmail");
                window.selectedFinePlanEntries.add(new NutritionPlanEntry(att));
            }
        } 
        else {
            
            var temp = {};
            
            if (map.duration > 0)
                temp["DU" + "_" + this.selectedFitnessActivity] = map.duration;
            if (map.calories > 0)
                temp["CE" + "_" + this.selectedFitnessActivity] = map.calories;
            if (map.distance > 0)
                temp["DI" + "_" + this.selectedFitnessActivity] = map.distance;
            if (map.steps > 0)
                temp["ST" + "_" + this.selectedFitnessActivity] = map.steps;
            
            var entry = window.selectedFinePlanEntries.where({
                name: this.selectedFitnessActivity,
                timeslot: this.activeFitnessCategory,
                weekDay: window.selectedWeekDay
            });
            
            if (entry.length == 0) 
            {
                var name = window.enums.FitnessActivity.properties[this.selectedFitnessActivity].name.replace(/\_/g, ' ');
                name = name.split(".").length > 1 ? name.split(".")[1] + " " + name.split(".")[0] : name;
                var entry = new FitnessPlanEntry({
                    name: name,
                    id: this.selectedFitnessActivity + "_" + window.selectedWeekDay + "_" + this.activeFitnessCategory,
                    weekDay: window.selectedWeekDay,
                    timeslot: this.activeFitnessCategory,
                    goals: temp,
                    authorId: window.selectedRelation.get("coachEmail")
                });
                entry.id = this.selectedFitnessActivity + "_" + window.selectedWeekDay + "_" + this.activeFitnessCategory;
                window.selectedFinePlanEntries.add(entry);
            }
        }
        
        this.renderDayStats();
    },
    renderCategory: function(options) 
    {
        var self = this;
        if (this.editMode == "Nutrition") 
        {
            $("#" + options.timeslot + "-meals").empty();
            var entries = window.selectedFinePlanEntries.where(options);
            $.each(entries, function(k, v) 
            {
                var meal = window.meals.get(v.get("mealUuid"));
                var map = meal.attributes;
                map["authorId"] = v.get("authorId");
                $("#" + options.timeslot + "-meals").append(self.mealTemplate(map));
                var container = $($("#" + options.timeslot + "-meals").children('*[data-mealid = ' + meal.id + ']')[0]).children(".collapsible-body");
                self.renderMealStats(meal, container);
                $.each(meal.get("ingredients").models, function(k, v) 
                {
                    self.renderMealInredient(v, $($($("#" + options.timeslot + "-meals").children('*[data-mealid = ' + meal.id + ']')[0]).children()[1]).children(".mealIngredients"));
                }
                );
            }
            );
            
            $(".mealHeader ").draggable({
                helper: 'clone',
                revert: 'invalid',
                appendTo: 'body'
            });
        
        
        } 
        else 
        {
            $("#" + options.timeslot + "-entries").empty();
            var entries = window.selectedFinePlanEntries.where(options);
            $.each(entries, function(k, v) 
            {
                //console.log(v);
                $("#" + options.timeslot + "-entries").append(self.activityEntryTemplate({
                    m: v
                }));
            }
            );
            
            $(".activityHeader ").draggable({
                helper: 'clone',
                revert: 'invalid',
                appendTo: 'body'
            });
        
        }
        this.drawCharts(options.timeslot);
        $('.collapsible').collapsible({
            accordion: true
        });


    },
    renderMealInredient: function(ing, container) 
    {
        var ingTemp = this.ingredientTemplate({
            amount: ing.get("amount"),
            foodUuid: ing.get("foodUuid"),
            name: ing.food.get("name"),
            ingStats: ing.ingStats
        });

        container.append(ingTemp);

    },
    renderMealIngredients: function(meal) 
    {
        var self = this;
        $.each(meal.get("ingredients").models, function(k, v) 
        {
            self.renderMealInredient(v, $($('*[data-mealid = ' + meal.id + ']').children()[1]).children(".mealIngredients"));
        }
        );
    },
    
    renderAllMeals: function() {
        var self = this;
        $(self.mealsContainer).empty();
        $.each(window.meals.models, function(k, v) 
        {
            if (v.get("scope") == "e")
                self.renderMeal(v);
        }
        );
        $('.collapsible').collapsible({
            accordion: true
        });
        $(".mealHeader ").draggable({
            helper: 'clone',
            revert: 'invalid',
            appendTo: 'body'
        });
    
    },
    renderActivity: function(key, name) 
    {
        $(this.mealsContainer).append(this.activityTemplate({
            key: key,
            name: name
        }));
    },
    renderAllActivities: function() {
        var self = this;
        $(self.mealsContainer).empty();
        $.each(window.activityAutoCom, function(k, v) 
        {
            self.renderActivity(v.value, v.label);
        }
        );
        $(".activityHeader").draggable({
            helper: 'clone',
            revert: 'invalid',
            appendTo: 'body'
        });
    
    },
    renderMeal: function(v) 
    {

        var map = v.attributes;
        map["authorId"] = window.selectedRelation.get("coachEmail");
        $(this.mealsContainer).append(this.mealSideTemplate(map));
        this.renderMealStats(v, $('*[data-mealid = ' + v.id + ']').children(".collapsible-body"));
        this.renderMealIngredients(v);
    },
    renderMealStats: function(meal, container) 
    {
        var ingTemp = this.mealStatsTemplate({
            name: "Nutrients",
            ingStats: meal.mealStats
        });
        //container.empty();
        container.append(ingTemp);
    
    },
    bindAutocomplete: function(target, items) {
        var self = this;
        var me = this;
        $(target).autocomplete({
            minLength: 0,
            messages: {
                noResults: '',
                results: ""
            },
            open: function(event, ui) 
            {
                $('#plan-meals-container').removeClass("hide");
            
            },
            response: function(event, ui) {
                $('#plan-meals-container').empty();
                $('#plan-meals-container').addClass("hide");
            },
            source: function(request, response) {
                //var nameArray = $.map(items,function(meal){
                //	return {'label' : meal.name,'value':meal.mealID};
                //});
                var results = $.ui.autocomplete.filter(items, request.term);
                results = results.sort(function(a, b) {
                    return a.label.length - b.label.length
                }
                );
                //response(results.slice(0, 20));
                $('.plan-meals-container').empty();
                $.each(results, function(k, v) 
                {
                    if (self.editMode == "Nutrition") 
                    {
                        self.renderMeal(window.meals.get(v.value));
                    } 
                    else 
                    {
                        self.renderActivity(v.value, v.label);
                    }
                
                }
                );
                $(".mealHeader ").draggable({
                    helper: 'clone',
                    revert: 'invalid',
                    appendTo: 'body'
                });
                $(".activityHeader ").draggable({
                    helper: 'clone',
                    revert: 'invalid',
                    appendTo: 'body'
                });
            
            }
        })
        /*.data("ui-autocomplete")._renderItem = function(ul, item) {
            var v = window.meals.get(item.value);
            self.renderMeal(v);
            return;
            //return $("<div class='autocompleteEntry stdWhite categoryColorDark"+ item.timeslot+ "' id='"+item.value+"' data-mealID='"+item.value+"'>"+item.label+"</div>")
            //return $(self.mealTemplate(v.attributes))
            //.appendTo($(self.mealsContainer));
        
        }
        ;*/
    }

});
function getAttributePos(json, attribute) 
{
    var i = 0;
    for (var k in json) 
    {
        //console.log(k);
        if (k == attribute)
            return i;
        i++;
    }
}
function getPosAttribute(json, index) 
{
    var counter = 0;
    var result;
    for (var k in json) 
    {
        if (counter == 0)
            result = k;
        if (index == counter)
            result = k;
        counter++;
    
    }
    return result;

}
