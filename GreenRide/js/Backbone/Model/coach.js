window.fetchCoach = function() 
{
    var Coach = Backbone.Firebase.Model.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "coaches/" + firebase.auth().currentUser.email.replace(/\./g, '_')),
        defaults: {
            surname: '',
            vorname: '',
            nickname: '',
            gender: '',
            birthday: '',
            email: '',
            role: '',
            imageURL: "/images/profile.png"
        },
        initialize: function() {
        
        }
    });
    window.fetchCoachFilters();
    window.coach = new Coach();
}

