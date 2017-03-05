var InfoView = Backbone.View.extend({
    events: {
    
    },
    profileTemplate: "",
    container: "#info-page",
    initialize: function() {
        var self = this;
        this.show();
        $("#logo").on("click", function() 
        {
            $("#mobile-clients-overview-switch").trigger("click");
        });
        //   this.listenTo(window.selectedRelation, "change : clientEmail", this.updateView);
    },
    hide: function() 
    {
        $(this.container).addClass("hide");
        //window.navigationView.activeView.show();
    },
    show: function() 
    {
        
        window.navigationView.activeView.hide();
        $(this.container).removeClass("hide");
    },
    /* updateView : function()
    {
        console.log(window.selectedRelation.get("relationState"));
        if(window.selectedRelation.get("clientEmail") != ""  && window.selectedRelation.get("relationState") == 1)
        {
            console.log("hideee");
            this.hide();
            window.navigationView.updateActiveView(window.historyView);

        }
        else
        {
            this.show();
        }
    }        */
});
