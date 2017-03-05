/**
 * Created by nizar on 12.10.2016.
 */

var AddFilterView = Backbone.View.extend({

    el:"#add-filter-modal",
    minContainer:"#filter-min",
    maxContainer:"#filter-max",
    filterTypeContainer:"#filter-type",
    filterTargetContainer : "#filter-target-type",
    filterParentContainer : "#filter-parent-type",
    filterRangeContainer : "#filter-range",
    filterCategoryContainer : "#filter-category",
    initialize: function() {

        var self = this
        this.filter = new MealFilter({"type": FilterType.PERCENTATGE});
        this.updateFilterType(FilterType.PERCENTATGE);


        //init Listeners

        $('select').on('contentChanged', function() {
                // re-initialize (update)
                if (this.id == "filter-target-type")
                {
                    $('select').material_select('destroy');
                    $(".caret").remove();
                    $('select').material_select();
                }

            }
        );
        //Filter Type change
        $(this.filterTypeContainer).on("change",function()
        {
            self.updateFilterType($(self.filterTypeContainer).val());
        });

        //Filter Target change
        $(this.filterTargetContainer).on("change",function()
        {
            self.updateTargetType($(self.filterTargetContainer).val());
        });

        //Filter Parent change
        $("#filter-parent-type").on("change",function()
        {
            self.updateParentType($("#filter-parent-type").val());
        });
        //Category Parent change
        $("#filter-category").on("change",function()
        {
            self.updateFilterCategory($("#filter-category").val());
        });

        $("#save-new-filter").on("click", function () {
            self.saveFilter();
        });

        this.render();




        //Filter save

    },
    updateFilterCategory : function (cat) {
        this.filter.set({category : cat});
    },
    saveFilter : function()
    {
        if(this.validateFilter())
        {
            var temp = new MealFilter(this.filter.attributes);
            //.id = new Date().getTime();
            //window.myFilters.push(temp);

            var filters = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "coaches/" + firebase.auth().currentUser.email.replace(/\./g, '_') + "/filters/");
            filters.push(temp.attributes);

            $("#add-filter-modal").closeModal();
        }
    },
    refreshSelect : function () {
        $('select').material_select('destroy');
        $(".caret").remove();
        $('select').material_select();
    },
    render : function () {
        $("#add-filter-modal").openModal();
    },
    initTargetOptions:function () {

        var select = $(this.filterTargetContainer)[0];
        $(select).empty();
        var opt = document.createElement('option');
        opt.value = "choose";
        opt.disabled = true;
        opt.selected = true;
        opt.innerHTML = "Choose filter target :";
        select.appendChild(opt);
        if(this.filter.get("type") == FilterType.AMOUNT)
        {
            var opt = document.createElement('option');
            var value = window.enums.NutritionCategories["GCAL"];
            opt.value = "GCAL";
            opt.innerHTML = value.nutrientName;
            select.appendChild(opt);
        }

        for (var key in nutrientStruct){
            var value = window.enums.NutritionCategories[key];
            var opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = value.nutrientName;
            select.appendChild(opt);
        }

        this.refreshSelect();
    },
    findParentNodes : function () {

        return getParents(nutrientStruct, this.filter.get("target"));
    },
    validateFilter : function () {

        if(this.filter.get("type") == FilterType.CATEGORY)
        {
            if(this.filter.get("category") == "")
            {
                Materialize.toast('Please select a category!', 4000);
                return false;
            }

        }
        else  if(this.filter.get("type") == FilterType.AMOUNT )
        {
            if(this.filter.get("target") == "")
            {
                Materialize.toast('Please select a target type!', 4000);
                return false;
            }
        }
        else  if(this.filter.get("type") == FilterType.PERCENTATGE )
        {
            if(this.filter.get("target") == "")
            {
                Materialize.toast('Please select a target type!', 4000);
                return false;
            }
            else if(this.filter.get("parent") == "")
            {
                Materialize.toast('Please select a parent type!', 4000);
                return false;
            }
        }
        return true;
    },
    initParentOptions : function () {

        var parents = this.findParentNodes();

        var select = $(this.filterParentContainer)[0];
        $(select).empty();
        var opt = document.createElement('option');
        opt.value = "choose";
        opt.disabled = true;
        opt.selected = true;
        opt.innerHTML = "Choose parent type :";

        select.appendChild(opt);
        var opt = document.createElement('option');
        opt.value = "TMS";
        opt.id = "TMS";
        opt.innerHTML = "Total mass";
        select.appendChild(opt);

        for (var key of parents){
            var value = window.enums.NutritionCategories[key];
            var opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = value.nutrientName;
            select.appendChild(opt);
        }
        this.refreshSelect();
    },
    updateParentType : function (val) {
        this.filter.set({parent : val});
        this.renderRangeBar(val);
        this.showElement($(this.filterRangeContainer).parent());
    },
    updateTargetType : function (val) {
        this.filter.set({target : val});
        if(this.filter.get("type") == FilterType.PERCENTATGE)
        {
            this.showElement($(this.filterParentContainer).parent().parent());
            this.initParentOptions();

        }
        if(this.filter.get("type") == FilterType.AMOUNT)
        {
            this.showElement($(this.filterRangeContainer).parent());
            this.renderRangeBar(val);

        }
        else if(this.filter.get("type") == FilterType.CATEGORY)
        {
            return;
        }



    },
    hideAll : function () {

        $(this.filterCategoryContainer).parent().parent().addClass("hide");
        $(this.filterTargetContainer).parent().parent().addClass("hide");
        $(this.filterParentContainer).parent().parent().addClass("hide");
        $(this.filterRangeContainer).parent().addClass("hide");

    },
    showElement : function (element) {
        element.removeClass("hide");
    },
    updateOptions: function () {

        console.log("update options");
        this.hideAll() ;

        if(this.filter.get("type") == FilterType.PERCENTATGE)
        {

            this.showElement($(this.filterTargetContainer).parent().parent());

        }
        else if(this.filter.get("type") == FilterType.AMOUNT)
        {
            this.showElement($(this.filterTargetContainer).parent().parent());
        }
        else if(this.filter.get("type") == FilterType.CATEGORY)
        {
            this.showElement($(this.filterCategoryContainer).parent().parent());
            return;
        }

        this.initTargetOptions();

    },
    updateFilterType : function (value) {
        var self = this;
        this.filter.set({type : value});
        this.updateOptions();
    },
    updateRangeValues : function (values) {
        this.filter.set({min : values[0]});
        this.filter.set({max : values[1]});
        $(this.minContainer).html("min : " + values[0]);
        $(this.maxContainer).html("max : " + values[1]);
    },
    renderRangeBar : function (key) {
        var self = this;
        var max = 100;
        var min = 0;

        this.newFilter = $(this.filterRangeContainer)[0];
        if(this.newFilter.noUiSlider != undefined)
            this.newFilter.noUiSlider.destroy();
        if(this.filter.get("type") == FilterType.AMOUNT)
        {
            max = window.mealsMaxStats[key] == undefined ? 100 : window.mealsMaxStats[key];
            min = window.mealsMinStats[key] == undefined ? 100 : window.mealsMinStats[key];
        }
        noUiSlider.create(this.newFilter, {
            start: [min, max],
            connect: true,
            range: {
                'min': min,
                'max': max
            }
        });
        this.newFilter.noUiSlider.on('update', function( values, handle ) {
            self.updateRangeValues(values);
        });
    }

});
