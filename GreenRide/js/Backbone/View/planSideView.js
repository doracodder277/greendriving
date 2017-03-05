var PlanSideView = Backbone.View.extend({
    events: {
        "click .plan": "planPress"
    },
    el: "#plan-side-navigation-container",
    child: "#mobile-plans-container",
    mobileChild: "#mobile-plans-container",
    planTemplate: "",
    goalTemplate: "",
    planContent: "",
    finePlanTemplate: "",
    initialize: function() {
        var self = this;
        this.hide();
        this.planTemplate = _.template($('#plan-side-template').html());
        this.planContent = _.template($("#plan-side-content-template").html());
        this.goalTemplate = _.template($("#goal-template").html());
        this.finePlanTemplate = _.template($("#fine-plan-side-template").html());
        //window.selectedRelation.set((new CoachingRelation()).attributes);
        this.listenTo(window.selectedRelation, "change", this.resetPlans);
        this.resetPlans();
        _.bindAll(this, "hide", "resetPlans", "renderAll", "planPress");
        $("#add-plan").click(function(e) {
            self.addClient(e);
        }
        );
        $('.plans-button-collapse').sideNav({
            edge: 'left',
            dismissible: true,
            // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
        );
        
        $("#add-activity-plan").click(function(e) {
        // self.createPlan(e);
        
        
        }
        );
        
        $("#add-comment").click(function(e) {
            self.createComment(e);
        
        }
        );
        
        
        $("#edit-new-target-value").click(function(e) {
            Materialize.toast('Value has been updated successfully !', 4000);
            var plan = window.clientPlans.get(window.selectedPlan.id);
            plan.set({
                targetValue: $("#new-target-value").val()
            });
        }
        );
        
        
        this.render();
    
    
    },
    hide: function() 
    {
        this.$el.addClass("hide");
        $('#add-plan-modal').closeModal();
        $(this.child).empty();
        //$(this.mobileChild).empty();
        //this.stopListening();
    },
    resetPlans: function() 
    {
        if (window.selectedRelation.get("clientEmail") != "") 
        {
            if (window.selectedRelation.get("relationState") != 1) 
            {
                $(this.child).empty();
                //$(this.mobileChild).empty();
                $(this.child).append(" <li class=\"collection-item center plansHeader\"><div>Selected client plans</div></li>");
                //$(this.mobileChild).append(" <li class=\"collection-item center plansHeader\"><div>Selected client plans</div></li>");
                window.selectedPlan.set({
                    finePlanUuid: undefined
                });
                window.selectedPlan.set(new Plan().attributes);
            } 
            else 
            {
                this.stopListening();
                this.listenTo(window.selectedRelation, "change", this.resetPlans);
                window.nutritionPlans = window.fetchFinePlans(window.selectedRelation.get("clientEmail"), "pn");
                
                this.listenToOnce(window.nutritionPlans, "sync", function() 
                {
                    window.fitnessPlans = window.fetchFinePlans(window.selectedRelation.get("clientEmail"), "pf");
                    this.listenToOnce(window.fitnessPlans, "sync", function() 
                    {
                        window.goals = window.fetchGoals();
                        this.listenToOnce(window.goals, "sync", this.renderAll);
                    }
                    );
                
                }
                );
            
            }
        
        }
    
    },
    renderAll: function() {
        $(this.child).empty();
        $(this.child).append(" <li class=\"collection-item center userHeader\"><div>Selected client plans</div></li>");
        //$(this.mobileChild).empty();
        
        window.selectedPlan.set({
            finePlanUuid: undefined
        });
        window.selectedPlan.set(new Plan().attributes);
        
        //$(".plans-container").prepend(" <li class=\"collection-item center plansHeader\"><div>Selected client plans</div></li>");
        //$("#mobile-plans-container").prepend(" <li class=\"collection-item center plansHeader \"><div>Selected client plans</div></li>");
        
        var self = this;
        for (var i = 0; i < window.goals.length; i++) {
            self.addGoal(window.goals.models[i].id);
        }
        for (var i = 0; i < window.nutritionPlans.length; i++) {
            self.addFinePlan(window.nutritionPlans.models[i]);
        }
        for (var i = 0; i < window.fitnessPlans.length; i++) {
            self.addFinePlan(window.fitnessPlans.models[i]);
        }
        for (var i = 0; i < window.clientPlans.length; i++) {
            self.addPlan(window.clientPlans.models[i]);
        }
        //this.listenTo(window.goals, "change", this.updatePlanCollection);
        //TODO
        this.listenTo(window.nutritionPlans, "change : name", this.changeFinePlan);
        this.listenTo(window.fitnessPlans, "change : name", this.changeFinePlan);
        this.listenTo(window.nutritionPlans, "add", this.addFinePlan);
        this.listenTo(window.fitnessPlans, "add", this.addFinePlan);
        this.listenTo(window.nutritionPlans, "remove", this.removeFinePlan);
        this.listenTo(window.fitnessPlans, "remove", this.removeFinePlan);
        this.listenTo(window.goals, "add", this.addGoalToCollection);
        this.listenTo(window.clientPlans, "add", this.addPlan);
        this.listenTo(window.clientPlans, "remove", this.removePlan);
        this.listenTo(window.clientPlans, "change", this.updateselectedPlanData);
    
    },
    removeFinePlan: function(model) 
    {
        this.listenTo(window.clientPlans, "sync", function() 
        {
            var elem = document.getElementById(model.id + "-container").parentNode.parentNode;
            if (elem != null )
                elem.parentNode.removeChild(elem);
        }
        );
    
    },
    removePlan: function(model) 
    {
        
        /*if (model.get("finePlanUuid") != undefined) 
        {
            
            var id = model.get("finePlanUuid") + "_" + model.get("dataType");
            var elem = document.getElementById(id);
            elem.parentNode.removeChild(elem);
            elem = document.getElementById(id);
            elem.parentNode.removeChild(elem);
        
        } 
        else 
        {*/
        var elem = document.getElementById(model.id);
        if (elem != null )
            elem.parentNode.removeChild(elem);
        //elem = document.getElementById(model.id);
        //elem.parentNode.removeChild(elem);
        /*if (model.get("finePlanUuid") != undefined) 
        {
            var p = window.clientPlans.findWhere({
                finePlanUuid: model.get("finePlanUuid")
            });
            if (p == undefined) 
            {
                
                var elem = document.getElementById(model.get("finePlanUuid") + "-container").parentNode.parentNode;
                console.log(elem);
                if (elem != null )
                    elem.parentNode.removeChild(elem);
            }
        } 
        else 
        {
            var p = window.clientPlans.findWhere({
                highLevelGoalType: model.get("highLevelGoalType")
            });
            if (p == undefined) 
            {
                var elem = document.getElementById(model.get("highLevelGoalType")).parentNode.parentNode;
                if (elem != null )
                    elem.parentNode.removeChild(elem);
            }
        }*/
        
        if (window.selectedPlan.id == model.id) 
        {
            window.selectedPlan.set({
                finePlanUuid: undefined
            });
            if (window.clientPlans.length == 0)
                window.selectedPlan.set(new Plan().attributes);
            else
                window.selectedPlan.set(window.clientPlans.models[0].attributes);
        }
        //}
    },
    changeFinePlan: function(model) 
    {
        console.log(model.get("name"));
    },
    addGoalToCollection: function(model) 
    {
        this.addGoal(model.id);
        //this.updatePlanCollection(model);
    },
    updateselectedPlanData: function(model) 
    {
        $("#" + model.get("highLevelGoalType")).children("#" + model.id).empty();
        $("#" + model.get("highLevelGoalType")).children("#" + model.id).append(this.planContent(model.toJSON()));
        //$("#" + model.get("highLevelGoalType") + "-mobile").children("#" + model.id).empty();
        //$("#" + model.get("highLevelGoalType") + "-mobile").children("#" + model.id).append(this.planContent(model.toJSON()));
        if (model.id == window.selectedPlan.id) 
        {
            window.selectedPlan.set({
                finePlanUuid: undefined
            });
            window.selectedPlan.set(model.attributes);
        }
    
    },
    planPress: function(e) 
    {
        
        if (window.navigationView.activeMobileMenue != "mobile-client-plans") 
        {
            $("#mobile-client-plans").trigger("click");
        }
        
        $('.plans-button-collapse').sideNav('hide');
        e.preventDefault();
        var x = window.clientPlans.findWhere({
            id: e.currentTarget.id
        });
        if (x == undefined) 
        {
            var info = e.currentTarget.id.split("_");
            var x = window.clientPlans.where({
                finePlanUuid: info[0] + "_" + info[1],
                dataType: info[2]
            });
            var d = new Date();
            if (x.length > 0) 
            {
                var model = x[0];
                $.each(x, function(k, v) 
                {
                    if (d >= v.get("startDate") && d < v.get("endDate")) 
                    {
                        model = v;
                    }
                }
                );
                x = model;
                //x.set("id", e.currentTarget.id);
                window.selectedPlan.set(x.attributes);
                
                return;
            } 
            else 
            {
                return;
            }
        }
        if (window.selectedPlan.id == x.id && window.selectedPlan.get("finePlanUuid") == undefined) 
        {
            //$('#edit-plan-value-modal').openModal();
            //$("#current-value").val(window.selectedPlan.get("targetValue"));
            $('#edit-plan-value-modal').openModal();
            return;
        }
        /*window.selectedPlan.set({
            finePlanUuid: undefined
        });*/
        window.selectedPlan.set("finePlanUuid", undefined);
        window.selectedPlan.set(x.attributes);
        //window.planManager = new PlanManager(window.selectedPlan);
        this.updateSelected();
    },
    updateSelected: function(e) {
        
        $(".planSelected").removeClass("planSelected");
        
        var id;
        id = window.selectedPlan.get("id");
        if (window.selectedPlan.get("finePlanUuid") != undefined) 
        {
            //id = window.selectedPlan.get("finePlanUuid") + "_" + window.selectedPlan.get("dataType");
            $("#" + window.selectedPlan.get("finePlanUuid") + "-container").children("#" + id).addClass("planSelected planUpdate");
        } 
        else 
        {
            
            $("#" + window.selectedPlan.get("highLevelGoalType")).children("#" + id).addClass("planSelected planUpdate");
            //$("#" + window.selectedPlan.get("highLevelGoalType") + "-mobile").children("#" + id).addClass("planSelected planUpdate");
        }
    
    
    },
    addGoal: function(id) 
    {
        $(this.child).append(this.goalTemplate({
            id: id
        }));
        /*$(this.mobileChild).append(this.goalTemplate({
            id: id + "-mobile"
        }));*/
    },
    addFinePlan: function(model) 
    {
        $(this.child).append(this.finePlanTemplate({
            name: model.get("name"),
            id: model.id
        }));
    },
    addgeneratedCoarsePlan: function(model) 
    {
        
        var plan = new Plan(model.attributes);
        var mode = model.get("finePlanUuid").split("_")[0];
        var finePlan = mode == "N" ? window.nutritionPlans.findWhere({
            id: model.get("finePlanUuid")
        }) : window.fitnessPlans.findWhere({
            id: model.get("finePlanUuid")
        });
        var startDate = finePlan.get("startDate");
        var endDate = window.addDaysToDate(startDate, 7).getTime();
        var today = new Date();
        today = window.clearDate(today).getTime();
        
        if (startDate <= today && today < endDate) 
        {
            var tomorrow = window.addDaysToDate(today, 1).getTime();
            if (plan.get("startDate") >= today && plan.get("startDate") < tomorrow) 
            {
                $("#" + model.get("finePlanUuid") + "-container").append(this.planTemplate(plan.toJSON()));
                
                if (window.selectedPlan.get("startDate") == 0) 
                {
                    window.selectedPlan.set({
                        finePlanUuid: undefined
                    });
                    window.selectedPlan.set(model.attributes);
                    this.listenTo(window.selectedPlan, "change", this.updateSelected);
                    this.updateSelected();
                }
            
            }
        } 
        else 
        {
            if (plan.get("startDate") == startDate) 
            {
                $("#" + model.get("finePlanUuid") + "-container").append(this.planTemplate(plan.toJSON()));
                
                if (window.selectedPlan.get("startDate") == 0) 
                {
                    window.selectedPlan.set({
                        finePlanUuid: undefined
                    });
                    window.selectedPlan.set(model.attributes);
                    //window.planManager = new PlanManager(window.selectedPlan);
                    this.listenTo(window.selectedPlan, "change", this.updateSelected);
                    this.updateSelected();
                }
            
            }
        }
    
    
    },
    addPlan: function(model) 
    {
        //var plan = new Plan(model.attributes);
        if (model.get("finePlanUuid") != undefined) 
        {
            this.addgeneratedCoarsePlan(model);
        } 
        else 
        {
            //$("#" + model.get("highLevelGoalType") + "-mobile").append(this.planTemplate(model.toJSON()));
            $("#" + model.get("highLevelGoalType")).append(this.planTemplate(model.toJSON()));
            if (window.selectedPlan.get("startDate") == 0) 
            {
                window.selectedPlan.set({
                    finePlanUuid: undefined
                });
                window.selectedPlan.set(model.attributes);
                //window.planManager = new PlanManager(window.selectedPlan);
                this.listenTo(window.selectedPlan, "change", this.updateSelected);
                this.updateSelected();
            }
        }
        
        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    },
    render: function() {
        this.$el.removeClass("hide");
        $(this.child).append(" <li class=\"collection-item center plansHeader\"><div>Selected client plans</div></li>");
        //$(this.mobileChild).append(" <li class=\"collection-item center plansHeader\"><div>Selected client plans</div></li>");
        this.delegateEvents();
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
    
    },
    createPlan: function(e) {
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
        var schedule = "DAY";  //$("#activity-schedule").val()
        //var nrOfSchedules = parseInt($("#nr-schedules").val());
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
                console.log("tempenddate : " + new Date(tempEndDate));
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
        
        
        var plan = new Plan({
            highLevelGoalType: $("#activity-goal").val(),
            dataType: type,
            endDate: endDate,
            inactivationDate: -1,
            lastUpdateDate: -1,
            schedule: $("#activity-schedule").val(),
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
        
        Materialize.toast('The plan has been successfully added !', 4000);
    },
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
            else 
            {
                if (window.window.selectedPlan.get("startDate") == 0) 
                {
                    Materialize.toast('Can not add this comment.  Add first new plans !', 4000);
                    return;
                }
            }
        
        }
        var text = $("#comment").val();
        var comment = new Comment();
        comment.set({
            author: window.selectedRelation.get("coachEmail"),
            message: text,
            read: false,
            targetId: window.selectedPlan.id,
            targetType: "PLAN",
            ts: new Date().getTime(),
            valence: 0
        });
        var comments = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + window.selectedRelation.get("clientEmail").replace(/\./g, '_') + "/comments/");
        comments.push(comment.attributes);
        Materialize.toast('The comment has been successfully sent !', 4000);
    
    }

});
