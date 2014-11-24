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

        this.barWidth = 0;
        this.barHeight = 0;

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
    BarChart1: function ( data) {

    	var potholeMonthCounter = 0;
    	var potholeWeekCounter = 0;

        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;

        var svg = this.svgBar1;

        //svg.selectAll("*").remove();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        var y = d3.scale.linear()
            .rangeRound([height, 0]);
        var color = d3.scale.ordinal()
            .range(["#98abc5"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        /*color.domain(d3.keys(data[0])
            .filter(function (key) {
                return key === "TOTAL_TRIPS"
            }));*/

        data.forEach(function (d) {
            d.statusOpen = +d.open;
            d.statusComplete = +d.complete;
        });

        x.domain(data.map(function (d) {
            return d.statusOpen;
        }));
        //Modified Map to filtered Map - Theja
        y.domain([0, d3.max(data.filter(function (d) {
            return d.statusOpen = +d.statusOpen;
        }))]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 50)
            .attr("x", width / 2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Distance Interval");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total Trips");

        svg.selectAll("bar")
            .data(data.filter(function (d) {
                return d.statusOpen === Open;
            }))
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.statusOpen);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.statusOpen);
            })
            .attr("height", function (d) {
                return height - y(d.statusOpen);
            });
    },

    ////////////////////////////////////////////////////////////////////////////////////
    updateWindow: function () {
        var xWin, yWin;

        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;

        var totalBarSizeX = this.barCanvasWidth + this.barMargin.left + this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight + this.barMargin.top + this.barMargin.bottom;

        switch (this.myTag) {
            case "#barchart1":
                this.svgBar1 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart2":
                this.svgBar2 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart3":
                this.svgBar3 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart4":
                this.svgBar4 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#table1":
                this.svgTable1 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#table2":
                this.svgTable2 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    /*updateData: function () {
        switch (this.myTag) {
            case "#barchart1":
                var fileToLoad = "App/json/RideDist/ride_dist_by_distance_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart1.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart2":
                var fileToLoad = "App/json/RideDist/ride_dist_by_time_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart2.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart3":
                var fileToLoad = "App/json/RideDist/ride_dist_by_distance_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart3.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart4":
                var fileToLoad = "App/json/RideDist/ride_dist_by_time_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart4.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#table1":
                var fileToLoad = "App/json/bikesDistTime/stations_data.json";
                this.inDataCallbackFunc = this.drawTable1.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#table2":
                var fileToLoad = "App/json/bikesDistTime/stations_data.json";
                this.inDataCallbackFunc = this.drawTable2.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
        }
    },*/

    /////////////////////////////////////////////////////////////

    /*updateScreen: function () {
        this.updateWindow();
        this.updateData();
    },*/
});