var AddMealView = Backbone.View.extend({
    
    el: "#main-page",
    
    ingredientTemplate: "",
    mealStatsTemplate: "",
    mealStatsTemplate: "",
    selectedIngredientID: "",
    ingredientsContainer: "",
    mealStatsContainer: "",
    selectedMeal: "",
    
    initialize: function() {
        
        this.ingredientTemplate = _.template($('#ingredient-template').html());
        this.mealStatsTemplate = _.template($("#meal-stats-template").html());
        this.ingredientsContainer = "#ingredients-container";
        this.mealStatsContainer = "#meal-nutrients-container";
        
        this.selectedMeal = new Meal();
        var self = this;
        
        $('.edit-meal-modal-trigger').leanModal({
            dismissible: true,
            // Modal can be dismissed by clicking outside of the modal
            opacity: .5,
            // Opacity of modal background
            in_duration: 300,
            // Transition in duration
            out_duration: 200,
            // Transition out duration
            //ready: function() { alert('Ready'); }, // Callback for Modal open
            complete: function() {
                self.updateImageURL();
            }// Callback for Modal close
        }
        );
        
        
        this.listenTo(this.selectedMeal, "mealUpdated", function() 
        {
            self.updateIngredientsView();
            self.updateMealStats();
            $('.collapsible').collapsible({
                accordion: true
            });
        }
        );
        
        $("#add-meal").click(function(e) {
            self.addMeal(e);
        }
        );
        
        $("#edit-amount-value").click(function(e) {
            self.addIngredient(e);
        }
        );
        
        this.bindAutocomplete("#ingredient-name", window.allItems);
    },
    updateImageURL: function(e) 
    {
        //e.preventDefault();
        var url = $("#new-meal-imageURL").val();
        if (url == "")
            return;
        this.selectedMeal.set({
            photoURI: url
        });
        $("#mealURL").attr("src", url);
    
    },
    addMeal: function(e) 
    {
        e.preventDefault();
        var self = this;
        var hash = "1";
        if (this.selectedMeal.get("ingredients").models.length == 0) 
        {
            Materialize.toast('Please add some ingredients!', 4000);
            return;
        }
        $.each(this.selectedMeal.get("ingredients").models, function(key, model) 
        {
            
            hash += "-" + model.get("amount") + "-" + model.get("foodUuid")
        }
        );
        var id = hash.replace(/\./g, '_');
        
        if (window.meals.get(id) != undefined) 
        {
            Materialize.toast('This meal alredy exists!', 4000);
            return;
        }
        
        var tags = {};
        $.each($(":checkbox"), function(key, model) 
        {
            if (model.checked) 
            {
                
                tags[model.id] = 1;
            }
        }
        );
        var meal = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "meals/" + id);
        meal.set({
            complete: "true",
            name: $("#new-meal-name").val(),
            tags: tags,
            photoURI: this.selectedMeal.get("photoURI"),
            scope: "e"
        });
        var facts = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "meal-facts/" + id);
        //var map = {};
        /*$.each(this.selectedMeal.mealStats.attributes, function(key, val) 
        {
            var index = window.enumMatcher[key];
            if (index != undefined)
                map[index] = val;
        }
        );*/
        facts.set(this.selectedMeal.mealStats.attributes);
        Materialize.toast('The meal has been successfully added!', 4000);
        this.stopListening(this.selectedMeal);
        this.selectedMeal = new Meal();
        this.listenTo(this.selectedMeal, "mealUpdated", function() 
        {
            self.updateIngredientsView();
            self.updateMealStats();
            $('.collapsible').collapsible({
                accordion: true
            });
        }
        );
        $("#new-meal-name").val("");
        $(this.ingredientsContainer).empty();
        $(this.mealStatsContainer).empty();
    
    },
    addIngredient: function(e) 
    {
        e.preventDefault();
        var self = this;
        
        var amount = parseFloat($("#amount-value").val());
        var ing = new Ingredient({
            amount: amount,
            foodUuid: this.selectedIngredientID
        });
        this.selectedMeal.get("ingredients").remove(this.selectedIngredientID);
        this.selectedMeal.get("ingredients").add(ing);
    
    },
    updateIngredientsView: function() 
    {
        var self = this;
        $(this.ingredientsContainer).empty();
        $.each(this.selectedMeal.get("ingredients").models, function(key, val) 
        {
            self.renderIngredient(val);
        }
        );
    },
    updateMealStats: function() 
    {
        $(this.mealStatsContainer).empty();
        var ingTemp = this.mealStatsTemplate({
            name: this.selectedMeal.get("name"),
            ingStats: this.selectedMeal.mealStats
        });
        
        $(this.mealStatsContainer).append(ingTemp);
    
    },
    renderIngredient: function(ing) 
    {
        var self = this;
        
        var ingTemp = this.ingredientTemplate({
            amount: ing.get("amount"),
            foodUuid: ing.get("foodUuid"),
            name: ing.food.get("name"),
            ingStats: ing.ingStats
        });
        
        $(this.ingredientsContainer).append(ingTemp);
        
        $("#del-" + ing.get("foodUuid")).click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            //remove from meal
            self.selectedMeal.get("ingredients").remove(e.toElement.id.split("-")[1]);
        }
        );
        
        $("#edi-" + ing.get("foodUuid")).click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.selectedIngredientID = e.currentTarget.id.split("-")[1];
            $('#edit-ingredient-amount-modal').openModal();
        }
        );
    },
    addIngredientToMeal: function(e) 
    {
        e.preventDefault();
        var self = this;
        $('#searchWrapper').empty();
        $('#searchWrapper').addClass("hide");
        $("#ingredient-name").val("");
        this.selectedIngredientID = e.currentTarget.parentElement.parentElement.id;
        $('#edit-ingredient-amount-modal').openModal();
    
    },
    bindAutocomplete: function(target, items) {
        var self = this;
        var me = this;
        $(target).autocomplete({
            minLength: 1,
            messages: {
                noResults: '',
                results: ""
            },
            open: function(event, ui) 
            {
                $('#searchWrapper').removeClass("hide");
                $(".addIngredient").click(function(e) {
                    self.addIngredientToMeal(e);
                }
                );
            },
            response: function(event, ui) {
                $('#searchWrapper').empty();
                $('#searchWrapper').addClass("hide");
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
                response(results.slice(0, 20));
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item) {
            
            //return $("<div class='autocompleteEntry stdWhite categoryColorDark"+ item.timeslot+ "' id='"+item.value+"' data-mealID='"+item.value+"'>"+item.label+"</div>")
            return $("<li id='" + item.value + "' class=\"collection-item\"><div>" + item.label.split("(")[0] + "<a href=\"#!\" class=\"addIngredient secondary-content\"><i class=\"material-icons\">add</i></a></div></li>")
            .appendTo($('#searchWrapper'));
        
        
        
        }
        ;
    }

});
