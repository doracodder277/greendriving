var ResetPassword = Backbone.View.extend({
    
    el: "#login-page",
    events: {
        "click #pass-change": "resetPassword",
    },
    initialize: function() {
    },
    resetPassword: function() 
    {
        
        var email = $("#email").val();
        var temppass = $("#password_t").val();
        var newpass = $("#password_n").val();
        var newpassr = $("#password_r").val();
        if (email == "") 
        {
            $("#email").addClass("invalid");
            $(".error-message").html("Please set your email adress.");
            return false;
        }
        if (temppass == "") 
        {
            $("#password_t").addClass("invalid");
            $(".error-message").html("Please set your temporary password.");
            return false;
        }
        if (newpass != newpassr) 
        {
            $("#password_r").addClass("invalid");
            $(".error-message").html("The specified new passwords does not match.");
            return false;
        }
        if (newpass == "") 
        {
            $("#password_n").addClass("invalid");
            $(".error-message").html("Please set a new password .");
            return false;
        }
        var ref = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "");
        ref.changePassword({
            email: email,
            oldPassword: temppass,
            newPassword: newpass
        }, function(error) {
            if (error) {
                switch (error.code) {
                case "INVALID_PASSWORD":
                    console.log("The specified user account password is incorrect.");
                    $("#password_t").addClass("invalid");
                    $(".error-message").html("The specified user account temporary password is incorrect.");
                    break;
                case "INVALID_USER":
                    $("#email").addClass("invalid");
                    $(".error-message").html("The specified user account does not exist.");
                    break;
                default:
                    console.log("Error changing password:", error);
                    $(".error-message").html("Error changing password:" + error);
                    return false;
                }
            } else {
                Materialize.toast('Password has been successfully set!', 2000);
                setTimeout(function() {
                    window.location.replace("http://www.smart-health-assistant.de:4440/testing/ESA_V1.3/");
                }, 3000)
            }
        
        });
    
    }

});

var resetpassView = new ResetPassword();
