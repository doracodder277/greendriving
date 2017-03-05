var Comment = Backbone.Model.extend({
    defaults: {
        author: "",
        message: "",
        read: false,
        targetId: "",
        targetType: "",
        ts: 0,
        valence: 0
    
    },
    initialize: function(options) {
    
    }
});

window.fetchPlanComments = function(email) 
{
    var PlanHistoryCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/comments/"),
        // Reference to this collection's model.
        model: Comment,
        initialize: function() {
        //this.sort_key = 'relationState';
        }//,
    });
    return new PlanHistoryCollection();
}
window.addComment = function(comment, email) 
{
    var plans = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "clients/" + email.replace(/\./g, '_') + "/comments/");
    plans.push(comment.attributes);
}
