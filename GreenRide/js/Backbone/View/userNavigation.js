var UserNavigationView = Backbone.View.extend({
    events: {
        "click #user-navigation li": "updateUserMenue",
        "click #client-navigation li": "updateClientMenue",
        "click #mobile-user-navigation li ": "updateMobileMenue",
        // "click .button-collapse": "initSideMenue",
        
        "click .relation": "userPress",
    },
    el: "#navigation-container",
    userNavigationTemplate: "",
    clientNavigationTemplate: "",
    activeClientMenue: "",
    activeUserMenue: "",
    activeMobileMenue: "",
    activeView: "",
    hide: function() 
    {
        $("#user-navigation-container").empty();
        $("#client-navigation-container").empty();
    },
    initialize: function() {
        var self = this;
        this.userNavigationTemplate = _.template($('#user-navigation-template').html());
        this.clientNavigationTemplate = _.template($('#client-navigation-template').html());
        this.activeUserMenue = "clients-overview";
        this.activeClientMenue = "client-overview";
        this.activeMobileMenue = "mobile-clients-overview";
        this.activeView = window.historyView;
        $('.menue-button-collapse').sideNav({
            edge: 'left',
            dismissible: true,
            // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
        );
        this.render();
        this.updateMobileHeader();
        //window.fetchCoach();
        this.listenToOnce(window.coach, "sync", this.updateMobileMenue);
        this.listenTo(window.coach, "change", this.updateMobileHeader);
        this.listenTo(window.selectedRelation, "change:clientEmail", this.updateClientData);
        $("#mobile-user-logout").click(this.logout);
        window.relationsView = new UserSideView();
        //window.plansView = new PlanSideView();
        $("#client-menue-container li ").click(function(e) 
        {
            self.updateMobileMenue(e);
        });
        
        $("#action-btn").removeClass("hide");
        //Dirty Hack
        var self = this;
        setTimeout(function() {
            self.initSideMenue()
        }
        , 1000);
    },
    updateMobileHeader: function() 
    {
        if (window.coach != undefined) 
        {
            $("#activeUserInfo").html(window.coach.get("vorname") + " " + window.coach.get("surname"));
            $(".user-name").html("Welcome, coach " + window.coach.get("surname") + " " + window.coach.get("vorname"));
            var role = "fitness and nutrition coach";
            if (window.coach.get("role") == "NUTRITION") 
            {
                role = "nutrition coach";
            } 
            else if (window.coach.get("role") == "FITNESS") 
            {
                role = "fitness coach";
            }
            $(".user-roal").html(role);
            var url = window.coach.get("imageURL") != "" ? window.coach.get("imageURL") : "images/profile.png";
            $(".responsive-img").attr({
                src: url
            });
        }
    },
    render: function() {
        $("#user-navigation-container").html(this.userNavigationTemplate);
        $("#client-navigation-container").html(this.clientNavigationTemplate);
        $('.button-collapse').sideNav({
            edge: 'left',
            dismissible: true,
            // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
        );
        //$("img.lazy").lazyload();
        this.updateUserMenue(this.activeUserMenue);
        this.updateClientMenue(this.activeClientMenue);
    
    
    },
    updateUserMenue: function(e) 
    {
        var id = e.currentTarget != undefined ? e.currentTarget.id : e;
        this.activeUserMenue = id;
        switch (id) {
        case "user-profile":
            //$("#client-navigation-container").addClass("hide");
            $("#user-navigation-container .active").removeClass("active");
            $("#user-profile").addClass("active");
            this.updateActiveView(window.userProfile);
            break;
        case "clients-overview":
            //$("#client-navigation-container").removeClass("hide");
            $("#user-navigation-container .active").removeClass("active");
            $("#clients-overview").addClass("active");
            this.updateClientMenue("client-overview");
            this.updateActiveView(window.historyView);
            break;
        case "clients-overview":
            //$("#client-navigation-container").removeClass("hide");
            $("#user-navigation-container .active").removeClass("active");
            $("#clients-overview").addClass("active");
            this.updateClientMenue("client-overview");
            this.updateActiveView(window.historyView);
            break;
        case "user-logout":

            firebase.auth().signOut();
            location.reload();
            /*window.relationsView.hide();
            window.userProfile.hide();
            window.plansView.hide();
            $(".fixed-action-btn").addClass("hide");
            this.hide();
            window.loginView = new LoginView();*/
            break;
        default:
            break
        }
    
    },
    updateClientMenue: function(e) 
    {
        
        var id = e.currentTarget != undefined ? e.currentTarget.id : e;
        this.activeClientMenue = id;
        $("#client-navigation-container .active").removeClass("active");
        $("#" + id).addClass("active");
        $("#user-navigation-container .active").removeClass("active");
        $("#clients-overview").addClass("active");
        if (id == "client-profile") 
        {
            this.updateActiveView(window.clientProfileView);
        } 
        else if (id == "client-plans") 
        {
            this.updateActiveView(window.planOverView);
        } 
        else if (id == "client-detailed-plans") 
        {
            this.updateActiveView(window.detailedPlanView);
        } 
        else if (id == "client-fine-plan") 
        {
            this.updateActiveView(window.finePlanView);
        }
        else 
        {
            this.updateActiveView(window.historyView);
        }
    
    },
    updateMobileMenue: function(e) 
    {
        //create relation modal
        if (window.coach.get("role") != "BOTH")
            $("#coachRole").remove();
        
        $('.menue-button-collapse').sideNav('hide');
        var id = e.currentTarget != undefined ? e.currentTarget.id : e;
        if (id == "mobile-clients-overview" && this.activeMobileMenue != "mobile-user-profile" && this.activeMobileMenue != "mobile-user-info" || id == "" || id == "mobile-clients-overview-switch")
            return;
        this.activeMobileMenue = id;
        
        //$("#mobile-user-navigation .active").removeClass("active");
        switch (id) {
        
        
        case "mobile-user-profile":
            //$("#mobile-clients-overview").children(".collapsible-body")[0].style.display = "none";
            //$("#mobile-user-navigation .active").removeClass("active");
            $("#mobile-user-navigation .active").removeClass("active");
            $("#relation-side-navigation-container").addClass("hide");
            this.updateActiveView(window.userProfile);
            
            break;
            /*case "mobile-user-info":
                    $("#relation-side-navigation-container").addClass("hide");
                    //$("#mobile-clients-overview").children(".collapsible-body")[0].style.display = "none";
                    $("#mobile-user-navigation .active").removeClass("active");
                    $("#mobile-client-overview .active").removeClass("active");
                    this.updateActiveView(window.infoView);

                    break; */
        case "mobile-clients-overview":
            //$("#mobile-clients-overview").children(".collapsible-body")[0].style.display = "block";
            $("#relation-side-navigation-container").removeClass("hide");
            $("#mobile-user-navigation .active").removeClass("active");
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-client-overview").addClass("active");
            this.updateActiveView(window.historyView);
            break;
        case "mobile-user-logout":
            firebase.auth().signOut();
            location.reload();
            break;
        
        case "mobile-client-profile":
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-clients-overview").addClass("active");
            this.updateActiveView(window.clientProfileView);
            
            break;
            case "mobile-meals-overview":
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-meals-overview").addClass("active");
            this.updateActiveView(window.mealsOverview);

            break;
        case "mobile-client-fine-plan":
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-clients-overview").addClass("active");
            this.updateActiveView(window.finePlanView);
            break;
        case "mobile-client-overview":
            //$("#mobile-clients-overview").children(".collapsible-body")[0].style.display = "block";
            $("#mobile-clients-overview .active").removeClass("active");
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-client-overview").addClass("active");
            this.updateActiveView(window.historyView);
            
            break;
        
        case "mobile-client-detailed-plans":
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-client-detailed-plans").addClass("active");
            this.updateActiveView(window.detailedPlanView);
            
            break;
        
        case "mobile-client-plans":
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-clients-overview").addClass("active");
            this.updateActiveView(window.planOverView);
            
            break;
        case "mobile-client-logs":
            $("#client-menue-container .active").removeClass("active");
            $("#mobile-clients-overview").addClass("active");
            this.updateActiveView(window.logsView);
            break;

        default:
            //$("#mobile-clients-overview").children(".collapsible-body")[0].style.display = "block";
            $("#mobile-user-navigation .active").removeClass("active");
            $("#mobile-client-overview").addClass("active");
            this.updateActiveView(window.historyView);
            break;
        }
        if (id.attributes == undefined)
            $("#" + id).addClass("active");
    },
    logout: function() 
    {
        firebase.auth().signOut();
        location.reload();
    },
    updateActiveView: function(view) 
    {
        this.activeView.hide()
        this.activeView = view;
        this.activeView.show();
        $(".drag-target").remove();
    },
    initSideMenue: function() 
    {
        //$("#mobile-clients-overview").children(".collapsible-body")[0].style.display = "block";
        $("#mobile-user-navigation .active").removeClass("active");
        $("#mobile-client-overview").addClass("active");
        $("#mobile-clients-overview").addClass("active");
    },
    userPress: function(e) {
        window.relationsView.userPress(e);
    },
    updateClientData: function() {
        
        if (window.selectedRelation.get("relationState") == -1) 
        {
            
            window.infoView.show();
        } 
        else 
        {
            window.infoView.hide();
        }
        
        $("#navigation-client-name").html("Selected client > " + window.selectedRelation.get("clientNickname"));
        /*if(window.selectedRelation.get("relationState") == 0)
        {
            this.activeView.hide();
        }
        else
        {
             this.activeView.show();
        }*/
    }
});
/* updateMobileMenue : function(e)
    {
        e.preventDefault();
        if(e.currentTarget.id == "mobile-client-profile" || e.currentTarget.id == "mobile-client-logout")
        {
            console.log(e.currentTarget.id);
            $("#mobile-user-navigation .active").removeClass("active");
             $("#mobile-client-overview").children(".collapsible-body")[0].style.display =  "none"; 
            $(e.currentTarget).addClass("active");
        }
         else if(e.currentTarget.id == "mobile-client-overview")
        {
            $("#mobile-client-profile").removeClass("active");
            $("#mobile-client-logout").removeClass("active");
            $(e.currentTarget).addClass("active");
             if($("#mobile-client-overview .active").length == 1)
             {
                 $($("#mobile-client-overview li")[0]).addClass("active")
             }
            
        }
        else if(e.currentTarget.id == "mobile-user-overview" ||  e.currentTarget.id == "mobile-user-profile" || e.currentTarget.id == "mobile-user-plans")
        {
             $($("#mobile-client-overview .active")[1]).removeClass("active");
             $(e.currentTarget).addClass("active");
        }
    },     */