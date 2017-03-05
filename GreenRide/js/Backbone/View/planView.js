var PlanView = Backbone.View.extend({
    events: {
    },
    
    el: "#plan-overview-content",
    planOverviewContainer: "#selected-plan-overview-content",
    planOverviewTemplate: "",
    planHistoryContainer: "#selected-plan-history-content",
    planHistoryTemplate: "",
    planCommentContainer: "#selected-plan-comments-content",
    quickActiveOverviewContainer: "#plans-overview-container-active",
    quickPassedOverviewContainer: "#plans-overview-container-passed",
    quickFuturesOverviewContainer: "#plans-overview-container-future",
    quickOverviewTemplate: "",
    planCommentTemplate: "",
    planDateSeparatorTemplate: "",
    syncCounter: 0,
    lastdate: null ,
    initialize: function() {
        
        var self = this;
        this.gaugeContainer = {};
        this.planOverviewTemplate = _.template($('#plan-overview-template').html());
        this.quickOverviewTemplate = _.template($('#plan-quick-overview-template').html());
        this.planHistoryTemplate = _.template($('#plan-history-template').html());
        this.planOverviewTemplateFine = _.template($('#plan-overview-template-fine').html());
        this.planCommentTemplate = _.template($('#plan-comments-template').html());
        this.planDateSeparatorTemplate = _.template($('#plan-comments-date-template').html());
        
        _.bindAll(this, "hide");
        
        $("#add-activity-plan").click(function(e) {
            self.createPlan(e);
        }
        );
           $("#add-comment").click(function(e) {
                    self.createComment(e);
                }
                );
        $('#activity-type').on('change', function(e) {
            e.preventDefault();
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            self.updateSelector(valueSelected);
            var type;
            $.each(window.enums.FilteredDataType.properties, function(index, data) 
            {
                if (((data.parent == "BODY_FAT_PERCENTAGE_SUMMARY" || data.parent == "ENERGY_BILANCE" || data.parent == "WEIGHT_SUMMARY") && data.parent == $("#activity-type").val()) || 
                (data.parent == $("#activity-type").val() && window.enums.FilteredDataType.properties[index].name == $("#activity-target-type").val())) 

                {
                    type = index;
                    return;
                }
            }
            );
            if (type != undefined) 
            {
                var unit = window.enums.FilteredDataType.resolve(type, "unit");
                $("#target-value-label").html("Target value in " + unit)
            }
        }
        );
        $('select ').on('contentChanged', function() {
            // re-initialize (update)
            if (this.id == "activity-target-type")
            {
                $('select').material_select('destroy');
                $(".caret").remove();
                $('select').material_select();
            }


        }
        );
        $('#activity-target-type').on('change', function(e) {
            e.preventDefault();
            var type;
            $.each(window.enums.FilteredDataType.properties, function(index, data) 
            {
                
                if (((data.parent == "BODY_FAT_PERCENTAGE_SUMMARY" || data.parent == "ENERGY_BILANCE" || data.parent == "WEIGHT_SUMMARY") && data.parent == $("#activity-type").val()) || 
                (data.parent == $("#activity-type").val() && window.enums.FilteredDataType.properties[index].name == $("#activity-target-type").val())) 

                {
                    type = index;
                    return;
                }
            }
            );
            if (type != undefined) 
            {
                var unit = window.enums.FilteredDataType.resolve(type, "unit");
                unit = unit == "hh:mm" ? "millisec" : unit;
                $("#target-value-label").html("Target value in " + unit)
            }
        }
        );
    
    },
    resetView: function() 
    {
        this.hide();
        this.show();
    },
    hide: function() 
    {
        this.gaugeContainer = {};
        this.$el.addClass("hide");
        $(this.planOverviewContainer).empty();
        $(this.quickActiveOverviewContainer).empty();
        $(this.quickFuturesOverviewContainer).empty();
        $(this.quickPassedOverviewContainer).empty();
        this.stopListening();
        this.syncCounter = 0;
    },
    /*decrementSync : function()
    {
        this.syncCounter --;
    },
    incrementSync : function()
    {
        this.syncCounter ++ ;
        if(this.syncCounter >= 3) this.renderAllPlans;
    },*/
     createComment: function(e)
        {
            e.preventDefault();
            if (window.selectedRelation.get("clientEmail") == "")
            {
                Materialize.toast('Can not add this comment. Add first new Clients !', 4000);
                return;
            }
            else
            {
                if (window.selectedRelation.get("relationState") == 0)
                {
                    Materialize.toast('Can not add this comment. The client did not yet accepted your invitation !', 4000);
                    return;
                }
                else if (window.selectedRelation.get("relationState") == 2)
                {
                    Materialize.toast('Can not add this comment. You have to first accept the client invitation !', 4000);
                    return;
                }


            }
            var text = $("#comment").val();
            var comment = new Comment();
            comment.set({
                author: window.selectedRelation.get("coachEmail"),
                message: text,
                read: false,
                targetId: null,
                targetType: "PLAN",
                ts: new Date().getTime(),
                valence: 0
            });
            var comments = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/comments/");
            comments.push(comment.attributes);
            Materialize.toast('The comment has been successfully sent !', 4000);

        },
    show: function() 
    {
        $("#active-plans-header").addClass("hide");
        $("#future-plans-header").addClass("hide");
        $("#passed-plans-header").addClass("hide");
        $("#plans-header").addClass("hide");
        this.gaugeContainer = {};
        this.listenTo(window.selectedRelation, "change ", this.resetView);
        
        this.render();
        
        window.clientPlans = null ;
        
        //window.fineNutritionPlans  = window.fetchFinePlans(window.selectedRelation.get("clientEmail"), "pn");
        //window.fineFitnessPlans  = window.fetchFinePlans(window.selectedRelation.get("clientEmail"), "pf");
        //window.plansHistory = window.fetchPlanHistory(window.selectedRelation.get("clientEmail"));
        //window.clientPlans = window.fetchPlans();
        
        syncCounter = 0;
        
        //this.listenToOnce(window.clientPlans, "sync", this.updateListeners);
        //this.listenToOnce(window.plansHistory, "sync", this.updateListeners);
        
        //this.listenToOnce(window.fineNutritionPlans, "sync", this.updateListeners);
        //this.listenToOnce(window.fineFitnessPlans, "sync", this.updateListeners);
        //this.listenToOnce(window.plansHistory, "sync", this.updateListeners);
        if (window.clientData.get("COARSEPLANS_sync")) 
        {
            this.updateListeners();
        } 
        else 
        {
            this.listenTo(window.clientData.get("COARSEPLANS"), "sync ", this.updateListeners);
        }
        if (window.clientData.get("GOALHISTORY_sync")) 
        {
            this.updateListeners();
        } 
        else 
        {
            this.listenTo(window.clientData.get("GOALHISTORY"), "sync ", this.updateListeners);
        }
    },
    updateListeners: function() 
    {
        syncCounter++;
        if (syncCounter >= 2) 
        {
            /*this.listenTo(window.clientPlans, "remove", this.removePlan);
             this.listenTo(window.clientPlans, "add", this.addPlan);
             this.listenTo(window.clientPlans, "change", this.changePlan);
             //this.listenTo(window.fineNutritionPlans, "remove", this.removePlan);
             //this.listenTo(window.fineNutritionPlans, "add", this.addPlan);
             //this.listenTo(window.fineFitnessPlans, "remove", this.removePlan);
             //this.listenTo(window.fineFitnessPlans, "add", this.addPlan);
             //this.listenTo(window.plansHistory, "change add remove", this.renderAllPlans);

             this.renderAllPlans();   */
            //TODO implement remove and add separetly
            this.listenTo(window.clientData.get("COARSEPLANS"), "remove", this.renderAllPlans);
            this.listenTo(window.clientData.get("COARSEPLANS"), "add", this.renderAllPlans);
            this.listenTo(window.clientData.get("COARSEPLANS"), "change", this.renderAllPlans);
            this.listenTo(window.clientData.get("GOALHISTORY"), "change add remove", this.renderAllPlans);
            this.listenTo(window.clientData.get("PROFILEHISTORY"), "change", this.renderAllPlans);
            this.renderAllPlans();
        }
    
    },
    //change plan
    changePlan: function(plan) 
    {
        if (plan.get("trackedBy") != undefined)
            return;
        this.removePlan(plan);
        this.addPlan(plan);
    
    },
    //remove plan from overview
    removePlan: function(plan) 
    {
        var id = plan.get("id");
        if (plan.get("trackedBy") != undefined) 
        {
            for (var t in plan.get("trackedBy")) 
            {
                id = plan.get("id") + "_" + t;
                $("#" + id).parent().parent().parent().remove();
            }
        } 
        else 
        {
            $("#" + id).parent().parent().parent().remove();
        }
    },
    addPlan: function(plan) 
    {
        if (plan.get("trackedBy") != undefined) 
        {
            /*for(var k in plan.get("trackedBy"))
            {
                this.renderFinePlan(plan.get("name"),plan.get("id"),k, plan.get("startDate"));
            }*/
            console.log("fine plan");
        } 
        else 
        {
            this.renderCoarsePlan(plan);
        }
    
    },
    renderAllPlans: function() 
    {
        $(this.planOverviewContainer).empty();
        $(this.quickFuturesOverviewContainer).empty();
        $(this.quickActiveOverviewContainer).empty();
        $(this.quickPassedOverviewContainer).empty();
        if (window.clientData.get("COARSEPLANS").models.length == 0)// && window.fineFitnessPlans.models == 0)
        {
            $("#toast-container").empty()
            Materialize.toast('The user has no plans yet.Please add new plans !', 4000);
        }
        
        this.renderAllCoarsePlans();
        //this.renderAllFinePlans();
    },
    renderAllCoarsePlans: function() 
    {
        var self = this;
        
        $.each(window.clientData.get("COARSEPLANS").models, function(key, value) 
        {
            if (value.get("finePlanUuid") == undefined) 
            {
                self.renderCoarsePlan(value);
            }
        
        });
    },
    renderAllFinePlans: function() 
    {
        var self = this;
        
        $.each(window.fineFitnessPlans.models, function(key, value) 
        {
            if (value.get("trackedBy") != undefined) 
            {
                $.each(value.get("trackedBy"), function(k, v) 
                {
                    self.renderFinePlan(value.get("name"), value.id, k, value.get("startDate"));
                });
            }
        });
        
        $.each(window.fineNutritionPlans.models, function(key, value) 
        {
            if (value.get("trackedBy") != undefined) 
            {
                $.each(value.get("trackedBy"), function(k, v) 
                {
                    self.renderFinePlan(value.get("name"), value.id, k, value.get("startDate"));
                });
            }
        });
    },
    renderCoarsePlan: function(model) 
    {
        //$("#passed-plans-header").removeClass("hide");
        $(this.planOverviewContainer).append(this.planOverviewTemplate(model.toJSON()));
        var chartsData = window.initMyPlanDataHistory(model);
        window.drawGooglePlanChart(model, model.id, chartsData);
        this.renderQuickOverview(model, chartsData);
    },
    renderQuickOverview: function(model, chartsData) 
    {
        var percent = 0;
         var end = new Date();
         var targetValue = model.get("targetValue") == 0 ? 1 : model.get("targetValue");

            if(model.get("endDate") == 0)  end = window.addDaysToDate(new Date().getTime(),30);
            else end = new Date(model.get("endDate"));

        //PLAN IS ACTIVE
        if (model.get("startDate") <= new Date().getTime() && end >= new Date().getTime())
        {
            $("#active-plans-header").removeClass("hide");
            $(this.quickActiveOverviewContainer).append(this.quickOverviewTemplate(model.toJSON()));


            if (model.get("targetValue") != undefined && model.get("targetValue") >  0)
                percent = chartsData["todayValue"] / model.get("targetValue") * 100;
                else if(model.get("targetValue") != undefined && model.get("targetValue") <  0)
                {
                   percent = chartsData["todayValue"]  / model.get("targetValue") * 100;
                   percent =  percent < 0 ? Math.abs(percent) + 100 : percent;
                }
                else if(model.get("targetValue") != undefined && model.get("targetValue") ==  0)
                {
                          percent = chartsData["todayValue"] * 100;
                }

               if(model.get("dataType") == "EBI")
               {
                        percent = Math.abs(percent);
               }
                 if(model.get("dataType") == "BWE")
                 {
                    var targetValue =  model.get("targetValue") - model.get("initialValue");
                    var diff =    window.clientData.get("PROFILE").get("weightInKG") - model.get("initialValue");
                    percent = diff / targetValue * 100;
                 }
        
        
        }
        //PLAN PASSED
         
        else if (end < new Date().getTime())
        {
            $("#passed-plans-header").removeClass("hide");
            $(this.quickPassedOverviewContainer).append(this.quickOverviewTemplate(model.toJSON()));
            var total = 0;
            $.each(window.myOverviewCharts[0].collection.models[0].attributes["data"], 
            function(k, v) {
                total += v;
            });

            percent = total / (window.myOverviewCharts[0].labels.length * model.get("targetValue")) * 100;
                           if(model.get("dataType") == "EBI")
                                    percent = Math.abs(percent);

        } 
        else if (model.get("startDate") > new Date().getTime()) 
        {
            $("#future-plans-header").removeClass("hide");
            $(this.quickFuturesOverviewContainer).append(this.quickOverviewTemplate(model.toJSON()));
        }
      //  if(model.get("dataType") != "EBI")
          this.renderGauge(model, percent);
      //  else window.drawGauge(model.get("id") + "-gauage");
    
    },
    renderGauge: function(model, percent) 
    {
        var config = window.chartsConfigs["lila"];
        
        
        if (percent == 100)
            config = window.chartsConfigs["green"];
        else if (percent > 100)
            config = window.chartsConfigs["red"];
        
        
        this.gaugeContainer[model.get("id")] = loadLiquidFillGauge("ID" + model.get("id") + "-gauge", parseFloat(percent).toFixed(0), config);

        $("#"+"ID" + model.get("id") + "-gauge").parent().parent().on("click", function()
        {
            $('html, body').animate({
                scrollTop: $("#" + model.get("id")).offset().top - 250
            }, 1000);
        });
    },
    renderFinePlan: function(name, planID, key, startDate) 
    {
        var plan = new Plan();
        var id = planID + "_" + key;
        plan.set({
            name: name,
            id: id,
            finePlanUuid: planID,
            dataType: key,
            startDate: startDate,
            highLevelGoalType: "HEALTHY_EATING"
        });
        
        $(this.planOverviewContainer).append(this.planOverviewTemplateFine(plan.toJSON()));
        var chartsData = window.initMyPlanDataHistory(plan);
        window.drawGooglePlanChart(plan, id, chartsData);
    },
    /*  renderAllComments: function()
    {
        this.lastdate = null ;
        $(this.planCommentContainer).empty();
        this.listenTo(window.planComments, "add", this.renderComment);
        self = this;
        $(this.planCommentContainer).addClass("hide");
        window.planComments.models.forEach(function(entry) {
            
            self.renderComment(entry);
        }
        );
    },
    renderComment: function(comment) 
    {
        $(this.planCommentContainer).removeClass("hide");
        var currentDate = new Date(comment.get("ts"));
        if (this.lastdate == null  || (currentDate.getUTCMonth() != this.lastdate.getUTCMonth() || currentDate.getUTCDate() != this.lastdate.getUTCDate() || currentDate.getUTCFullYear() != this.lastdate.getUTCFullYear())) 
        {
            this.lastdate = currentDate;
            this.renderCommentDate(this.lastdate.getTime());
        }
        $(this.planCommentContainer).append(this.planCommentTemplate(comment.toJSON()));
    },
    renderCommentDate: function(date) 
    {
        $(this.planCommentContainer).append(this.planDateSeparatorTemplate({
            d: date
        }));
    }, */
    render: function() {
        this.$el.removeClass("hide");
    },
    createPlan: function(e) {

       // plans.once("sync", function() {
            
            e.preventDefault();
            if (window.selectedRelation.get("clientEmail") == "") 
            {
                Materialize.toast('Can not add this plan. Add first new Clients !', 4000);
                return;
            } 
            else 
            {
                if (window.selectedRelation.get("relationState") == 0) 
                {
                    Materialize.toast('Can not add this plan. The client did not yet accepted your invitation !', 4000);
                    return;
                } 
                else if (window.selectedRelation.get("relationState") == 2) 
                {
                    Materialize.toast('Can not add this plan. You have to first accept the client invitation !', 4000);
                    return;
                }
            
            }
            var startDate = $("#p-start-date").pickadate("picker").get("select").pick;
            var endDate = $("#p-end-date").pickadate("picker").get("select").pick;
            var tempEndDate = startDate;
            
            //var nrOfSchedules = parseInt($("#nr-schedules").val());
            var schedule = "DAY";//$("#activity-schedule").val()
            switch (schedule)
            {
            case "DAY":
                tempEndDate = window.addDaysToDate(startDate, 1).getTime();
                break;
            case "WEEK":
                var dayInMillis = 1000 * 60 * 60 * 24;
                var diff = endDate - startDate < 0 ? 0 : endDate - startDate;
                var nrSchedules = diff % 7 > 0 ? Math.floor(diff / (7 * dayInMillis)) + 1 : Math.floor(diff / (7 * dayInMillis));
                nrSchedules = nrSchedules == 0 ? 1 : nrSchedules;
                tempEndDate = window.addDaysToDate(startDate, nrSchedules * 7).getTime();
                break;
            case "MONTH":
                startDate = window.getFirstDayOfMonth(startDate);
                startDate = startDate < new Date().getTime() ? window.addMonthsToDate(startDate, 1).getTime() : startDate;
                tempEndDate = window.addMonthsToDate(startDate, 1).getTime();
                while (tempEndDate < endDate) 
                {
                    tempEndDate = window.addMonthsToDate(tempEndDate, 1).getTime();
                }
                break;
            default:
                tempEndDate = endDate;
                break;
            }
            
            if (tempEndDate > endDate)
                endDate = tempEndDate;
            
            var type = null ;
            $.each(window.enums.FilteredDataType.properties, function(index, data)
            {
                
                if (((data.parent == "BODY_FAT_PERCENTAGE_SUMMARY" || data.parent == "ENERGY_BILANCE" || data.parent == "WEIGHT_SUMMARY") && data.parent == $("#activity-type").val()) || 
                (data.parent == $("#activity-type").val() && window.enums.FilteredDataType.properties[index].name == $("#activity-target-type").val())) 

                {

                    type = index;
                    return;
                }
            }
            );
            if (type == null ) 
            {
                Materialize.toast('Error check the fields !', 4000);
                return;
            }
            window.existingPlan = undefined;
            window.findOverlappingPlan(window.clientData.get("COARSEPLANS"), type, $("#activity-schedule").val(), startDate, endDate);
            if (window.existingPlan != undefined) 
            {
                var STDate = new Date(window.existingPlan.get("startDate"));
                var ENDate = new Date(window.existingPlan.get("endDate"));
                Materialize.toast('There already exists a plan that overlaps the selected  time interval!  From : ' + STDate.getDate() + "-" + (STDate.getMonth() + 1) + ' To : ' + ENDate.getDate() + "-" + (ENDate.getMonth() + 1), 4000);
                return;
            }

            var plan = new Plan({
                highLevelGoalType: $("#activity-goal").val(),
                dataType: type,
                endDate: endDate,
                inactivationDate: -1,
                lastUpdateDate: -1,
                schedule: "DAY",//$("#activity-schedule").val(),
                startDate: startDate,
                state: 'ACTIVE',
                targetValue: $("#target-value").val()
            });
            
            var goal = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/goals/" + $("#activity-goal").val());
            goal.set({
                type: $("#activity-goal").val()
            });
            
            var plans = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/plans/");
            plans.push(plan.attributes);
            
            //$("#mobile-client-plans").trigger( "click" );
            Materialize.toast('The plan has been successfully added !', 4000);
        
       // });
    },
    updateSelector: function(filter) 
    {
        
        //PZ hier werden die options neu generiert fuer das add plan
        
        var $select = $("#activity-target-type").empty().html("");
        $select.append($("<option  disabled selected></option>").attr("value", "")
        .text("Choose the target value type")
        );
        $.each(window.enums.FilteredDataType.properties, function(index, data)
        {
            if (data.parent == $("#activity-type").val() 
            && $("#activity-type").val() != "BODY_FAT_PERCENTAGE_SUMMARY" 
            && $("#activity-type").val() != "WEIGHT_SUMMARY" 
            && $("#activity-type").val() != "ENERGY_BILANCE") {
                var name = window.enums.FilteredDataType.resolve(window.enums.FilteredDataType[index], "name");
                if (window.enums.FilteredDataType.properties[index].name.indexOf("REFERENCE") > -1
                || window.enums.FilteredDataType.properties[index].name.indexOf("OTHERS") > -1
                || name == "Unknown" 
                || name == "T0D0" 
                || name == "Idle") 
                {
                    return;
                }
                $select.append(
                $("<option></option>")
                .attr("value", window.enums.FilteredDataType.properties[index].name)
                .text(name)
                );
            }
        }
        );
        
        
        $select.trigger('contentChanged');
    
    }
});

window.findOverlappingPlan = function(collection, dataType, scope, startDate, endDate) 
{
    var filteredCollection = collection.where({
        dataType: dataType,
        schedule: scope
    });
    $.each(filteredCollection, function(k, v) 
    {
        if ((v.get("endDate") >= endDate && v.get("startDate") < endDate) || 
        (v.get("endDate") > startDate && v.get("startDate") <= startDate)) 
        {
            window.existingPlan = v;
            return;
        }
    });
}
