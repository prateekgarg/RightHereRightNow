var MapApp = Class.extend({
    construct: function () {
        this.map = null;
        this.map1 = null;
        this.map2 = null;
        this.svg = null;

        this.layers = [];

        this.map = L.map('map').setView([41.869910, -87.65], 16);
        this.map._initPathRoot();

        this.mapURL2 = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
        this.mapCopyright2 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

        this.mapURL1 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        this.mapCopyright1 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

        this.map1 = L.tileLayer(this.mapURL1, {attribution: this.mapCopyright1});
        this.map2 = L.tileLayer(this.mapURL2, {attribution: this.mapCopyright2});

        this.parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
        this.today = new Date();
        this.bigCollection = [];
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
            this.map1.addTo(this.map);

            selectedOnes = this.svg.selectAll("text");
            selectedOnes.style("fill", "white");
        }
        else
        {
            this.map.removeLayer(this.map1);
            this.map2.addTo(this.map);

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
                var daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                var inLastWeek = 0;
                if(daysAgo <= 7) inLastWeek = 1;
                if(mode === 0){
                    switch (inLastWeek) {
                        case 1:
                            return {color: "green"};
                        case 0:
                            return {color: "yellow"};
                    }
                } else if(mode === 1){
                    switch (inLastWeek) {
                        case 1:
                            return {color: "red"};
                        case 0:
                            return {color: "brown"};
                    }
                } else {
                    switch (inLastWeek) {
                        case 1:
                            return {color: "orange"};
                        case 0:
                            return {color: "pink"};
                    }
                }
            }
        }).addTo(aNewLayer);
    },

    /////////////////////////////////////////////////////////////

    refreshData: function()
    {

        for(var index = 0; index < this.layers.length; index++){
            if(this.map.hasLayer(this.layers[index])){
                this.map.removeLayer(this.layers[index]);
            }
        }
        if(this.map.hasLayer(this.map1))
            this.map.removeLayer(this.map1);

        if(this.map.hasLayer(this.map2))
            this.map.removeLayer(this.map2);

        this.layers = [];

        this.layers.push(new L.LayerGroup());
        this.layers.push(new L.LayerGroup());
        this.layers.push(new L.LayerGroup());

        this.getNewData(
            "http://data.cityofchicago.org/resource/7as2-ds3y.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
            this.layers[0], 0);

        this.getNewData(
            "http://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
            this.layers[1], 1);

        this.getNewData(
            "http://data.cityofchicago.org/resource/zuxi-7xem.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
            this.layers[2], 2);

        //this.map = L.map('map', {layers: [this.map1,this.layers[0]], zoomControl: false}).setView([41.869910, -87.65], 16);

        this.map.addLayer(this.map1);
        this.map.addLayer(this.layers[0]);


        var baseLayers = {
            "Aerial"  : this.map1,
            "Map"	  : this.map2
        };

        var overlays = {
            "Potholes"  			: this.layers[0],
            "Abandoned Vehicles"	: this.layers[1],
            "Street Lights" 		: this.layers[2]
        };

        L.control.layers(baseLayers, overlays).addTo(this.map);
    }
});