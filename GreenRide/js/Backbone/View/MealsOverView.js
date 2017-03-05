/**
 * Created by nizar on 10.10.2016.
 */
var MealOverview = Backbone.View.extend({

    mealTemplate: "",
    mealsContainer:"",
    searchFilterContainer:"",
    filterTemplate : "",
    el: "#meals-overview",
    initialize: function() {
        var self = this;
        this.hide();
        var self = this;
        this.mealTemplate =  _.template($('#overview-meal-template').html());
        this.mealsContainer = "#meals-container";
        this.searchFilterContainer = "#meal-settings-tags";
        this.filterTemplate = _.template($('#filter-template').html());
        //_.bindAll(this, "hide", "saveProfile");
        $("#meal-search-button").click(this.saveProfile);
        this.hide();
        window.myFilters.fetch();
        this.bindAutocomplete("#meal-name-search", window.allMeals);
        window.activefilters = {};
        this.initSearchFilters();

        $("#add-filter").on("click", function () {
            if(self.filterView == undefined)
                self.filterView = new AddFilterView();
            else
                self.filterView.render();
        });
        $("#save-settings").on("click", function () {
           self.updateView();
        });

        this.listenTo(window.myFilters, "update add remove" , this.initSearchFilters);
    },
    renderMealStats :function (mealID) {
        $("#day-stats").openModal();

        new SunBurstChart(struct, window.meals.get(mealID).mealStats.attributes);
    },
    initSearchFilters : function () {

        $(this.searchFilterContainer).empty();
        for(var t of window.myFilters.models)
            {
                var filter = t.attributes;
                filter.id = t.id;
                $(this.searchFilterContainer).append(this.filterTemplate(filter));
            }
        $(".remove-filter").on("click", function (e) {
            var att = e.currentTarget.id.split("-")[0];
            var val = e.currentTarget.id.split("-")[1];
            var modelToRemove = window.myFilters.findWhere(att , val);
            //modelToRemove.destroy();
            console.log(modelToRemove.id);
            var filter = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "coaches/" + firebase.auth().currentUser.email.replace(/\./g, '_') + "/filters/"+ modelToRemove.id);
            filter.set({});
        });
        this.updateView();

    },
    updateView : function()
    {
        $(this.mealsContainer).empty();
        this.renderMeals();
    },
    renderMeals : function()
    {
        var self = this;
        if(window.meals == undefined) return;
        $.each(window.meals.models, function(k, v)
            {
                if (v.get("scope") == "e")
                    self.renderMeal(v);
            }
        );
        $(".meal-stats").on('click',
            function(e){
                self.renderMealStats(e.currentTarget.attributes["data-mealid"].value);
            })
    },
    renderMeal :function (v) {
        if(! this.isActiveMeal(v.mealStats.attributes, v)) return;
        var map = v.attributes;
        map["authorId"] = window.selectedRelation.get("coachEmail");
        map["stats"] = v.mealStats.attributes;
        $(this.mealsContainer).append(this.mealTemplate(map));
    },
    isActiveMeal : function (attributes, model) {
        var accepted = true;
        for(var filter of window.myFilters.models)
        {
            if(filter.get("type") == FilterType.AMOUNT)
            {
                var targetValue = attributes[filter.get("target")];
                if(!(targetValue >= filter.get("min") && targetValue <= filter.get("max")))
                {
                    accepted = false;
                }

            }
            else if(filter.get("type") == FilterType.PERCENTATGE)
            {

                var targetValue = attributes[filter.get("target")];
                var parentValue = attributes[filter.get("parent")];
                var percent = targetValue/parentValue * 100;
                if(!(percent >= filter.get("min") && percent <= filter.get("max")))
                {
                    accepted = false;
                }

            }
            else if(filter.get("type") == FilterType.CATEGORY)
            {
                var tags = model.attributes["tags"];
                var targetTag = filter.get("category");

                if(tags == undefined || tags[targetTag] == undefined)
                {
                    accepted = false;
                }
            }
        }
        return accepted;
    },
    addMealToview : function()
    {

    },
    updateSelectedMealStats : function()
    {

    },
    hide: function()
    {
        $(this.mealsContainer).empty();
        this.$el.addClass("hide");
        this.stopListening();
    },
    show: function()
    {
        this.listenTo(window.myFilters, "update add remove" , this.initSearchFilters);
        this.render();
    },

    render: function() {
        this.$el.removeClass("hide");
        this.updateView();
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
                //$('#plan-meals-container').removeClass("hide");

            },
            response: function(event, ui) {
                //$('#plan-meals-container').empty();
                //$('#plan-meals-container').addClass("hide");
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
                $(self.mealsContainer).empty();
                $.each(results, function(k, v)
                    {
                        self.renderMeal(window.meals.get(v.value));
                    }
                );
                $(".meal-stats").on('click',
                    function(e){
                        self.renderMealStats(e.currentTarget.attributes["data-mealid"].value);
                    })

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
