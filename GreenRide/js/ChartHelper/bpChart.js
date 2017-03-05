/**
 * Created by nizar on 30.09.2016.
 */

var data=[
    ['A','X', 1]
    ,['A','Y', 3]
    ,['B','X', 5]
    ,['B','Y', 8]
    ,['C','X', 2]
    ,['C','Y', 9]
];

window.testCharts = function () {
    var width=960, height=700;
    var color = {A:"#3366CC", B:"#DC3912",  C:"#FF9900"};

//create bp object
    var bp=viz.bP().data(data).pad(2).fill(d=>color[d.primary]);

// create svg and g elements and draw bp on it
    d3.select("body").append("svg").attr("width", width).attr("height", height)
        .append("g").attr("transform","translate(250,50)").call(bp);

// refresh data every second
    setInterval(update,1000);

    function update(){
        // reate some random values
        data.forEach(function(d){ d[2] =Math.random()*10 ;});
        //set the new data and redraw
        bp.update(data);
    }

// adjust the bl.ocks frame dimension.
    d3.select(self.frameElement).style("height", height+"px").style("width", width+"px");

}