var History = Backbone.Model.extend({
    defaults: {
    },
    initialize: function() {
    
    }
});
var HistoryCollection = Backbone.Collection.extend({
    // url :  new  Firebase("https://intense-heat-7567.firebaseio.com/clients/"+clientEmail.replace(/\./g, '_')+"/history/"+scope+"/"),//.orderByKey().startAt((startTimestamp/100000).toString()).endAt((endTimestamp/100000).toString()),//.orderByChild(filterField).startAt(filterValue.toString()),
    // Reference to this collection's model.
    model: History

});

window.fetchClientHistory = function(clientEmail, scope, startTimestamp, endTimestamp) 
{
    var MyHistoryCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + clientEmail.replace(/\./g, '_') + "/history/" + scope + "/"),
        //.orderByKey().startAt((startTimestamp/100000).toString()).endAt((endTimestamp/100000).toString()),//.orderByChild(filterField).startAt(filterValue.toString()),
        // Reference to this collection's model.
        model: History
    
    });
    
    return new MyHistoryCollection();
}
