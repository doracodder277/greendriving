var HistoryView = Backbone.View.extend({
    events: {
        "click #increment-date": "incrementDate",
        "click #decrement-date": "decrementDate",
        "click #scope-date": "changeDateScope"
    },
    el: "#history-content",
    historyDateSelect: "#history-selector",
    historyContainer: "#history-element-container",
    historySelectorTemplate: "",
    historyTemplate: "",
    historyElementTemplate: "",
    initialize: function() {
        //this.listenTo(window.selectedRelation, "change", this.updateClient);
        //this.updateClient();
        //this.historyElementTemplate = _.template($('#relation-side-template').html());
        this.historySelectorTemplate = _.template($('#history-selector-template').html());
        this.historyTemplate = _.template($('#history-template').html());
        this.historyElementTemplate = _.template($('#history-element-template').html());
        
        _.bindAll(this, "hide", "incrementDate", "updateData", "decrementDate", "updateData", "renderDateSelector", "changeDateScope", "renderCharts", "render");
    },
    hide: function() 
    {
        this.$el.addClass("hide");
        $(this.historyDateSelect).addClass("hide");
        this.stopListening();
    },
    show: function() 
    {
        this.hide();
        this.listenTo(window.selectedRelation, "change ", this.updateClientHistory);
        this.listenTo(window.timeManager, "change : timeResolution", this.updateClientHistory);
        this.listenTo(window.timeManager, "change : startTimeStamp", this.updateData());

        this.updateClientHistory();
        this.render();
        if (window.selectedRelation != undefined && window.selectedRelation.get("clientEmail") != "" && window.selectedRelation.get("relationState") == 1) 
        {
            this.renderDateSelector();
            this.renderCharts();
        }
    },
    updateClientHistory: function() 
    {
        
        if (window.selectedRelation != undefined && window.selectedRelation.get("clientEmail") != "" && window.selectedRelation.get("relationState") == 1) 
        {
            this.renderDateSelector();
            this.$el.removeClass("hide");
            //this.stopListening(window.clientHistory);
            if(window.timeManager.get("timeResolution") == timeResolotionClass.Day )
            {
                window.clientGlobalHistory = window.clientData.get("HOURHISTORY");
                if(window.clientData.get("HOURHISTORY_sync"))
                {
                    this.updateData();
                }
            }
            else {
                window.clientGlobalHistory = window.clientData.get("DAYHISTORY");//window.fetchClientHistory(window.selectedRelation.get("clientEmail"), "d/t", window.timeManager.get("startTimeStamp"), window.timeManager.get("endTimeStamp"));
                if(window.clientData.get("DAYHISTORY_sync"))
                {
                    this.updateData();
                }
            }
            this.listenTo(window.clientGlobalHistory, "sync", this.updateData);
        } 
        else 
        {
            this.$el.addClass("hide");
            if (window.selectedRelation == undefined || window.selectedRelation.get("clientEmail") == "") 
            {
            //Materialize.toast('Please invite new cients !', 4000);
            } 
            else if (window.selectedRelation.get("relationState") == 0) 
            {
            //Materialize.toast('The client did not yet accepted your invitation !', 4000);
            }
        }
    },
    renderCharts: function() 
    {
        $("#start-date").pickadate("picker").set({
            "select": window.currentDate
        });
        if (window.selectedRelation != null ) 
        {
            if (window.selectedRelation.get("relationState") == 1) 
            {
                $(this.historyContainer).empty();
                //template = _.template($('#hitory-chart-template').html());
                //window.googleCharts = window.googleCharts == null ? [] : window.googleCharts;
                for (var i = 0; i < window.myOverviewCharts.length; i++) {
                    var name = window.myOverviewCharts[i].name;
                    if ($("#" + name).length == 0) 
                    {
                        $(this.historyContainer).append(this.historyElementTemplate({
                            name: name
                        }));
                    }
                    window.drawGoogleCharts(name, window.myOverviewCharts[i]);
                }
                
                
                /*setTimeout(function() {
                    var name = window.myOverviewCharts[0].name;
                    var data = window.myOverviewCharts[0];
                    
                    window.drawGoogleCharts(name, data);
                
                }
                , 500);
                setTimeout(function() {
                    var name = window.myOverviewCharts[1].name;
                    var data = window.myOverviewCharts[1];
                    
                    window.drawGoogleCharts(name, data);
                
                }
                , 1000);
                setTimeout(function() {
                    var name = window.myOverviewCharts[2].name;
                    var data = window.myOverviewCharts[2];
                    
                    window.drawGoogleCharts(name, data);
                
                }
                , 1500);
                setTimeout(function() {
                    var name = window.myOverviewCharts[3].name;
                    var data = window.myOverviewCharts[3];
                    
                    window.drawGoogleCharts(name, data);
                
                }
                , 2000);
                setTimeout(function() {
                    var name = window.myOverviewCharts[4].name;
                    var data = window.myOverviewCharts[4];
                    
                    window.drawGoogleCharts(name, data);
                
                }
                , 2500);  */
            
            }
        
        }
    
    },
    updateData: function() {

        if(window.clientGlobalHistory == undefined) return;
        window.clientHistory = new HistoryCollection();
        $.each(window.clientGlobalHistory.models, function(k, v)
            {
                var date = parseFloat(v.get("id")) * 100000;
                if(window.timeManager.get("timeResolution") == timeResolotionClass.Day ) date = parseFloat(v.get("id")) ;
                if (date >= window.timeManager.get("startTimeStamp") && date <= window.timeManager.get("endTimeStamp"))
                {
                    window.clientHistory.add(new History(v.attributes));
                }
            }
        );

       console.log("update data");
        window.initMyChart();
        window.initMyChartDataFromHistory();
        this.renderCharts();

    },
    incrementDate: function() 
    {
        window.timeManager.incrementOne();
    },
    decrementDate: function() 
    {
        window.timeManager.decrementOne();
    
    },
    changeDateScope: function() 
    {
        window.timeManager.changeDataScope();
        window.timeManager.set({
            startTimeStamp: window.currentDate
        });
        this.renderDateSelector();
    },
    renderDateSelector: function() 
    {
        $(this.historyDateSelect).empty();
        $(this.historyDateSelect).append(this.historySelectorTemplate);
        $('#start-date').pickadate({
            selectMonths: true,
            max: new Date(),
            format: 'dd.mm.yyyy',
            start: new Date(1988,9,9,0,0,0),
            // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
        $("#start-date").pickadate("picker").set({
            "select": window.currentDate
        });
        $("#start-date").pickadate("picker").on({
            close: function() {
                window.currentDate = $("#start-date").pickadate("picker").get("select").pick;
                window.timeManager.set({
                    startTimeStamp: window.currentDate
                });
            }
        });
    },
    
    render: function() {
        this.$el.removeClass("hide");
        this.$el.html(this.historyTemplate());
        $('select').material_select('destroy');
        $(".caret").remove();
        $('select').material_select();
        $('#selected-start-date').pickadate({
            selectMonths: true,
            max: new Date(),
            format: 'dd.mm.yyyy',
            start: new Date(1988,9,9,0,0,0),
            // Creates a dropdown to control month
            selectYears: 15,
            // Creates a dropdown of 15 years to control year
        });
        /* if (this.isActive) 
        {
            if (window.selectedRelation != null ) 
            {
                if (window.selectedRelation.get("relationState") == 0) 
                {
                    $("#client-empty").html("User did not accepted the invitation yet!");
                } 
                else 
                {
                    
                    template = _.template($('#client-profile-template').html());
                    this.$el.html(template(window.selectedClient.toJSON()));
                }
            } 
            else 
            {
                   $("#client-empty").html("Please invite new clients!");
            }
        }*/
    }

});
