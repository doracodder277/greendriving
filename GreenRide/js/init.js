
/*var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
    document.getElementById('main-container'),
    defaultLayers.normal.map,
    {
        zoom: 10,
        center: { lat: 52.5, lng: 13.4 }
    });

var berlinMarker = new H.map.Marker({
    lat:52.5192,
    lng:13.4061
});
map.addObject(berlinMarker);*/
var selectedHole = undefined;
var dictionary = {};

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').leanModal();
    $("#modal1").click(function(){$(".lean-overlay").remove()})
});
var getRandomPoint = function (cluster) {
    var data;
    cluster.forEachDataPoint(
        function(e){
            data  =e.ij;
        }
        )
    return data;
};

var getDate = function (date) {
    var dateObj = new Date(date);
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = year + "/" + month + "/" + day;

    return newdate;
}
// Custom clustering theme description object.
// Object should implement H.clustering.ITheme interface
// Custom clustering theme description object.
// Object should implement H.clustering.ITheme interface
var CUSTOM_THEME = {
    getClusterPresentation: function(cluster) {
        // Get random DataPoint from our cluster
        var randomDataPoint = getRandomDataPoint(cluster),
            // Get a reference to data object that DataPoint holds
            data = randomDataPoint.getData();

        // Create a marker from a random point in the cluster
        var clusterMarker = new H.map.Marker(cluster.getPosition(), {
            icon: new H.map.Icon(data.thumbnail, {
                size: {w: 50, h: 50},
                anchor: {x: 25, y: 25}
            }),

            // Set min/max zoom with values from the cluster,
            // otherwise clusters will be shown at all zoom levels:
            min: cluster.getMinZoom(),
            max: cluster.getMaxZoom()
        });

        // Link data from the random point from the cluster to the marker,
        // to make it accessible inside onMarkerClick
        clusterMarker.setData(data);

        return clusterMarker;
    },
    getNoisePresentation: function (noisePoint) {
        // Get a reference to data object our noise points
        var data = noisePoint.getData(),
            // Create a marker for the noisePoint
            noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
                // Use min zoom from a noise point
                // to show it correctly at certain zoom levels:
                min: noisePoint.getMinZoom(),
                icon: new H.map.Icon(data.thumbnail, {
                    size: {w: 20, h: 20},
                    anchor: {x: 10, y: 10}
                })
            });

        // Link a data from the point to the marker
        // to make it accessible inside onMarkerClick
        noiseMarker.setData(data);

        return noiseMarker;
    }
};
/**
 * Boilerplate map initialization code starts below:
 */
// Helper function for getting a random point from a cluster object
function getRandomDataPoint(cluster) {
    var dataPoints = [];

    // Iterate through all points which fall into the cluster and store references to them
    cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));

    // Randomly pick an index from [0, dataPoints.length) range
    // Note how we use bitwise OR ("|") operator for that instead of Math.floor
    return dataPoints[Math.random() * dataPoints.length | 0];
}

/**
 * CLICK/TAP event handler for our markers. That marker can represent either a single photo or
 * a cluster (group of photos)
 * @param {H.mapevents.Event} e The event object
 */
function onMarkerClick(e) {
    console.log('click');
    // Get position of the "clicked" marker
    /*var position = e.target.getPosition(),
        // Get the data associated with that marker
        data = e.target.getData(),
        // Merge default template with the data and get HTML
        //bubbleContent = getBubbleContent(data),
        //bubble = onMarkerClick.bubble;

    // For all markers create only one bubble, if not created yet
    /*if (!bubble) {
        bubble = new H.ui.InfoBubble(position, {
            content: bubbleContent
        });
        ui.addBubble(bubble);
        // Cache the bubble object
        onMarkerClick.bubble = bubble;
    } else {
        // Reuse existing bubble object
        bubble.setPosition(position);
        bubble.setContent(bubbleContent);
        bubble.open();
    }

    // Move map's center to a clicked marker
    map.setCenter(position, true);*/


}
var showDetails = true;

