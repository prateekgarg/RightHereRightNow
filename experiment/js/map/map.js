var mapClass = Class.extend({
    construct: function () {
        this.MainMap = null;
        this.mapLayer1 = null;
        this.mapLayer2 = null;
        this.mapLayer3 = null;
        this.svg = null;

        this.overlayLayers = [];

        this.MainMap = L.map('map').setView([41.8678783,-87.6304208], 15);   //41.8710977,-87.6399654
        this.MainMap._initPathRoot();

        this.mapURL3 = 'https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png';
        this.mapCopyright3 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

        this.mapURL2 = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
        this.mapCopyright2 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

        this.mapURL1 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        this.mapCopyright1 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

        this.mapLayer1 = L.tileLayer(this.mapURL1, {attribution: this.mapCopyright1});
        this.mapLayer2 = L.tileLayer(this.mapURL2, {attribution: this.mapCopyright2});
        this.mapLayer3 = L.tileLayer(this.mapURL3, {attribution: this.mapCopyright3});

        this.parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
        this.today = new Date();
        this.bigCollection = [];
        this.popupCounter = 0;
       // this.UicTopLeftCoordinate = [41.8757207,-87.6603623];
        //this.MuseumCampusCoordiantes = [41.8577444,-87.6112346];
        //this.customMapLayer = null;
       // this.customMapLayer2 = null
        this.campusFlag = false;
        this.m1 = null;
        this.m2 = null ;
        this.lat1 = 0;
        this.lat2 = 0;
        this.long1 = 0;
        this.long2 = 0;
        this.Rect = null;
        this.areaFlag = false;
       // this.divvyData = null;
       // this.divvyMarkers = [];
        this.lastUpdatePotholes = null;
        this.lastUpdateStreetlights = null;
        this.lastUpdateAbandonedVehicles = null;
        this.incrementer = 0;
    },

    /////////////////////////////////////////////////////////////

    jsonToGeoJson: function(collection){

        //Different parameters for divvy...make a new function with similar stuff.

        var type = '"type"';
        var FeatureLabel = '"Feature"';
        var geometryLabel = '"geometry"';
        var pointLabel = '"Point"';
        var coordinatesLabel = '"coordinates"';
        var propertiesLabel = '"properties"';
        var GJson = '{"type" : "FeatureCollection", "features" : [';
        collection.forEach
        (
            function(d)
            {
                GJson = GJson + "{";
                GJson = GJson + type + ":";
                GJson = GJson + FeatureLabel + ",";
                GJson = GJson + geometryLabel + ":{";
                GJson = GJson + type + ":";
                GJson = GJson + pointLabel + ",";
                GJson = GJson + coordinatesLabel + ":[";
                if(d.location){
                    var longitude = d.location.longitude;
                    var latitude = d.location.latitude;
                    GJson = GJson + longitude + "," + latitude + "]},";
                }
                else if(d.latitude){    //if this, then it is divvy data
                    var longitude = d.longitude;
                    var latitude = d.latitude;
                    GJson = GJson + longitude + "," + latitude + "]},";
                }

                else GJson = GJson + 0.00000 + "," + 0.00000 + "]},";
                GJson = GJson + propertiesLabel + ":{";
                for( obj in d ){

                    if(obj !== "location" ||(obj != "latitude" && obj != "longitude")){
                        GJson = GJson + '"' + obj + '":"' + d[obj] + '",';
                        continue;
                    }
                    if(! d.location){
                        GJson = GJson +
                            '"location/needs_recoding":"","location/longitude":"","location/latitude":"",';
                        continue;
                    }
                    var longitude, latitude;
                    if (d.location) {
                        longitude = d.location.longitude;
                        latitude = d.location.latitude;
                    }
                    else if(d.latitude){
                        longitude = d.longitude;
                        latitude = d.latitude;
                    }
                    for(var locObj in d[obj]){
                        GJson = GJson + '"location/' + locObj + '":"' + d[obj][locObj] + '",';
                    }
                }
                GJson = GJson.substring(0, GJson.length - 1);
                GJson = GJson + "}},";

            }
        );
        GJson = GJson.substring(0, GJson.length - 1);
        GJson = GJson + "]}";
        GJson = jQuery.parseJSON(GJson);
        return GJson;
    },

    /////////////////////////////////////////////////////////////

    setMap: function(setWhichMap) {
        var selectedOnes = null;

        if (setWhichMap === 1){
            this.MainMap.removeLayer(this.mapLayer2);
            this.MainMap.removeLayer(this.mapLayer3);
            this.mapLayer1.addTo(this.MainMap);
            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "white");
        }
        else if (setWhichMap == 2){
            this.MainMap.removeLayer(this.mapLayer1);
            this.MainMap.removeLayer(this.mapLayer3);
            this.mapLayer2.addTo(this.MainMap);

            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "black");
        }
        else{
            this.MainMap.removeLayer(this.mapLayer1);
            this.MainMap.removeLayer(this.mapLayer2);
            this.mapLayer3.addTo(this.MainMap);

            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "black");
        }
    },

    /////////////////////////////////////////////////////////////
    // Junior has edit this function. Want to create a new class
    // everytime the data is updated.
    ////////////////////////////////////////////////////////////

    getUpdatedData: function(url, layer, mode){
        var query = url;
        var bigCollection = this.bigCollection;
        var callback = this.processData.bind(this);
        d3.json
        (
            query, function(collection)
            {
                bigCollection = bigCollection.concat(collection);
                callback(bigCollection, layer, mode);
                // Potholes
                if( mode == 0){
                    // Want to call a function here to display current data
                    //console.log(bigCollection.length);
                    //var pothole_length = bigCollection.length;
                    //console.log(pothole_length);
                    //this.make_chart( pothole_length, "body", colors);
                    viz = new V_Data;
                    // Would like to pass current pothole data along
                    viz.visualizationit( collection);
                }
                //console.log(bigCollection.length);
            }
            // Implement bar graph. Probably in the wrong space and not implemented the way Prateek wants but functionality
            // before neatness!
        );
    },

    /////////////////////////////////////////////////////////////

    processData: function(collection, newLayer, mode){
        var parseDate = this.parseDate;
        var today = this.today;

        var geoJsonData = this.jsonToGeoJson(collection);
       //
       // console.log(geoJsonData);
        var markerOptions = {
            radius: 8,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        if(mode == 3){
            L.geoJson(geoJsonData, {

                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, markerOptions);
                },
                style: function (feature) {
                    return "green";
               }
            }).addTo(newLayer);
        }
        else {
            L.geoJson(geoJsonData, {
                filter: function (feature, layers) {
                    var status = feature.properties.status;
                    if (status === "STATUS") return false;
                    var myDate = parseDate(feature.properties.creation_date);

                    var daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    return daysAgo <= 31;
                },
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, markerOptions);
                },
                style: function (feature) {
                    var myDate = parseDate(feature.properties.creation_date);
                    var daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    var inLastWeek = 0;
                    if (daysAgo <= 7) inLastWeek = 1;
                    if (mode === 0) {
                        if (this.lastUpdatePotholes === null){
                            this.lastUpdatePotholes = myDate;
                        }
                        else if (myDate > this.lastUpdatePotholes){
                            return {color: "E31010"};
                        }
                        else {
                            switch (inLastWeek) {
                                case 1:
                                    return {color: "#050A4A"};
                                case 0:
                                    return {color: "#4A0522"};
                            }
                        }
                    } else if (mode === 1) {
                        if (this.lastUpdateAbandonedVehicles === null) {
                            this.lastUpdateAbandonedVehicles = myDate;
                        }
                        else if (myDate > this.lastUpdateAbandonedVehicles) {
                            return {color: "F50505"};
                        }
                        else{
                            switch (inLastWeek) {
                                case 1:
                                    return {color: "#054A0E"};
                                case 0:
                                    return {color: "#10DE2B"};
                            }
                    }
                    } else if (mode === 2) {
                        if (this.lastUpdateStreetlights === null){
                            this.lastUpdateStreetlights = myDate;
                        }
                        else if(myDate > this.lastUpdateStreetlights){
                            return {color: "F50505"};
                        }
                        else {
                            switch (inLastWeek) {
                                case 1:
                                    return {color: "#820F96"};
                                case 0:
                                    return {color: "#0B010D"};
                            }
                        }
                    }

                    else {
                        return {color: "#BBBBBB"};
                    }
                }
            }).addTo(newLayer);
        }
    },

    /////////////////////////////////////////////////////////////

    refreshData: function()
    {

        if (this.campusFlag && !this.areaFlag) {
            this.overlayLayers[0].clearLayers();
            this.overlayLayers[1].clearLayers();
            this.overlayLayers[2].clearLayers();
            this.overlayLayers[3].clearLayers();

            if(this.MainMap.hasLayer(this.Rect)){
                this.MainMap.removeLayer(this.Rect);
                if(this.MainMap.hasLayer(this.m1)){
                    this.MainMap.removeLayer(this.m1);
                }
                if(this.MainMap.hasLayer(this.m2)){
                    this.MainMap.removeLayer(this.m2);
                }
            }
            this.lat1 = 41.8757207;
            this.long1 = -87.6603623;
            this.lat2 = 41.8577444;
            this.long2 = -87.6112346;

            this.getUpdatedData("http://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[0], 0);

            this.getUpdatedData("http://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[1], 1);

            this.getUpdatedData(
                "http://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[2], 2);
            this.getFoodData(
                "http://data.cityofchicago.org/resource/4ijn-s7e5.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=inspection_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[4], 4);

            this.DivvyJson("http://www.divvybikes.com/stations/json", this.lat1, this.long1, this.lat2, this.long2);


        }
        else if(this.areaFlag && !this.campusFlag){
            this.overlayLayers[0].clearLayers();
            this.overlayLayers[1].clearLayers();
            this.overlayLayers[2].clearLayers();
            this.overlayLayers[3].clearLayers();


            this.getUpdatedData("http://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[0], 0);

            this.getUpdatedData("http://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[1], 1);

            this.getUpdatedData("http://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",this.overlayLayers[2], 2);
            this.getFoodData("http://data.cityofchicago.org/resource/4ijn-s7e5.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
            ","+this.long2 +")&$order=inspection_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",this.overlayLayers[4], 4);

            this.DivvyJson("http://www.divvybikes.com/stations/json", this.lat1, this.long1, this.lat2, this.long2);
        }
        else if(!this.areaFlag && !this.campusFlag) {
            this.overlayLayers[0].clearLayers();
            this.overlayLayers[1].clearLayers();
            this.overlayLayers[2].clearLayers();
            this.overlayLayers[3].clearLayers();

            if (this.MainMap.hasLayer(this.Rect)) {
                this.MainMap.removeLayer(this.Rect);

                if (this.MainMap.hasLayer(this.m1)) {
                    this.MainMap.removeLayer(this.m1);
                }
                if (this.MainMap.hasLayer(this.m2)) {
                    this.MainMap.removeLayer(this.m2);
                }
            }
            this.lat1 = 0;
            this.lat2 = 0;
            this.long1 = 0;
            this.long2 = 0;
            this.getUpdatedData("http://data.cityofchicago.org/resource/7as2-ds3y.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.overlayLayers[0], 0);

            this.getUpdatedData("http://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",                this.overlayLayers[1], 1);

            this.getUpdatedData("http://data.cityofchicago.org/resource/zuxi-7xem.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",               this.overlayLayers[2], 2);
            //this.getFoodData("http://data.cityofchicago.org/resource/4ijn-s7e5.json?$order=inspection_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",               this.overlayLayers[4], 4);
            //$.getJSON(url, jsonHolder, callBack);
            this.DivvyJson("http://www.divvybikes.com/stations/json", 0,0);
        }
    },

    //////////////////////////////////////////////////

    init: function(){
        this.customMapLayer = new MyCustomLayer;        //Custom Layer did not work... remove this before submission
        this.customMapLayer2 = new MyCustomLayer;
        for(var index = 0; index < this.overlayLayers.length; index++){
            if(this.MainMap.hasLayer(this.overlayLayers[index])){
                this.MainMap.removeLayer(this.overlayLayers[index]);
            }
        }
        if(this.MainMap.hasLayer(this.mapLayer1))
            this.MainMap.removeLayer(this.mapLayer1);

        if(this.MainMap.hasLayer(this.mapLayer2))
            this.MainMap.removeLayer(this.mapLayer2);
        if(this.MainMap.hasLayer(this.mapLayer3))
            this.MainMap.removeLayer(this.mapLayer3);

        this.overlayLayers = [];

        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        var baseLayers = {
            "Aerial"  : this.mapLayer1,
            "Map"	  : this.mapLayer2,
            "StreetView" : this.mapLayer3
        };

        var overlays = {
            "Potholes"  			: this.overlayLayers[0],
            "Abandoned Vehicles"	: this.overlayLayers[1],
            "Street Lights" 		: this.overlayLayers[2],
            "Divvy Stands"          : this.overlayLayers[3],
            "Food Inspection"       : this.overlayLayers[4]
        };
        setInterval(this.refreshData(), 60 * 1000);
        this.refreshData();
        L.control.layers(baseLayers, overlays).addTo(this.MainMap);

        var functionCallHere = this.MapClicked.bind(this);
        this.MainMap.addLayer(this.mapLayer3);
        this.MainMap.addLayer(this.overlayLayers[0]);


        this.MainMap.on('click', function(e){
            functionCallHere(e.latlng.lat, e.latlng.lng, e.latlng);
        });
    },

    ////////////////////////////////////////////////////

    MapClicked: function(latitude, longitude, latlong){

        var counter = this.popupCounter;

        if (counter == 0){
            this.lat1 = latitude;
            this.long1 = longitude;
            this.m1 = L.marker(latlong);
            counter = 1;
            this.popupCounter = counter;
            this.m1.addTo(this.MainMap);
        }
        else if (counter == 1){
            this.lat2 = latitude;
            this.long2 = longitude;
            this.m2 =  L.marker(latlong);
            this.m2.addTo(this.MainMap);

            counter = 3;
            console.log("Counter = " + counter);
            this.popupCounter = counter;
            this.areaFlag = true;
            this.campusFlag = false;
            this.refreshData();
            this.drawRect();
        }
        else
        {
            this.MainMap.removeLayer(this.m2);
            this.MainMap.removeLayer(this.m1);

            this.MainMap.removeLayer(this.Rect);
            counter = 0;
            console.log("Counter2 = " + counter);
            this.popupCounter = 0;
            this.Rect.hide();
            $('path').remove('.leaflet-clickable');
            //$('div').remove('.leaflet-marker-pane');
            $('img').remove('.leaflet-marker-icon');
            $('img').remove('.leaflet-marker-shadow');
        }


    },

    /////////////////////////////////////////

    limitView: function(){
        this.campusFlag = true;
        this.areaFlag = false;
        this.refreshData();
    },

    ///////////////////////////////////////////

    fullView: function(){
        this.campusFlag = false;
        this.areaFlag = false;
        this.refreshData();
    },

    //////////////////////////////////////////

    drawRect: function(){
        var x1 = this.lat1,
            x2 = this.lat2,
            y1 = this.long1,
            y2 = this.long2;
        latlngs = [[x1,y1],[x2,y1],[x2,y2],[x1,y2],[x1,y1]];
        this.Rect = L.Routing.control({
            waypoints: [L.latLng(x1,y1), L.latLng(x2,y2)]
        });

        this.Rect.addTo(this.MainMap);
        this.Rect.show();
        //this.MainMap.removeLayer(this.Rect);
        //this.Rect = L.polyline(latlngs, {color: 'red'});
        //this.Rect.addTo(this.MainMap);
        //this.customMapLayer.addTo(this.MainMap);
    },

    ///////////////////////////////////////////////////

    getStationOnMap: function(json, layerVariable){

        var markerOptions = {
            radius: 8,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        L.geoJson(json, {
                pointToLayer: function (feature, latlng) {

                    return L.circleMarker(latlng, markerOptions);
                },
                style: function(features){
                    return "#A32164";
                }
            }
        ).addTo(layerVariable);
        //layerVariable.addTo(this.MainMap);
    },

    ///////////////////////////////////////////// - Hardik

    DivvyData: function(data, newLayer)
    {
        //console.log("Divvy Query Returns:")
        //console.log(data);
        //var divvydata = $.parseJSON('{' +data.stationBeanList + '}');
        //this.divvyData = $.parseJSON(divvydata);
        //console.log("divvy Data : "+ divvydata);
        //var reqGeo = this.convertDivvyJsonToGeoJson(divvydata);

        var stationList = data.stationBeanList;
        var reqGeo = this.convertDivvyJsonToGeoJson(stationList);
        //console.log(this.incrementer++);
        this.getStationOnMap(reqGeo, this.overlayLayers[3]);
    },

    DivvyJson: function(site, lat1,long1,lat2,long2)
    {

        var callback = this.DivvyData.bind(this);
        requestCrossDomainJSON(site, callback);

    },
    convertDivvyJsonToGeoJson: function(stationArray){
        //console.log("Divvy : " + json);
        var geoJson = '{"type": "GeometryCollection", "geometries": [';
        var geoJsonInter = '{"type": "Point","coordinates":[';
        var geoJsonInterClose = ']},';
        //geoJson = geoJson + json.latitude + "," + json.longitude;
        //var geoJsonClose = ']}};';
        //geoJson = geoJson + geoJsonClose;
        var x1,x2,y1,y2;
        if(this.lat1 >= this.lat2){
            x1 = this.lat1;
            x2 = this.lat2;
        }
        else{
            x1 = this.lat2;
            x2 = this.lat1;
        }
        if (this.long1 >= this.long2){
            y2 = this.long1;
            y1 = this.long2;
        }
        else{
            y1 = this.long1;
            y2 = this.long2;
        }
        //console.log(d);
        if (x1 == 0) {
            stationArray.forEach(function (d) {

                geoJson = geoJson + geoJsonInter + d.longitude + "," + d.latitude + geoJsonInterClose;
                // console.log(geoJson)
            });
        }
        else{
            stationArray.forEach(function (d) {
                if(d.latitude <= x1 && d.latitude >= x2 && d.longitude <= y2 && d.longitude >= y1) {
                    geoJson = geoJson + geoJsonInter + d.longitude + "," + d.latitude + geoJsonInterClose;
                }
            });
        }
        geoJson = geoJson.substr(0, geoJson.length - 1);        //removing the trailing comma in the end
        //console.log(geoJson);
        geoJson = $.parseJSON(geoJson + "]}");
        return geoJson;
    },
    getFoodData: function(url, layerName, mode){
        var jsonHolder = null;

    }

});