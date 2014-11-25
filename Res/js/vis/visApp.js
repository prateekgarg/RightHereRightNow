/**
 * Created by Prateek on 11/23/2014.
 */
var visApp = Class.extend({

    construct: function() {
        this.barMargin = {top: 20, right: 20, bottom: 20, left: 20};
        this.barCanvasWidth = 2500;
        this.barCanvasHeight = 500;

        this.barWidth = 0;
        this.barHeight = 0;

        this.svgBar1 = null;
        this.svgBar2 = null;

        this.myTag = "";
        this.lat1 = 41.8757207;
        this.long1 = -87.6603623;
        this.lat2 = 41.8577444;
        this.long2 = -87.6112346;
    },

    /////////////////////////////////////////////////////////////

    startup: function (whereToRender)
    {
        this.myTag = whereToRender;
        this.updateScreen();
    },

    /////////////////////////////////////////////////////////////
    drawBarChart: function(error, data){
        //this.drawBarChart1(error, data);
        //this.drawBarChart2(error, data);
    },

    //Drawing the bar chart for Origin distribution for the first visualization group.
    drawBarChart1: function (error, data)
    {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var svg = this.svgBar1;

        svg.selectAll("*").remove();

        var theft= 0,assault= 0, trespass= 0, drugs= 0, deceptive=0;
        data.forEach(function(obj){
            var myDate = new Date(obj.date);
            var daysAgo = (new Date() - myDate) / 1000 / 60 / 60 / 24;
            if(daysAgo <= 31) {
                switch (obj.primary_type) {
                    case "THEFT" :
                    case"BURGLARY":
                    case "MOTOR VEHICLE THEFT":
                    case "ROBBERY":
                        theft++;
                        break;
                    case "ASSAULT":
                    case "HOMICIDE":
                    case "CRIM SEXUAL ASSAULT":
                    case "BATTERY":
                        assault++;
                        break;
                    case "CRIMINAL DAMAGE":
                    case "CRIMINAL TRESPASS":
                        trespass++;
                        break;
                    case "NARCOTICS":
                        drugs++;
                        break;
                    case "DECEPTIVE PRACTICE":
                        deceptive++;
                        break;
                    default :
                        break;
                }
            }
        });
        //theft= 0,assault= 0, trespass= 0, drugs= 0, deceptive=0;
        var jsonObj = [['Theft', 'Assault','Trespass','Drugs','Deceptive Practices'],[theft, assault,trespass,drugs,deceptive]];
        var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
        var y = d3.scale.linear().range([height, 0]);
            //.range([height, 0]);
        var color = d3.scale.ordinal()
            .range(["#98abc5"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

        var total = theft + assault + trespass + drugs + deceptive;
        x.domain(jsonObj[0]);
        y.domain([0, d3.max(jsonObj[1])]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            //.style("text-anchor", "end")
            //.attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" )
           .append("text")
            .attr("y", 50)
            .attr("x", width/2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Type of Crime");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("No. of incidents");

        svg.selectAll("bar")
            .data(jsonObj)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d, i) { return x(total); })
            .attr("width", x.rangeBand())
            .attr("y", function(d,i) { return y(+jsonObj[1][i]); })
            .attr("height", function(d,i) { return height - y(+jsonObj[1][i]); });

        svg.selectAll("text.label")
            .data(jsonObj)
            .enter().append("text")
            .text(function(d, i) {
                return jsonObj[0][i];
            })
            .attr("x", function(d, index) {
                return (x(5) + (x.rangeBand()/2)) - 25;
            })
            .attr("y", function(d,i) {
                return y(jsonObj[1][i]);
            })
            .style("font-size","120%");

        console.log(jsonObj)
        
        svg.selectAll(".chart-title")
            .data(jsonObj)
            .enter()
            .append("text")
            .attr("x", width/2)
            .attr("y", height-600)
            .attr("text-anchor","middle")
            .attr("font-family", "sans-serif")
            .attr("font-size","30pt")
            .text("Crime Data Overall Chicago");
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the second visualization group.
    drawBarChart2: function (error, data)
    {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var svg = this.svgBar2;
        var x1, x2, y1, y2;
        if (this.lat1 < this.lat2){
            x2 = this.lat1;
            x1 = this.lat2;
        }
        else{
            x1 = this.lat1;
            x2 = this.lat2;
        }
        if (this.long1 < this.long2){
            y1 = this.long1;
            y2 = this.long2;
        }
        else{
            y2 = this.long1;
            y1 = this.long2;
        }

        svg.selectAll("*").remove();

        var theft= 0,assault= 0, trespass= 0, drugs= 0, deceptive=0;
        data.forEach(function(obj){
            var myDate = new Date(obj.date);
            obj.latitude = parseFloat(obj.latitude);
            obj.longitude = parseFloat(obj.longitude);
            var daysAgo = (new Date() - myDate) / 1000 / 60 / 60 / 24;
            if(daysAgo <= 31) {
                if(obj.latitude <= x1 && obj.longitude >= y1 && obj.latitude >= x2 && obj.longitude <= y2) {
                    switch (obj.primary_type) {
                        case "THEFT" :
                        case"BURGLARY":
                        case "MOTOR VEHICLE THEFT":
                        case "ROBBERY":
                            theft++;
                            break;
                        case "ASSAULT":
                        case "HOMICIDE":
                        case "CRIM SEXUAL ASSAULT":
                        case "BATTERY":
                            assault++;
                            break;
                        case "CRIMINAL DAMAGE":
                        case "CRIMINAL TRESPASS":
                            trespass++;
                            break;
                        case "NARCOTICS":
                            drugs++;
                            break;
                        case "DECEPTIVE PRACTICE":
                            deceptive++;
                            break;
                        default :
                            break;
                    }
                }
            }
        });
        //theft= 0,assault= 0, trespass= 0, drugs= 0, deceptive=0;
        var jsonObj = [['Theft', 'Assault','Trespass','Drugs','Deceptive Practices'],[theft, assault,trespass,drugs,deceptive]];
        var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
        var y = d3.scale.linear().range([height, 0]);
        //.range([height, 0]);
        var color = d3.scale.ordinal()
            .range(["#98abc5"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

        x.domain(jsonObj[0]);
        y.domain([0, d3.max(jsonObj[1])]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            //.style("text-anchor", "end")
            //.attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" )
            .append("text")
            .attr("y", 50)
            .attr("x", width/2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Type of Crime");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("No. of incidents");

        svg.selectAll("bar")
            .data(jsonObj)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d, i) { return x(jsonObj[0][i]); })
            .attr("width", x.rangeBand())
            .attr("y", function(d,i) { return y(+jsonObj[1][i]); })
            .attr("height", function(d,i) { return height - y(+jsonObj[1][i]); });

        svg.selectAll("text.label")
            .data(jsonObj)
            .enter().append("text")
            .text(function(d, i) {
                return jsonObj[0][i];
            })
            .attr("x", function(d, index) {
                return (x(5) + (x.rangeBand()/2)) - 25;
            })
            .attr("y", function(d,i) {
                return y(jsonObj[1][i]);
            })
            .style("font-size","120%");
        //console.log(jsonObj)
        svg.selectAll(".chart-title")
            .data(jsonObj)
            .enter()
            .append("text")
            .attr("x", width/2)
            .attr("y", height-600)
            .attr("text-anchor","middle")
            .attr("font-family", "sans-serif")
            .attr("font-size","20pt")
            .text("Crime Data For Selection");
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function ()
    {
        var xWin, yWin;

        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;

        var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;

        switch(this.myTag){
            case "#ChicagoCrimeData":
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
        }
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){
        switch(this.myTag){
            case "#ChicagoCrimeData":
                var fileToLoad = "http://data.cityofchicago.org/resource/ijzp-q8t2.json?$order=date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca";
                this.inDataCallbackFunc = this.drawBarChart.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart2":
                var fileToLoad = "http://data.cityofchicago.org/resource/ijzp-q8t2.json?$order=date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca";
                this.inDataCallbackFunc = this.drawBarChart.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){
        this.updateWindow();
        this.updateData();
    }
});