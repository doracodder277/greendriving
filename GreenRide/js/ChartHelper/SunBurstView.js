/**
 * Created by nizar on 28.09.2016.
 */
var SunBurstChart = Backbone.View.extend({

    chartContainer: "",
    breadCrumbCotainer: "",
    titleContainer: "",
    elementSizeContainer: "",
    legendContainer: "",
    percentageContainer: "",
    chartStruct: {},
    currentParentNode: undefined,
    currentParentNodeID: undefined,
    currentChartData: [],
    currentColors: {},
    currentSequenceArray : [],
    selectedSequenceArray : [],
    //TODO generate  color scheme and update foe new structs
    chartColors: [],
    title: "",
    targetDepth: 2,
    renderLegend: false,
    defaultTitle: "",
    data: {},
    //Chart DATA
    vis: null,
    partition: null,
    arc: null,
    totalSize: 0,

    initialize: function (jsonStruct, data, title, nodeID) {

        this.chartContainer = "#container";
        this.breadCrumbCotainer = "#sequence";
        this.titleContainer = "#stats-title";
        this.elementSizeContainer = "#element";
        this.percentageContainer = "#percentage";
        this.legendContainer = "#legend";
        this.defaultTitle = "Total Composition";
        this.chartColors = chartColors;
        this.currentColors = this.chartColors;
        this.title = title;
        self = this;

        if (data != undefined)
            this.data = data;

        if (jsonStruct != undefined)
            this.chartStruct = jsonStruct;

        this.updateParentNode(nodeID);

        $($('#chart-mode input')[0]).on("click", function () {
            self.updateChartStructure();
        })

    },
    setChartData: function (data) {
        this.data = data;
        this.updateChartStructure();

    },
    updateParentNode: function (nodeID) {

        this.currentParentNodeID = undefined;
        this.currentParentNode = this.chartStruct;

        if (this.chartStruct != undefined) {
            this.getNodeFromID(nodeID, this.chartStruct);
        }

        this.updateChartStructure();

    },
    getNodeFromID: function (nodeID, struct) {

        if (!Array.isArray(struct)) {
            for (var key in struct) {
                if (key == nodeID) {
                    this.currentParentNode = struct[key];
                    this.currentParentNodeID = nodeID;
                }
            }

            for (var key in struct) {
                this.getNodeFromID(nodeID, struct[key]);
            }
        }
    },
    hide : function () {

        $(this.legendContainer).addClass("hide");
        $(this.breadCrumbCotainer).addClass("hide");
        $("#chart-mode").addClass("hide");

    },
    show : function () {

        $(this.legendContainer).removeClass("hide");
        $(this.breadCrumbCotainer).removeClass("hide");
        $("#chart-mode").removeClass("hide");

    },
    generateChartData: function (val, path, depth) {
        var sum = 0;
        if (Array.isArray(val)) {
            //calcule sum and generate nodes
            for (var k in val) {
                if (this.data[val[k]] != undefined && this.data[val[k]] != 0) {
                    var subpath = path != undefined ? path + "-" + val[k] : val[k];
                    sum += this.data[val[k]];
                    if (depth <= this.targetDepth)
                    {
                        this.currentChartData.push([subpath, this.data[val[k]]]);
                        this.currentColors[val[k]] = this.chartColors[val[k]];

                    }
                }
            }

        }
        //generate nodes
        else {

            for (var k in val) {
                var t = val[k];
                var subpath = path != undefined ? path + "-" + k : k;

                var value = this.generateChartData(t, subpath, depth + 1);
                sum += value;
                if (depth == this.targetDepth)
                {
                    this.currentChartData.push([subpath, value]);
                    this.currentColors[k] = this.chartColors[k];
                }
            }
        }
        return sum;
    },
    updateChartStructure: function () {
        if (this.currentParentNodeID == undefined) {
            this.title = this.defaultTitle;
            self.selectedSequenceArray = [{name : this.defaultTitle, id : "T"}];
        }
        else {
            self.selectedSequenceArray = self.selectedSequenceArray.concat(self.currentSequenceArray);
        }
        if (!$("#chart-tag")[0].checked) {
            this.targetDepth = 1;
        }
        else {
            this.targetDepth = 200;
        }
        this.currentChartData = [];
        if (this.data != undefined && this.currentParentNode != undefined) {
            this.currentColors = [];
            this.generateChartData(this.currentParentNode, undefined, 1);
        }
        else {
            return;
        }
        if(this.currentChartData.length == 0)
        {
            this.renderNOData();
        }
        else
        {
            this.renderChart();
        }
    },
    renderNOData: function () {
        this.show();
        this.cleanChart();
        $(this.chartContainer).append("<div id=\"day-charts-error-container\" style=\"display: table; height: 600px; overflow: hidden;\"><div style=\"display: table-cell; vertical-align: middle;\"  ><div>NO DATA</div></div></div>");
    },
    setChartStruct: function (jsonStruct) {

        this.chartStruct = jsonStruct;
        this.currentParentNode = this.chartStruct;
        this.updateChartStructure();
    },
    renderChart: function () {
        this.cleanChart();
        this.show();
        this.drawLegend();
        this.vis = d3.select(this.chartContainer).append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("id", "container")
            .attr("label", "text")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        this.partition = d3.layout.partition()
            .size([2 * Math.PI, radius * radius])
            .value(function (d) {
                return d.size;
            });

        this.arc = d3.svg.arc()
            .startAngle(function (d) {
                return d.x;
            })
            .endAngle(function (d) {
                return d.x + d.dx;
            })
            .innerRadius(function (d) {
                return Math.sqrt(d.y);
            })
            .outerRadius(function (d) {
                return Math.sqrt(d.y + d.dy);
            });
        console.log();
        var json = this.buildHierarchy(this.currentChartData);
        this.createVisualization(json);
        $(this.titleContainer).html(this.title);
        this.updateBreadcrumbs(this.selectedSequenceArray,"");

    },
    cleanChart: function () {
        $(this.chartContainer).empty();
        $(this.legendContainer).empty();
        $(this.breadCrumbCotainer).empty();
        $(this.chartContainer).append("<span id=\"element\"></span><br/><span id=\"size\"></span>");
        $(this.titleContainer).html(this.defaultTitle);
    },

    // Main function to draw and set up the visualization, once we have the data.
    createVisualization: function (json) {


        // Basic setup of page elements.
        this.initializeBreadcrumbTrail();

        //TODO


        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        this.vis.append("svg:circle")
            .attr("r", radius)
            .style("opacity", 0);

        // For efficiency, filter nodes to keep only those large enough to see.
        this.nodes = this.partition.nodes(json)
            .filter(function (d) {
                return d.dx > 0.00005; // 0.005 radians = 0.29 degrees
            });
        this.path = this.vis.data([json]).selectAll("path")
            .data(this.nodes)
            .enter().append("svg:path")
            .attr("display", function (d) {
                return d.depth ? null : "none";
            })
            .attr("d", this.arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function (d) {
                return self.chartColors[d.id];
            })
            .style("opacity", 1)
            .on("click", function (d) {
                //window.resetcharts(d.id,d.name);
                self.title = d.name;
                self.updateParentNode(d.id);

            })
            .on("mouseover", this.mouseover);

        // Add the mouseleave handler to the bounding circle.
        d3.select(this.chartContainer).on("mouseleave", this.mouseleave);

        // Get total size of the tree = value of root node from partition.
        this.totalSize = this.path.node().__data__.value;
    },

// Fade all but the current sequence, and show it in the breadcrumb trail.
    mouseover: function (d) {

        var percentage = (100 * d.value / self.totalSize).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) {
            percentageString = "< 0.1%";
        }

        d3.select(self.percentageContainer)
            .text(percentageString);

        d3.select("#explanation")
            .style("visibility", "");

        var sequenceArray = self.getAncestors(d);
        self.currentSequenceArray = sequenceArray;
        self.updateBreadcrumbs(self.selectedSequenceArray.concat(self.currentSequenceArray), percentageString);

        // Fade all the segments.
        d3.selectAll("path")
            .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        self.vis.selectAll("path")
            .filter(function (node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);

        //$("#element").html(d.name);
        $(self.elementSizeContainer).html( d.value.toFixed(2) +" (g)");
    },

// Restore everything to full opacity when moving off the visualization.
    mouseleave: function (d) {

        // Hide the breadcrumb trail
        /**/

        //var temp = self.selectedSequenceArray.slice();
        if(self.selectedSequenceArray.length >= 1)
        {
            //var t = temp.pop();
            self.updateBreadcrumbs(self.selectedSequenceArray, "");
        }
        else
        {
            d3.select("#trail")
                .style("visibility", "hidden");
        }

        // Deactivate all segments during transition.
        d3.selectAll("path").on("mouseover", null);

        // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .each("end", function () {
                d3.select(this).on("mouseover", self.mouseover);
            });

        d3.select("#explanation")
            .style("visibility", "hidden");
    },

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
    getAncestors: function (node) {
        var path = [];
        var current = node;
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    },

    initializeBreadcrumbTrail: function () {
        // Add the svg area.
        this.trail = d3.select(this.breadCrumbCotainer).append("svg:svg")
            .attr("width", width)
            .attr("height", 50)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        this.trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
    },

