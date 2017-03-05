var NavigationView = Backbone.View.extend({
    events: {
        "click #logout-button": "logout",
        "click #client-button": "renderClient",
        "click #user-profile-tab-navigation": "renderProfile"
    },
    el: "#navigation",
    initialize: function() {
        //window.resetAll();
        //window.coaches = new CoachCollection();
        $('#main').css('overflowY', 'auto');
        this.stopListening();
        $("#main").height($(document).height() - $("#navigation").height());
        window.onresize = function() {
            $("#main").height($(document).height() - $("#navigation").height());
        }
        
        //window.coach = null ;
        //window.fetchCoach();
        this.listenTo(window.coach, "change", this.render);
        _.bindAll(this, "render", "logout", "renderClient", "renderProfile");
        this.renderSideView();
        this.renderClient();
        this.render();
    
    },
    renderSideView: function() {
        if (window.sideView != undefined) 
        {
            window.sideView.initialize();
        } 
        else 
        {
            window.sideView = new UserSideView();
        }
    },
    render: function() {
        
        
        this.el.style.display = 'block';
        //window.coach =  window.coaches.byEmail(window.myFirebaseRef.getAuth().password.email);
        if (window.coach != undefined) 
        {
            $("#activeUserInfo").html(window.coach.get("vorname") + " " + window.coach.get("surname"));
            $(".user-name").html("Welcome, coach " + window.coach.get("surname") + " " + window.coach.get("vorname"));
            console.log(window.coach.get("vorname") + " " + window.coach.get("surname"));
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
        }
        
        document.getElementById("client-button").className = "navigationTab tabSelected";
        //new UserOverView();
    },
    renderProfile: function(e) {
        if (window.userNavigationView != undefined)
            window.userNavigationView.hide();
        if (window.profileView != undefined) 
        {
            window.profileView.initialize();
        } 
        else 
        {
            window.profileView = new UserProfileView();
        }
    },
    renderClient: function(e) {
        //window.userNavigationView.hide(); 
        document.getElementById("client-button").className = "navigationTab tabSelected";
        if (window.userNavigationView != undefined) 
        {
            
            window.userNavigationView.initialize();
            //window.userOverView.initialize();
        } 
        else {
            window.userNavigationView = new UserNavigationView();
            // window.userOverView  = new UserOverView(); 
        }
    },
    logout: function(e) {
        //this.stopListening();
        
        //window.userNavigationView.hide();
        //window.sideView.hide();
        //this.el.style.display = 'none';
        firebase.auth().signOut();
        location.reload();
        //document.getElementById("client-button").className = "navigationTab";
        //document.getElementById("user-profile-tab-navigation").className = "navigationTab";
        
        //window.loginView.initialize();
        //this.delegateEvents();
        //$('#main').removeAttr('style');
    
    }
});
