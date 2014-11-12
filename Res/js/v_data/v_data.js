/*
 * Created by Raul Luna, Jr on November 10, 2014
 */

var V_Data = Class.extend({
	
	construct: function(){

		this.Pie = null;
		this.Bar = null;
		this.Line = null;

	},

	/////////////////////////////////////////////////////
	// Reference: https://gist.github.com/enjalot/1203641
	/////////////////////////////////////////////////////

	pieChart: function( pothole_length){

		console.log("In pieChart function");
		// Remove old data
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

	////////////////////////////

	barChart: function(){

	},

	/////////////////////////////

	lineGraph: function(){

	},

	////////////////////////////////
	// Visualization current data
	// Parameters: current data
	////////////////////////////////
	visualizationit : function( pothole_length){

		console.log("In visualizationit() with length: " + pothole_length);
		this.pieChart( pothole_length);
	},

	///////////////////////////////////////
	// Remove old charts
	//////////////////////////////////////
	removeCharts: function(){

		//d3.select("svg").remove;
		d3.select("#graphs").selectAll("vis").remove;
	}


});