var CoachingRelation = Backbone.Model.extend({
    defaults: {
        relationState: -1,
        coachEmail: '',
        clientEmail: '',
        relationType: '',
        startDate: 0,
        clientNickname: ""
    },
    initialize: function() {
    
    }
});
window.fetchCoachRelations = function() 
{
    
    var CoachingRelationCollection = Backbone.Firebase.Collection.extend({
        url: new Firebase("https://" + window.subpath + ".firebaseio.com/" + "relations/").orderByChild("coachEmail").equalTo(firebase.auth().currentUser.email),
        // Reference to this collection's model.
        model: CoachingRelation,
        initialize: function() {
            this.sort_key = 'relationState';
        },
        comparator: function(a, b) {
            // Assuming that the sort_key values can be compared with '>' and '<',
            // modifying this to account for extra processing on the sort_key model
            // attributes is fairly straight forward.
            a = a.get(this.sort_key);
            b = b.get(this.sort_key);
            return a < b ? 1 
            : a > b ? -1 
            : 0;
        },
        sort_by_state: function() {
            this.sort_key = 'relationState';
            this.sort();
        }
    });
    
    window.coachRelations = new CoachingRelationCollection();

}
