var Log = Backbone.Model.extend({
    defaults: {
    
    },
    initialize: function(options) {
    
    }
});
window.fetchLog = function(clientEmail, type) 
{
    var LogCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + clientEmail.replace(/\./g, '_') + "/history/" + type + "/"),
        //.orderByKey().startAt((startTimestamp/100000).toString()).endAt((endTimestamp/100000).toString()),//.orderByChild(filterField).startAt(filterValue.toString()),
        // Reference to this collection's model.
        model: Log
    
    });
    
    return new LogCollection();
}
