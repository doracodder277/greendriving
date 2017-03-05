var ClientProfileView = Backbone.View.extend({
    events: {
        "click #save-profile": "saveProfile"
    },
    el: "#client-profile-content",
    profileTemplate: "",
    initialize: function() {
        this.hide();
        this.profileTemplate = _.template($('#client-profile-template').html());
    
    },
    hide: function() 
    {
        this.$el.addClass("hide");
        this.stopListening();
    },
    show: function() 
    {
        this.listenTo(window.selectedRelation, "change:clientEmail", this.updateClient);
        this.updateClient();
    },
    updateClient: function() 
    {
        if (window.selectedRelation.get("relationState") != -1) 
        {
            if (window.selectedRelation.get("relationState") == 0) 
            {
                this.render();
            } 
            else 
            {
                window.selectedClient = window.fetchClient(window.selectedRelation.get("clientEmail"));
                this.listenTo(window.selectedClient, "change", this.render);
                this.render();
            }
        } 
        else 
        {
            //Module
            this.hide();
        }
    },
    render: function() {


        console.log("init client profile")
        if (window.selectedRelation != null ) 
        {
            if (window.selectedRelation.get("relationState") == 0) 
            {
                $("#client-empty").html("User did not accepted the invitation yet!");
            } 
            else 
            {
                self = this;
                this.$el.removeClass("hide");
                this.$el.html(this.profileTemplate(window.selectedClient.toJSON()));
                $('.datepicker').pickadate({
                    selectMonths: true,
                    max: new Date(),
                    format: 'dd.mm.yyyy',
                    start: new Date(1988,9,9,0,0,0),
                    // Creates a dropdown to control month
                    selectYears: 90 // Creates a dropdown of 15 years to control year
                });
                $("#client-birthday").pickadate("picker").set({
                    "select": window.selectedClient.get("birthDate")
                });
                $('select').material_select('destroy');
                $(".caret").remove();
                $('select').material_select();
                $('.edit-profile-modal-trigger').leanModal({
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
            }
        } 
        else 
        {
            $("#client-empty").html("Please invite new clients!");
        }
    },
    updateImageURL: function(e) 
    {
        //e.preventDefault();
        var url = $("#new-imageURL").val();
        if (url == "")
            return;
        window.selectedClient.set({
            "imageURL": $("#new-imageURL").val()
        });
        window.coachRelations.get(window.selectedRelation.id).set({
            imageURL: $("#new-imageURL").val()
        });
    
    },
    saveProfile: function(e) {
        e.preventDefault();
        window.selectedClient.set({
            nickname: this.$("#name").val(),
            gender: this.$("#gender").val(),
            birthDate: $("#client-birthday").val() == ""? new Date().getTime()  : $("#client-birthday").pickadate("picker").get("select").pick,
            heightInCM : !isNaN( parseFloat(this.$("#height").val())) ? parseFloat(this.$("#height").val()) : 0 ,
            weightInKG : !isNaN( parseFloat(this.$("#weight").val())) ? parseFloat(this.$("#weight").val()) : 0
        });
        var fullname = this.$("#name").val().split(" ");
        window.coachRelations.get(window.selectedRelation.id).set({
            clientNickname: this.$("#name").val()
        });
        Materialize.toast('Changes has been successfully saved !', 4000);
        this.delegateEvents();
    }

});