//Init Firebase
var config = {
    apiKey: "AIzaSyAEHEEEBh29KIAvnO79ylGQRqpX2Q-kFA0",
    authDomain: "eh2017-64e81.firebaseapp.com",
    databaseURL: "https://eh2017-64e81.firebaseio.com/"
};
firebase.initializeApp(config);
var clusteredDataProvider;
var dataPoints;
function startClustering(map, data) {
    // First we need to create an array of DataPoint objects,
    // for the ClusterProvider
    dataPoints = data.map(function (item) {
        return new H.clustering.DataPoint(item.latitude, item.longitude, 1 , item.data);
    });
    console.log(dataPoints[0].data);


    // Create a clustering provider with custom options for clusterizing the input
    clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            // Maximum radius of the neighbourhood
            eps: 32,
            // minimum weight of points required to form a cluster
            minWeight: 2
        }//,
        //theme: CUSTOM_THEME
    });
    clusteredDataProvider.addEventListener('tap', function (evt) {



        //document.getElementById('elements').style.display = "block";

        var data = evt.target.getData().ij.data;
        if(data)
        {
            showDetails = true;
            console.log(data);
            selectedHole = data.id;
            if(data.intensity) $("#intensity").val(data.intensity);
            if(data.tmps) $("#date").val(getDate(data.tmps));
            $("#priority").val(data.priority ? undefined | data.priority : 0);
            $("#size").val(data.size ? undefined | data.size : 0);

        }
        else
        {
            showDetails = false;
        }
        $('#modal1').openModal();
        $(".lean-overlay").remove();
    })

    // Create a layer tha will consume objects from our clustering provider
    var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    clusteringLayer.addEventListener('tap', function (evt) {
        console.log("test : 13");
        console.log(evt);

    })
    // To make objects from clustering provder visible,
    // we need to add our layer to the map
    map.addLayer(clusteringLayer);



}


/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
    'app_id': 'f2ZY9vVliIE41ukKX4fX',
    'app_code': 'g7Pglv1ePpE8vWDrdkwBHg'
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('main-container'), defaultLayers.normal.map, {
    center: new H.geo.Point(30.789, 33.790),
    zoom: 2
});

map.addEventListener('tap', function (evt) {
    if(!showDetails)
    {
        document.getElementById('elements').style.display = "none";
        $('#modal1').closeModal();
        showDetails = true;
    }
    else
        showDetails = !showDetails;

})

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: request a data about airports's coordinates

  /*  startClustering(map, [
        {latitude : 23, longitude : 16, data : 'me 1'}]);*/

var database = firebase.database();
var starCountRef = firebase.database().ref('/data/');


starCountRef.on('value', function(snapshot) {
    var data = snapshot.val();
    var clone = [];

    if(dataPoints)
    {
        $.each(dataPoints, function (i,val) {
            clusteredDataProvider.removeDataPoint(val);
        })
    }

    $.each(data, function(i, val) {
       var temp = {};
       temp['latitude'] = val.latitude;
       temp['longitude'] = val.longitude;
       temp['data'] = {
           latitude : val.latitude,
           longitude : val.longitude,
           tmps : val.tmps,
           intensity : val.intensity,
           size :( val.size != undefined ? val.size : 0 ),
           priority :( val.priority != undefined ? val.priority : 0 ),
           id : i
       }

        clone.push(temp);
        dictionary[i.toString()] = temp.data;
    });

    startClustering(map, clone);
});

$("#edit").click(function()
{
    console.log("save");
    var data = dictionary[selectedHole.toString()];


    firebase.database().ref('data/' + selectedHole).set({
        intensity: data['intensity'],
        latitude: data['latitude'],
        longitude: data['longitude'],
        tmps: data['tmps'],
        priority : parseInt($("#priority").val()),
        size : parseInt($("#size").val())
    });
    $('#modal1').closeModal();

});

$("#remove").click(function()
{
    console.log('remove');
    firebase.database().ref('data/' + selectedHole).set(null);
    $('#modal1').closeModal();

});


