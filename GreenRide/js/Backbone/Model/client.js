window.fetchClient = function(email) 
{
    console.log("fetch client with email : " + email)
    var Client = Backbone.Firebase.Model.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/profile"),
        defaults: {
            nickname: '',
            gender: '',
            birthDate: '',
            heightInCM: '',
            weightInKG: '',
            imageURL: "images/expert.png"
        
        },
        initialize: function() {
        
        }
    });
    
    return new Client();
}


window.createClient = function(vorname, surname, nickname, email, height, weight, gender, birthday, his) 
{
    var r = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/profile");
    // var client = new Client();
    // client.set({vorname :vorname,surname : surname,nickname : nickname,email:email,height : height,weight : weight,gender:gender,birthday:birthday});:
    r.set({
        vorname: vorname,
        surname: surname,
        nickname: nickname,
        email: email,
        height: height,
        weight: weight,
        gender: gender,
        birthday: birthday,
        history: {
            nutrition: [],
            fitness: []
        }
    });
}
