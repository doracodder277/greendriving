var LoginView = Backbone.View.extend({
    
    el: "#login-page",
    
    logintemplate: "",
    registertemplate: "",
    resetPasswordtemplate: "",
    loggedIn : false,
    rendered : true,
    initialize: function() {
        //this.hide();
        var self = this;
        this.registertemplate = _.template($('#register-template').html());
        this.resetPasswordtemplate = _.template($('#reset-password-template').html());
        this.logintemplate = _.template($('#login-template').html());


        var config = {
            apiKey: "AIzaSyBEW0rAOVfsv5ltczMr4JD7DQz1ko5CzZs",
            authDomain: "uhm-core-pro-v2.firebaseapp.com",
            databaseURL: "https://uhm-core-pro-v2.firebaseio.com",
            storageBucket: "uhm-core-pro-v2.appspot.com",
            messagingSenderId: "435005717337"
        };


        firebase.initializeApp(config);

        var storage = firebase.storage();

        var provider = new firebase.auth.EmailAuthProvider();
        firebase.auth().onAuthStateChanged(function(state)
        {
            var currentState = self.loggedIn;
            if(firebase.auth().currentUser != null)
                self.loggedIn = true;
            else
                self.loggedIn = false;

            if(currentState  == false && self.loggedIn == true )
            {
                self.render();
            }
        });
        window.myFirebaseRef = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "");

        var rootRef = firebase.database().ref();
        
        _.bindAll(this, "hide", "renderView", "login", "register", "resetPassword", "renderLoginView", "renderRegisterView", "renderResetPasswordView");
        
        this.render();
    
    
    },
    
    events: {
        
        "submit form.login-form": "login",
        "submit form.register-form": "register",
        "submit form.reset-password-form": "resetPassword",
        "click #login": "renderLoginView",
        "click #register": "renderRegisterView",
        "click #reset-password": "renderResetPasswordView"
    
    },
    
    hide: function() 
    {
        this.$el.empty();
    },
    
    renderView(template) 
    {
        this.$el.html(template);
    },
    
    login: function(e) {
        e.preventDefault();
        var self = this;
        var email = this.$("#email").val().toLowerCase();
        var password = this.$("#password").val();
        var loginMode = $("#remember-me").val() === "on" ? "default" : "sessionOnly";


        var auth = firebase.auth();
        var provider = new firebase.auth.EmailAuthProvider();


        auth.signInWithEmailAndPassword(email,password)
            .then(function(result)
                {
                    self.render();

                    /* if (window.navigationView != undefined)
                     {
                     window.navigationView.initialize();
                     }
                     else
                     {
                     window.navigationView = new NavigationView();
                     }*/
                })
            .catch(
           function(error)
               {
                   self.$(".login-form .error-message").html(_.escape(error)).show();
                   self.$(".login-form button").removeAttr("disabled");
                   if (error.message == "The specified password is incorrect.")
                   {
                       $("#password").removeClass("valid");
                       $("#password").addClass("invalid");
                   }
                   else if (error.message == "The specified user does not exist.")
                   {
                       $("#email").removeClass("valid");
                       $("#password").removeClass("valid");
                       $("#email").addClass("invalid");
                       $("#password").addClass("invalid");
                   }
               });

       /* window.myFirebaseRef.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
            if (error) {
                self.$(".login-form .error-message").html(_.escape(error)).show();
                self.$(".login-form button").removeAttr("disabled");
                if (error.message == "The specified password is incorrect.") 
                {
                    $("#password").removeClass("valid");
                    $("#password").addClass("invalid");
                } 
                else if (error.message == "The specified user does not exist.") 
                {
                    $("#email").removeClass("valid");
                    $("#password").removeClass("valid");
                    $("#email").addClass("invalid");
                    $("#password").addClass("invalid");
                }
            } else {
                //console.log("Authenticated successfully with payload:", authData);
                //self.undelegateEvents();
                self.render();
                
                /* if (window.navigationView != undefined) 
                {
                    window.navigationView.initialize();
                } 
                else 
                {
                    window.navigationView = new NavigationView();
                }
                
                //self.close();
            }
        }
        , 
        {
            remember: loginMode
        });*/
    },
    
    register: function(e) {
        e.preventDefault();
        
        var self = this;
        
        var username = this.$("#name").val();
        var usersurname = this.$("#surname").val();
        var usernickname = this.$("#nickname").val();
        var gender = this.$("#gender").val();
        var birthday = $("#birthday").pickadate("picker").get("select").pick;
        var role = this.$("#role").val();
        var email = this.$("#email").val().toLowerCase();
        var password = this.$("#password").val();
        var rpassword = this.$("#r-password").val();
        var imagURL = this.$("#imageURL").val();
        if (rpassword != password) 
        {
            self.$(".register-form .error-message").html(_.escape("passwords does not match.")).show();
            self.$(".register-form button").removeAttr("disabled");
            $("#r-password").removeClass("valid");
            $("#r-password").addClass("invalid");
            $("#password").removeClass("valid");
            $("#password").addClass("invalid");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (succes) {
                var ref = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "coaches/" + email.replace(/\./g, '_'));
                Materialize.toast(("Successfully created user account with email:" + email), 4000);
                ref.set({
                    surname: usersurname,
                    vorname: username,
                    id: email,
                    nickname: usernickname,
                    birthday: birthday,
                    email: email,
                    role: role,
                    gender: gender,
                    imageURL: imagURL
                });
                self.render();
            })
            .catch(function(error)
                {
                    self.$(".register-form .error-message").html(_.escape(error)).show();
                    self.$(".register-form button").removeAttr("disabled");
                });
        /*, function(error, userData) {
            if (error) {
                self.$(".register-form .error-message").html(_.escape(error)).show();
                self.$(".register-form button").removeAttr("disabled");
            } else {
                var ref = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "coaches/" + email.replace(/\./g, '_'));
                Materialize.toast(("Successfully created user account with email:" + email), 4000);
                ref.set({
                    surname: usersurname,
                    vorname: username,
                    id: email,
                    nickname: usernickname,
                    birthday: birthday,
                    email: email,
                    role: role,
                    gender: gender,
                    imageURL: imagURL
                });
                self.render();
            }
        }
        );*/
    },
    resetPassword: function(e) {
        e.preventDefault();
        var self = this;
        var email = this.$("#email").val();
        window.myFirebaseRef.resetPassword({
            email: email
        }, function(error) {
            if (error === null ) {
                self.renderView(self.logintemplate);
                Materialize.toast(("Temporary password has been sent to :" + email), 4000);
            } else {
                self.$(".reset-password-form .error-message").html(error).show();
            }
        }
        );
    },
    renderLoginView: function(e) 
    {
        e.preventDefault();
        this.renderView(this.logintemplate);
    },
    
    renderRegisterView: function(e) 
    {
        e.preventDefault();
        this.renderView(this.registertemplate);
        $('.datepicker').pickadate({
            selectMonths: true,
            max: new Date(),
            format: 'dd.mm.yyyy',
            // Creates a dropdown to control month
            selectYears: 90 // Creates a dropdown of 15 years to control year
        });
        $(".datepicker").pickadate("picker").set({
            "select": new Date(1990,1,1,0,0,0).getTime()
        });
        $('select').material_select('destroy');
        $(".caret").remove();
        $('select').material_select();
    },
    renderResetPasswordView: function(e) 
    {
        e.preventDefault();
        this.renderView(this.resetPasswordtemplate);
    },
    render: function() {
        if (firebase.auth() != null && firebase.auth().currentUser != null)
        {
            this.hide();
            if(this.rendered)
            {
                window.initViews();
                this.rendered = false;
            }
        }
        else 
        {
            this.renderView(this.logintemplate);
        
        }
    }
});
