/*
 * Created on November 10, 2014
 */

var V_Data = Class.extend({
	
	construct: function(){

        this.barMargin = {top: 100, right: 45, bottom: 100, left: 45};
        this.barCanvasWidth = 400;
        this.barCanvasHeight = 200;

        this.barWidth = 400;
        this.barHeight = 400;

        this.myTag1 = "";
        this.svgBar1 = null;
        this.svgBar2 = null;
        this.svgBar3 = null;
        this.svgBar4 = null;

        this.cityPotholeMonth = 0;
        this.cityPotholeWeek = 0;
        this.selectionPotholeMonth = 0;
        this.selectionPotholeWeek = 0;
 
        this.cityAbandonedMonth = 0;
        this.cityAbandonedWeek = 0;
        this.selectionAbandonedMonth = 0;
        this.selectionAbandonedWeek = 0;
 
        this.cityCrimeMonth = 0;
        this.cityCrimeWeek = 0;
        this.selectionCrimeMonth = 0;
        this.selectionCrimeWeek = 0;
 
        this.cityFoodMonth = 0;
        this.cityFoodWeek = 0;
        this.selectionFoodMonth = 0;
        this.selectionFoodWeek = 0;
 
        this.cityLightMonth = 0;
        this.cityLightWeek = 0;
        this.selectionLightMonth = 0;
        this.selectionLightWeek = 0;
 
        this.cityDivvyOut = 0;
        this.cityDivvyIn = 0;
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

	///////////////////////////////
	// Visualization current data
	// Parameters: current data
	////////////////////////////////
	visualizeit: function( a, b, c, d, e, f){

		console.log("In visualizeit()");
        //console.log("a: " + a + ",b: " + b);
        // Overall Data
        this.BarChart2(a,b,c,d,e,f);
        // Potholes
        this.BarChart1(a,b,0);
        // Vehicles
        this.BarChart3(c,d,1);
        // Lights
        this.BarChart4(e,f,2);
	},

	///////////////////////////////////////
	// Remove old charts
	//////////////////////////////////////
	removeCharts: function(){

		//d3.select("svg").remove;
        //svg.selectAll("#barchart2").remove()
	},

    //////////////////////////////////////////////////////////////////////////
	// Drawing the bar chart for  for the first visualization group.
    // Basic Bar Chart with only one value for each column
    // Cat == 0 for potholes
    // Cat == 1 for vehicles
    // Cat == 2 for lights
	//////////////////////////////////////////////////////////////////////////
    BarChart1: function (a, b, mode) {

        console.log("This the BarChart1\n");
        d3.select("#bar1").remove();

        var margin = this.barMargin;
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;

        var x = d3.scale.ordinal().rangeRoundBands([0,width-100], .1); // -100 make run for legend
        var y = d3.scale.linear().rangeRound([height,0]);
        var color = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e"]); //blue, orange,
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

        // Pothole data
        if( mode == 0){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Pothole Data";
        }
        // Abandon Vehicles data
        else if( mode == 1){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Abandoned Vehicles Data";
        }
        // Light data
        else if( mode == 2){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Light Data";
        }
        else{
            console.log("Invalid mode");
        }

        // Construct bar chart
        x.domain(data.map(function(d){ return d.label; }));
        y.domain([0,d3.max(data, function(d){ return d.value; })]);

        bar = d3.select("#barchart2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "bar1")
            .attr("viewBox", "" + -margin.left + " 0 600 " + height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g");
            //.attr("transform","translate(" + margin.left + "," + margin.top + ")");

        bar.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y",50)
            .attr("x",width/2)
            .attr("dx",".71em")
            .style("text-anchor","middle")
            .text(title);

        bar.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",10)
            .attr("dy",",71em")
            .attr("text-anchor","middle")
            .text("Count");

        bar.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("transform", "translate(50,0)")
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {return (i * (width / data.length)) + ((width / data.length - 50) / 2);})
            .attr("y", function(d) {return y(0) - y(d.size) + 14;})
            .attr("class", "yAxis")
            .text(function(d) {return y(d.value);});

        //grid lines  y.ticks controls the number of lines
        bar.selectAll("line.horizontalGrid").data(y.ticks(10)).enter()
            .append("line")
            .attr(
            {
                "class":"horizontalGrid",
                "x1" : 0,
                "x2" : width-60,
                "y1" : function(d){ return y(d);},
                "y2" : function(d){ return y(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "grey",
                "stroke-width" : "1px"
            });

        bar.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d){ return x(d.label); })
            .attr("width", x.rangeBand())
            .attr("y", function(d){ return y(d.value); })
            .attr("height", function(d) {return  height - y(d.value); })
            .style("fill", "steelblue");

    },

    BarChart2: function (a, b, c, d, e, f) {

        console.log("In BarChart2()");
        //console.log("a: " + a + ", b: " + b);
        //console.log("c: " + c + ", d: " + d);
        
        d3.select("svg").remove();

        var margin = this.barMargin;
        var height = this.barCanvasHeight;
        var width = this.barCanvasWidth;
        //var svg = this.svgBar1;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width-100], .1); //width-100 to make room for the legend.

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var color = d3.scale.ordinal()
            //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
            .range(["#1f77b4", "#ff7f0e","d62728"]); //blue, orange, red
            //color code for Progress Report
            //.range(["#00FFFF","#00FF00","#990099","#FF0000","#FFFF00"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        svg = d3.select("#ChicagoCrimeData").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", "" + -margin.left + " 100 600 " + height)
            //.attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("id", "overallBar");

        // Get the data
        var data = [ {"Label":"Pothole","Selected":a,"Total":b},
            {"Label":"Lights","Selected":e,"Total":f},
            {"Label":"Abandon Vehicle","Selected":c,"Total":d} ];

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Label"; }));

        data.forEach(function(d) {
            var y0 = 0;
            d.num = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.total = d.num[d.num.length - 1].y1;
        });


        x.domain(data.map(function(d) { return d.Label; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")  //added this line through rotate to change orientation of x axis
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-1em")
            .attr("transform", function(d) {
                return "rotate(-90)"
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor","middle")
            .style("text-anchor", "end");

        //grid lines  y.ticks controls the number of lines
        svg.selectAll("line.horizontalGrid").data(y.ticks(10)).enter()
            .append("line")
            .attr(
            {
                "class":"horizontalGrid",
                "x1" : 0,
                "x2" : width-60,
                "y1" : function(d){ return y(d);},
                "y2" : function(d){ return y(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "grey",
                "stroke-width" : "1px"
            });

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x(d.Label) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.num; })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return y(d.y0) - y(d.y1); })
            .attr("y", function(d) { return y(d.y1); })
            .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        //Added y label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -60)
            .attr("x",-70)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Count");

        //Add Title
        svg.append("text")
            .attr("x", (width/2) )//(width / 2))
            .attr("y", -20) //0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text("Overall Chicago");

        state.selectAll("text")
            .data(function(d) { return d.num; })
            .enter()
            .append("text")
            .attr("x", x.rangeBand()/2)
            .attr("y", function(d, i) { return y(d.y1) + (y(d.y0) - y(d.y1))/2; })
            .style("text-anchor", "middle")
            .text(function(d, i) { return d.y1-d.y0; })
    },

     BarChart3: function (a, b, mode) {

        console.log("This the BarChart3\n");
        d3.select("#bar2").remove();

        var margin = this.barMargin;
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;

        var x = d3.scale.ordinal().rangeRoundBands([0,width-100], .1); // -100 make run for legend
        var y = d3.scale.linear().rangeRound([height,0]);
        var color = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e"]); //blue, orange,
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

        // Pothole data
        if( mode == 0){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Pothole Data";
        }
        // Abandon Vehicles data
        else if( mode == 1){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Abandoned Vehicles Data";
        }
        // Light data
        else if( mode == 2){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Light Data";
        }
        else{
            console.log("Invalid mode");
        }

        // Construct bar chart
        x.domain(data.map(function(d){ return d.label; }));
        y.domain([0,d3.max(data, function(d){ return d.value; })]);

        hel = d3.select("#barchart3").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "bar2")
            .attr("viewBox", "" + -margin.left + " 0 600 " + height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g");

        hel.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y",50)
            .attr("x",width/2)
            .attr("dx",".71em")
            .style("text-anchor","middle")
            .text(title);

        hel.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",10)
            .attr("dy",",71em")
            .attr("text-anchor","middle")
            .text("Count");

        hel.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("transform", "translate(50,0)")
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {return (i * (width / data.length)) + ((width / data.length - 50) / 2);})
            .attr("y", function(d) {return y(0) - y(d.size) + 14;})
            .attr("class", "yAxis")
            .text(function(d) {return y(d.value);});

        //grid lines  y.ticks controls the number of lines
        hel.selectAll("line.horizontalGrid").data(y.ticks(10)).enter()
            .append("line")
            .attr(
            {
                "class":"horizontalGrid",
                "x1" : 0,
                "x2" : width-60,
                "y1" : function(d){ return y(d);},
                "y2" : function(d){ return y(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "grey",
                "stroke-width" : "1px"
            });

        hel.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d){ return x(d.label); })
            .attr("width", x.rangeBand())
            .attr("y", function(d){ return y(d.value); })
            .attr("height", function(d) {return  height - y(d.value); })
            .style("fill", "steelblue");

    },

     BarChart4: function (a, b, mode) {

        console.log("This the BarChart4\n");
        d3.select("#bar3").remove();

        var margin = this.barMargin;
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;

        var x = d3.scale.ordinal().rangeRoundBands([0,width-100], .1); // -100 make run for legend
        var y = d3.scale.linear().rangeRound([height,0]);
        var color = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e"]); //blue, orange,
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

        // Pothole data
        if( mode == 0){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Pothole Data";
        }
        // Abandon Vehicles data
        else if( mode == 1){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Abandoned Vehicles Data";
        }
        // Light data
        else if( mode == 2){
            var data = [ {"label":"Total","value":b+a}, {"label":"Selected","value":a} ];
            var title = "Light Data";
        }
        else{
            console.log("Invalid mode");
        }

        // Construct bar chart
        x.domain(data.map(function(d){ return d.label; }));
        y.domain([0,d3.max(data, function(d){ return d.value; })]);

        cat = d3.select("#barchart4").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "bar3")
            .attr("viewBox", "" + -margin.left + " 0 600 " + height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g");

        cat.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y",50)
            .attr("x",width/2)
            .attr("dx",".71em")
            .style("text-anchor","middle")
            .text(title);

        cat.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",10)
            .attr("dy",",71em")
            .attr("text-anchor","middle")
            .text("Count");

        cat.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("transform", "translate(50,0)")
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {return (i * (width / data.length)) + ((width / data.length - 50) / 2);})
            .attr("y", function(d) {return y(0) - y(d.size) + 14;})
            .attr("class", "yAxis")
            .text(function(d) {return y(d.value);});

        //grid lines  y.ticks controls the number of lines
        cat.selectAll("line.horizontalGrid").data(y.ticks(10)).enter()
            .append("line")
            .attr(
            {
                "class":"horizontalGrid",
                "x1" : 0,
                "x2" : width-60,
                "y1" : function(d){ return y(d);},
                "y2" : function(d){ return y(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "grey",
                "stroke-width" : "1px"
            });

        cat.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d){ return x(d.label); })
            .attr("width", x.rangeBand())
            .attr("y", function(d){ return y(d.value); })
            .attr("height", function(d) {return  height - y(d.value); })
            .style("fill", "steelblue");

    },

    // Return count for each category
    Count: function(data){

        var count = 0;
        var others = 0;

        data.forEach(function(d) {
            if(d.status == "Open"){
                count = count + 1;
            }
            // Do nothing but still count for total
            else{
                others = others + 1;
            }
        });
        // Return count and others
        var total = [ count, others ];
        return total;
    }
});