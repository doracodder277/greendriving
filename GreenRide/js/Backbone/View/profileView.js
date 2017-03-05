var UserProfileView = Backbone.View.extend({
    
    profileTemplate: "",
    el: "#user-profile-content",
    initialize: function() {
        this.hide();
        var self = this;
        this.profileTemplate = _.template($('#user-profile-template').html());
        _.bindAll(this, "hide", "saveProfile");
        $("#save-user-profile").click(this.saveProfile);
        $("#mobile-user-profile").click(function() 
        {
            self.loadProfile();
            $('#edit-user-profile').openModal();
        });
        $('.edit-user-profile-modal-trigger').leanModal({
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
        this.listenTo(window.coach, "change", this.loadProfile);
    },
    loadProfile: function() 
    {
        $("#name").val(window.coach.get("vorname"));
        $("#surname").val(window.coach.get("surname"));
        $("#nickname").val(window.coach.get("nickname"));
        $('.datepicker').pickadate({
            selectMonths: true,
            max: new Date(),
            format: 'dd.mm.yyyy',
            start: new Date(1988,9,9,0,0,0),
            // Creates a dropdown to control month
            selectYears: 90 // Creates a dropdown of 15 years to control year
        });
        $("#birthday-modal").pickadate("picker").set({
            "select": window.coach.get("birthday")
        });
        $("#user-gender").val(window.coach.get("gender"));
        $("#role").val(window.coach.get("role"));
        $("#user-imageURL").attr("src", window.coach.get("imageURL"));
    
    },
    hide: function() 
    {
        this.$el.empty();
        this.$el.addClass("hide");
        this.stopListening();
    },
    show: function() 
    {
        
        this.render();
    },
    edit: function(e) {
        e.preventDefault();
        var input = e.currentTarget.parentElement.children[1];
        input.focus();
        input.select();
    },
    render: function() {
        this.$el.removeClass("hide");
        this.$el.html(this.profileTemplate(window.coach.toJSON()));
        
        $('.datepicker').pickadate({
            selectMonths: true,
            max: new Date(),
            format: 'dd.mm.yyyy',
            start: new Date(1988,9,9,0,0,0),
            // Creates a dropdown to control month
            selectYears: 90 // Creates a dropdown of 15 years to control year
        });
        $("#birthday-modal").pickadate("picker").set({
            "select": window.coach.get("birthday")
        })
        $('select').material_select('destroy');
        $(".caret").remove();
        $('select').material_select();
        self = this;
    
    
    },
    updateImageURL: function() 
    {
        var url = $("#new-user-imageURL").val();
        if (url == "")
            return;
        window.coach.set({
            "imageURL": url
        });
    },
    saveProfile: function(e) {
        e.preventDefault();
        
        window.coach.set({
            "vorname": $("#name").val(),
            "surname": $("#surname").val(),
            "nickname": $("#nickname").val(),
            "gender": $("#user-gender").val(),
            "birthday": $("#birthday-modal").pickadate("picker").get("select").pick,
            "role": $("#role").val()
        });
        Materialize.toast('Changes has been successfully saved !', 4000);
        //this.delegateEvents();
    }
});