// Generate a string that describes the points of a breadcrumb polygon.
    breadcrumbPoints: function (d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
    },

// Update the breadcrumb trail to show the current sequence and percentage.
    updateBreadcrumbs: function (nodeArray, percentageString) {


        // Data join; key function combines name and depth (= position in sequence).
        var g = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function (d) {
                return d.name + d.depth;
            });

        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", this.breadcrumbPoints)
            .style("fill", function (d) {
                return self.chartColors[d.id];
            });

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("id", function (d) {
                return d.id;
            })
            .text(function (d) {
                return d.name;
            })
            .on("click", function(d){

                var sequeceClear = false;
                /*while (!sequeceClear)
                {
                    if(self.currentSequenceArray[self.currentSequenceArray.length - 1].id != d.id)
                    {
                        self.currentSequenceArray.pop();
                    }
                    else
                    {
                        sequeceClear = true;
                    }
                }*/
                var index = self.selectedSequenceArray.length -1;
                for(var k in self.selectedSequenceArray)
                {
                    var val = self.selectedSequenceArray[k];
                    if(val.id == d.id)
                    {
                        index= parseInt(k) + 1 ;
                    }
                }
                self.currentSequenceArray = [];
                self.selectedSequenceArray.splice(index, self.selectedSequenceArray.length);
                self.title = d.name;
                self.updateParentNode(d.id);});

        // Set position for entering and updating nodes.
        g.attr("transform", function (d, i) {
            return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Remove exiting nodes.
        g.exit().remove();

        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
            .style("visibility", "");

    },

    drawLegend: function () {

        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
            w: 200, h: 30, s: 3, r: 3
        };

        this.legend = d3.select(this.legendContainer).append("svg:svg")
            .attr("width", li.w)
            .attr("height", d3.keys(this.currentColors).length * (li.h + li.s));

        this.g = this.legend.selectAll("g")
            .data(d3.entries(this.currentColors))
            .enter().append("svg:g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * (li.h + li.s) + ")";
            });

        this.g.append("svg:rect")
            .attr("rx", li.r)
            .attr("ry", li.r)
            .attr("width", li.w)
            .attr("height", li.h)
            .style("fill", function (d) {
                return d.value;
            });

        this.g.append("svg:text")
            .attr("x", li.w / 2)
            .attr("y", li.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return window.enums.NutritionCategories[d.key].nutrientName;
            });
        if(this.targetDepth == 1) this.legend.style("visibility", "");
        else     this.legend.style("visibility", "hidden");
    },



// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
    buildHierarchy :function(csv) {

        var root = {"name": "root", "children": []};
        for (var i = 0; i < csv.length; i++) {
            var sequence = csv[i][0];
            var size = +csv[i][1];
            if (isNaN(size)) { // e.g. if this is a header row
                continue;
            }
            var parts = sequence.split("-");
            var currentNode = root;
            for (var j = 0; j < parts.length; j++) {
                var children = currentNode["children"];
                var nodeName = parts[j];
                var childNode;
                if (j + 1 < parts.length) {
                    // Not yet at the end of the sequence; move down the tree.
                    var foundChild = false;
                    for (var k = 0; k < children.length; k++) {
                        if (children[k]["id"] == nodeName) {
                            childNode = children[k];
                            foundChild = true;
                            break;
                        }
                    }
                    // If we don't already have a child node for this branch, create it.window.enums.NutritionCategories[nodeName].nutrientName, "id" :
                    if (!foundChild) {
                        //TODO CLEAN
                        childNode = {"name": window.enums.NutritionCategories[nodeName].nutrientName, "id" : nodeName, "children": []};
                        children.push(childNode);
                    }
                    currentNode = childNode;
                } else {
                    // Reached the end of the sequence; create a leaf node.window.enums.NutritionCategories[nodeName].nutrientName, "id" :
                    //TODO CLEAN
                    childNode = {"name" : window.enums.NutritionCategories[nodeName].nutrientName, "id" : nodeName, "size": size};
                    children.push(childNode);
                }
            }
        }
        return root;
    }
});