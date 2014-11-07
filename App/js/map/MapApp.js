var MapApp = Class.extend({
    construct: function () {
        this.map = null;
        this.map1 = null;
        this.map2 = null;
        this.map3 = null;
        this.svg = null;

        this.layers = [];

        this.map = L.map('map').setView([41.8678783,-87.6304208], 15);   //41.8710977,-87.6399654
        this.map._initPathRoot();

        this.mapURL3 = 'https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png';
        this.mapCopyright3 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

        this.mapURL2 = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
        this.mapCopyright2 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

        this.mapURL1 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        this.mapCopyright1 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

        this.map1 = L.tileLayer(this.mapURL1, {attribution: this.mapCopyright1});
        this.map2 = L.tileLayer(this.mapURL2, {attribution: this.mapCopyright2});
        this.map3 = L.tileLayer(this.mapURL3, {attribution: this.mapCopyright3});

        this.parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
        this.today = new Date();
        this.bigCollection = [];
        this.popupCounter = 0;
        this.UicTopLeftCoordinate = [41.8757207,-87.6603623];
        this.MuseumCampusCoordiantes = [41.8577444,-87.6112346];
        this.customMapLayer = null;

        this.campusFlag = false;
        this.m1 = null;
        this.m2 = null ;
        this.lat1 = 0;
        this.lat2 = 0;
        this.long1 = 0;
        this.long2 = 0;
        this.Rect = null;
        this.areaFlag = false;
        this.divvyData = null;
    },

    /////////////////////////////////////////////////////////////

    toGeoJson: function(collection){
        var type = '"type"';
        var featureCollectionLabel = '"FeatureCollection"';

        var FeatureLabel = '"Feature"';
        var featuresLabel = '"features"';
        var geometryLabel = '"geometry"';

        var pointLabel = '"Point"';
        var coordinatesLabel = '"coordinates"';
        var propertiesLabel = '"properties"';

        var geoJson = "{" + type + ":" + featureCollectionLabel + ",";
        geoJson = geoJson + featuresLabel + ":[";

        collection.forEach
        (
            function(d)
            {
                geoJson = geoJson + "{";
                geoJson = geoJson + type + ":";
                geoJson = geoJson + FeatureLabel + ",";
                geoJson = geoJson + geometryLabel + ":{";
                geoJson = geoJson + type + ":";
                geoJson = geoJson + pointLabel + ",";
                geoJson = geoJson + coordinatesLabel + ":[";
                if(d.location){
                    var longitude = d.location.longitude;
                    var latitude = d.location.latitude;
                    geoJson = geoJson + longitude + "," + latitude + "]},";
                } else geoJson = geoJson + 0.00000 + "," + 0.00000 + "]},";
                geoJson = geoJson + propertiesLabel + ":{";
                for( obj in d ){
                    if(obj !== "location"){
                        geoJson = geoJson + '"' + obj + '":"' + d[obj] + '",';
                        continue;
                    }
                    if(! d.location){
                        geoJson = geoJson +
                            '"location/needs_recoding":"","location/longitude":"","location/latitude":"",';
                        continue;
                    }
                    var longitude = d.location.longitude;
                    var latitude = d.location.latitude;
                    for(var locObj in d[obj]){
                        geoJson = geoJson + '"location/' + locObj + '":"' + d[obj][locObj] + '",';
                    }
                }
                geoJson = geoJson.substring(0, geoJson.length - 1);
                geoJson = geoJson + "}},";

            }
        );
        geoJson = geoJson.substring(0, geoJson.length - 1);
        geoJson = geoJson + "]}";
        geoJson = jQuery.parseJSON(geoJson);
        return geoJson;
    },

    /////////////////////////////////////////////////////////////

    setMap: function(whichMap) {
        var selectedOnes = null;

        if (whichMap === 1)
        {
            this.map.removeLayer(this.map2);
            this.map.removeLayer(this.map3);
            this.map1.addTo(this.map);

            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "white");
        }
        else if (whichMap == 2)
        {
            this.map.removeLayer(this.map1);
            this.map.removeLayer(this.map3);
            this.map2.addTo(this.map);

            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "black");
        }
        else{
            this.map.removeLayer(this.map1);
            this.map.removeLayer(this.map2);
            this.map3.addTo(this.map);

            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "black");
        }
    },

    /////////////////////////////////////////////////////////////

    getNewData: function(url, layer, mode){
        var callback = this.processData.bind(this);
        var query = url;
        var bigCollection = this.bigCollection;

        d3.json
        (
            query, function(collection)
            {
                bigCollection = bigCollection.concat(collection);
                callback(bigCollection, layer, mode);
            }
        );
    },

    /////////////////////////////////////////////////////////////

    processData: function(collection, aNewLayer, mode){
        var parseDate = this.parseDate;
        var today = this.today;

        var geoJsonData = this.toGeoJson(collection);
        var geojsonMarkerOptions = {
            radius: 8,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        L.geoJson(geoJsonData, {
            filter: function(feature, layers) {
                var status = feature.properties.status;
                if(status === "STATUS") return false;
                var myDate = parseDate(feature.properties.creation_date);
                var daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                return daysAgo <= 31;
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            style: function(feature) {
                var myDate = parseDate(feature.properties.creation_date);
                var daysAgo = (today - myDate)/1000/60/60/24;
                var inLastWeek = 0;
                if(daysAgo <= 7) inLastWeek = 1;
                if(mode === 0){
                    switch (inLastWeek) {
                        case 1:
                            return {color: "#050A4A"};
                        case 0:
                            return {color: "#4A0522"};
                    }
                } else if(mode === 1){
                    switch (inLastWeek) {
                        case 1:
                            return {color: "#054A0E"};
                        case 0:
                            return {color: "#10DE2B"};
                    }
                } else if(mode=== 2){
                    switch (inLastWeek) {
                        case 1:
                            return {color: "#820F96"};
                        case 0:
                            return {color: "#0B010D"};
                    }
                }
                else{
                    return {color: "#BBBBBB"};
                }
            }
        }).addTo(aNewLayer);
    },

    /////////////////////////////////////////////////////////////

    refreshData: function()
    {

        if (this.campusFlag && !this.areaFlag) {
            this.layers[0].clearLayers();
            this.layers[1].clearLayers();
            this.layers[2].clearLayers();
            this.layers[3].clearLayers();

            if(this.map.hasLayer(this.Rect)){
                this.map.removeLayer(this.Rect);
                if(this.map.hasLayer(this.m1)){
                    this.map.removeLayer(this.m1);
                }
                if(this.map.hasLayer(this.m2)){
                    this.map.removeLayer(this.m2);
                }
            }
            this.lat1 = 41.8757207;
            this.long1 = -87.6603623;
            this.lat2 = 41.8577444;
            this.long2 = -87.6112346;

            this.getNewData(
                "http://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location,41.8757207,-87.6603623,41.8577444,-87.6112346)&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[0], 0);

            this.getNewData(
                "http://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location,41.8757207,-87.6603623,41.8577444,-87.6112346)&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[1], 1);

            this.getNewData(
                "http://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location,41.8757207,-87.6603623,41.8577444,-87.6112346)&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[2], 2);
            //this.plotDivvy("http://www.divvybikes.com/stations/json/", 1);
            this.plotDivvy("App/json/experiment/stations.json", 3);

        }
        else if(this.areaFlag && !this.campusFlag){
            this.layers[0].clearLayers();
            this.layers[1].clearLayers();
            this.layers[2].clearLayers();
            this.layers[3].clearLayers();


            this.getNewData(
                "http://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[0], 0);

            this.getNewData(
                "http://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[1], 1);

            this.getNewData(
                "http://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location,"+this.lat1+","+ this.long1 +","+this.lat2+
                ","+this.long2 +")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[2], 2);
            //this.plotDivvy("http://www.divvybikes.com/stations/json/", 2);
            this.plotDivvy("App/json/experiment/stations.json", 3);
        }
        else if(!this.areaFlag && !this.campusFlag){
            this.layers[0].clearLayers();
            this.layers[1].clearLayers();
            this.layers[2].clearLayers();
            this.layers[3].clearLayers();

            if(this.map.hasLayer(this.Rect)){
                this.map.removeLayer(this.Rect);

                if(this.map.hasLayer(this.m1)){
                    this.map.removeLayer(this.m1);
                }
                if(this.map.hasLayer(this.m2)){
                    this.map.removeLayer(this.m2);
                }
            }

            this.getNewData(
                "http://data.cityofchicago.org/resource/7as2-ds3y.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[0], 0);

            this.getNewData(
                "http://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[1], 1);

            this.getNewData(
                "http://data.cityofchicago.org/resource/zuxi-7xem.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.layers[2], 2);
            //this.plotDivvy("http://www.divvybikes.com/stations/json/", 3);
            this.plotDivvy("App/json/experiment/stations.json", 3);


        }
        //this.map = L.map('map', {layers: [this.map1,this.layers[0]], zoomControl: false}).setView([41.869910, -87.65], 16);
        //L.control.layers(baseLayers, overlays).addTo(this.map);

    },

    init: function(){
        this.customMapLayer = new MyCustomLayer;
        for(var index = 0; index < this.layers.length; index++){
            if(this.map.hasLayer(this.layers[index])){
                this.map.removeLayer(this.layers[index]);
            }
        }
        if(this.map.hasLayer(this.map1))
            this.map.removeLayer(this.map1);

        if(this.map.hasLayer(this.map2))
            this.map.removeLayer(this.map2);
        if(this.map.hasLayer(this.map3))
            this.map.removeLayer(this.map3);

        this.layers = [];

        this.layers.push(new L.LayerGroup());
        this.layers.push(new L.LayerGroup());
        this.layers.push(new L.LayerGroup());
        this.layers.push(new L.LayerGroup());

        var baseLayers = {
            "Aerial"  : this.map1,
            "Map"	  : this.map2,
            "StreetView" : this.map3
        };

        var overlays = {
            "Potholes"  			: this.layers[0],
            "Abandoned Vehicles"	: this.layers[1],
            "Street Lights" 		: this.layers[2],
            "Divvy Stands"          : this.layers[3]
        };
        this.refreshData();
        L.control.layers(baseLayers, overlays).addTo(this.map);

        var functionCallHere = this.MapClicked.bind(this);
        this.map.addLayer(this.map3);
        this.map.addLayer(this.layers[0]);


        this.map.on('click', function(e){
            functionCallHere(e.latlng.lat, e.latlng.lng, e.latlng);
        });

    },
    MapClicked: function(latitude, longitude, latlong){

        var counter = this.popupCounter;

        if (counter == 0){
            this.lat1 = latitude;
            this.long1 = longitude;
            this.m1 = L.marker(latlong);
            counter = 1;
            this.popupCounter = counter;
            this.m1.addTo(this.map);
        }
        else if (counter == 1){
            this.lat2 = latitude;
            this.long2 = longitude;
            this.m2 =  L.marker(latlong);
            this.m2.addTo(this.map);

            counter = 3;
            this.popupCounter = counter;
            this.areaFlag = true;
            this.campusFlag = false;
            this.refreshData();
            this.drawRect();
        }
        else
        {
            this.map.removeLayer(this.m2);
            this.map.removeLayer(this.m1);
            //this.customMapLayer._reset();
            this.map.removeLayer(this.Rect);
            counter = 0;
            this.popupCounter = 0;
        }


    },
    limitView: function(){
        this.campusFlag = true;
        this.areaFlag = false;
        this.refreshData();
    },
    fullView: function(){
        this.campusFlag = false;
        this.areaFlag = false;
        this.refreshData();
    },
    drawRect: function(){
        var x1 = this.lat1,
            x2 = this.lat2,
            y1 = this.long1,
            y2 = this.long2;
        latlngs = [[x1,y1],[x2,y1],[x2,y2],[x1,y2],[x1,y1]];
        this.Rect = L.polyline(latlngs, {color: 'red'});
        this.Rect.addTo(this.map);
        //this.customMapLayer.addTo(this.map);
    },
    plotDivvy: function(urlString, modeNumber){

        var stationData;

        if (modeNumber === 1){
            //between campuses
            stationData = d3.json(urlString, function(d){


                this.divvyData = d.filter(function(json){
                    return (d.latitude <= this.lat1 &&
                    d.longitude <= this.long2 &&
                    d.latitude >= this.lat2 &&
                    d.latitude >= this.long1
                    );
                });

            });
        }
        else if (modeNumber === 2){
            //inside 2 points
            stationData = d3.json(urlString, function(d){


                this.divvyData = d.filter(function(json){
                    return (d.latitude <= this.lat1 &&
                    d.longitude <= this.long2 &&
                    d.latitude >= this.lat2 &&
                    d.latitude >= this.long1

                    );
                });

            });
        }
        else if (modeNumber === 3){
            //all
            this.divvyData = d3.json(urlString, function(d){


                this.divvyData = d;

            });
        }
        console.log(this.divvyData);

    },
    createCORSRequest: function (method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
       // xhr = null;
        xhr = new XDomainRequest();
        xhr.open(method, url);
    }
    return xhr;
}


});