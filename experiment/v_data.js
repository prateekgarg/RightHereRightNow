/*
 * Created by Raul Luna, Jr on November 10, 2014
 */

var V_Data = Class.extend({
	
	construct: function(){

		//this.Pie = null;
		//this.Bar = null;
		//this.Line = null;

		this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1000;
        this.barCanvasHeight = 200;

        this.barWidth = 400;
        this.barHeight = 400;

        this.svgBar1 = null;
        //this.svgBar2 = null;
        //this.svgBar3 = null;
        //this.svgBar4 = null;
        //this.svgTable1 = null;
        //this.svgTable2 = null;

	},

	/////////////////////////////////////////////////////
	// Reference: https://gist.github.com/enjalot/1203641
	/////////////////////////////////////////////////////

	pieChart: function( pothole_length){

		console.log("pie chart");
		// Remove previous graph if needed
		this.removeCharts();

		// SCRIPT TO GENERATE GRAPHS
		// So far, labels are hard-coded. Must be able to pass data along to V_Data class
		var data = [ { "label":"Potholes","value":pothole_length-200 }, {"label":"Others","value": 200} ];

	    var width = 960,
	        height = 500,
	        radius = Math.min(width, height) / 2;

	    // Desired colors
		var color = d3.scale.category20();

		// Create the svg element inside the graphs container
		var vis = d3.select("#graphs")
			.append("svg:svg")
			.data([data])
			.attr("width", width)
            .attr("height", height)
            .attr("viewBox", "0 0 960 500")
            .attr("preserveAspectRatio", "xMidYMid meet")
            // make a group to hold our pie chart
            .append("svg:g")
            .attr("transform", "translate(" + radius + "," + radius + ")");
 
 		var arc = d3.svg.arc()
 			.outerRadius(radius);
 
 		// Create arc data for given list of values
 		var pie = d3.layout.pie()
 			.value(function(d) { return d.value; });
 
 		var arcs = vis.selectAll("g.slice")
 			.data(pie)
 			.enter()
 			.append("svg:g")
 			.attr("class", "slice");
 
 		arcs.append("svg:path")
 			.attr("fill", function(d, i) { return color(i); } )
 			.attr("d", arc);
 
 		arcs.append("svg:text")
 			.attr("transform", function(d) {
 				//we have to make sure to set these before calling arc.centroid
 				d.innerRadius = 0;
 				d.outerRadius = radius;
 				return "translate(" + arc.centroid(d) + ")"; })
 			.attr("text-anchor", "middle")
 			.text(function(d, i) { return data[i].label; });
	},

	////////////////////////////////
	// Visualization current data
	// Parameters: current data
	////////////////////////////////
	visualizationit : function( collection){

		console.log("In visualizationit()");
		//this.pieChart( pothole_length);
		this.BarChart1( collection);
	},

	///////////////////////////////////////
	// Remove old charts
	//////////////////////////////////////
	removeCharts: function(){

		//d3.select("svg").remove;
		d3.select("#graphs").selectAll("vis").remove;
	},

    /////////////////////////////////////////////////////////////
	// Drawing the bar chart for  for the first visualization group.
	//////////////////////////////////////////////////////////////////////////
    BarChart1: function (data, mode) {

        console.log("This the BarChart1\n");

        var margin = this.barMargin;
        var width = this.barCanvasWidth;
        var height = this.barHeight;
        var svg = this.svgBar1;

        var x = d3.scale.ordinal().rangeRoundBands([0,width], .1);
        var y = d3.scale.linear().rangeRound([height,0]);
        var color = d3.scale.ordinal().range(["#98abc5"]);
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

        // Local scope variables
        var openCount = 0;

        // Exact wanted data
        data.forEach(function(d){
            if(d.status === "Open"){
                openCount = openCount + 1;
            }
            else{
                console.log("move on\n");
            }
        });

        //
        var data = [ {"label":"Open","value":openCount} ];
        console.log("BarChart1 / Data: ", data);

        // Construct bar chart
        x.domain(data.map(function(d){ return d.label; }));
        y.domain([0,d3.max(data, function(d){ return d.value; })]);

        svg = d3.select("#graphs").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y",50)
            .attr("x",width/2)
            .attr("dx",".71em")
            .style("text-anchor","middle")
            .text("Categories Data");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",6)
            .attr("dy",",71em")
            .style("text-anchor","end")
            .text("Count");

        svg.selectAll("bar")
            .data([data])
            .enter().append("rect")
            .style("fill", "blue")
            .attr("x", function(d){ return d.label; })
            .attr("width", x.rangeBand())
            .attr("y", function(d){ return d.value; })
            .attr("height", function(d){ return height - y(d.value); });
    }
});