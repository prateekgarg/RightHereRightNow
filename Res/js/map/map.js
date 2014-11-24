//Created by Prateek Garg
//Some code adapted from Project 2 (Weather js mainly)

var mapClass = Class.extend({
    construct: function () {
        this.MainMap = null;
        this.mapLayer1 = null;
        this.mapLayer2 = null;
        this.mapLayer3 = null;
        this.svg = null;

        this.overlayLayers = [];

        this.MainMap = L.map('map').setView([41.8678783, -87.6304208], 15);   //41.8710977,-87.6399654
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

        this.campusFlag = false;
        this.m1 = null;
        this.m2 = null;
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
        this.lastUpdateCrime = null;

        this.iconPotholes = "./Res/icons/pothole.png";
        this.iconPotholesLastMonth = "./Res/icons/potholes01.png";
        this.iconDivvy = "./Res/icons/divvy.png";
        this.iconStreetLights = "";
        this.iconStreetLightsLastMonth = "";
        this.iconAbandonedVehicles = "./Res/icons/car.png";
        this.iconAbandonedVehiclesLastMonth = "";
        this.iconFoodInspectionPass = "";
        this.iconFoodInspectionFail = "";
        this.iconBus = "Res/icons/bus.png"
        this.busroutes1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        this.busroutes2 = [11, 12, 15, 18, 19, 20, 21, 22, 24, 26];
        this.busroutes3 = [28, 29, 30, 33, 34, 35, 36, 37, 39, 43];
        this.busroutes4 = [44, 47, 48, 49, 50, 51, 52, 53, 54, 55];
        this.busroutes5 = [56, 57, 59, 60, 62, 63, 65, 66, 67, 68];
        this.busroutes6 = [70, 71, 72, 73, 74, 75, 76, 77, 78, 79];
        this.busroutes7 = [80, 81, 82, 84, 85, 86, 87, 88, 90, 91];
        this.busroutes8 = [92, 93, 94, 96, 97, 100, 103, 106, 108, 111];
        this.busroutes9 = [112, 115, 119, 120, 121, 124, 125, 126, 132, 134];
        this.busroutes10 = [135, 136, 143, 146, 147, 148, 151, 152, 155, 156];
        this.busroutes11 = [157, 165, 169, 170, 171, 172, 192, 201, 205, 206];
        this.busroutes12 = ['8A', 'J14', '49B', '52A', '53A', '54A', '54B', '55A', '55N', '62H'];
        this.busroutes13 = ['63W', '81W', '85A', '95E', '95W', 'X98'];
        //this.CTAArray = "";
        this.timeKeeper = 0;
        this.CtaLayer = [];
        this.boxFlag = true;
        this.CTAGeoJson = {};
    },

    /////////////////////////////////////////////////////////////


    jsonToGeoJson: function (collection) {

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
            function (d) {
                try {
                    GJson = GJson + "{";
                    GJson = GJson + type + " : ";
                    GJson = GJson + FeatureLabel + ", ";
                    GJson = GJson + geometryLabel + " : {";
                    GJson = GJson + type + " : ";
                    GJson = GJson + pointLabel + ", ";
                    GJson = GJson + coordinatesLabel + " : [";
                    if (d.location) {
                        var longitude = d.location.longitude;
                        var latitude = d.location.latitude;
                        GJson = GJson + longitude + ", " + latitude + "]}, ";
                    }
                    else if (d.latitude) {    //if this, then it is divvy data
                        var longitude = d.longitude;
                        var latitude = d.latitude;
                        GJson = GJson + longitude + ", " + latitude + "]}, ";
                    }

                    else GJson = GJson + 0.00000 + ", " + 0.00000 + "]}, ";
                    GJson = GJson + propertiesLabel + " : {";

                    for (obj in d) {
                        if (obj !== "violations" && obj !== null && d[obj] !== "") {
                            if (obj !== "location") {
                                GJson = GJson + ' "' + obj + '" : "' + d[obj] + '", ';
                                continue;
                            }


                            var longitude, latitude;
                            if (d.location) {
                                longitude = d.location.longitude;
                                latitude = d.location.latitude;
                            }
                            else if (d.latitude) {
                                longitude = d.longitude;
                                latitude = d.latitude;
                            }
                            for (var locObj in d[obj]) {
                                if (locObj !== "human_address")
                                    GJson = GJson + '"location/' + locObj + '" : "' + d[obj][locObj] + '", ';
                            }
                        }
                    }

                    GJson = GJson.substring(0, GJson.length - 2);       // remove the trailing comma each time.
                    GJson = GJson + "}}, ";

                }
                catch (error) {
                    console.log("Error" + error);
                }
            }
        );
        GJson = GJson.substring(0, GJson.length - 2);       // remove comma in the end
        GJson = GJson + "]}";

        GJson = jQuery.parseJSON(GJson);

        return GJson;
    },


    /////////////////////////////////////////////////////////////

    setMap: function (setWhichMap) {

        if (setWhichMap === 1) {
            this.MainMap.removeLayer(this.mapLayer2);
            this.MainMap.removeLayer(this.mapLayer3);
            this.mapLayer1.addTo(this.MainMap);
        }
        else if (setWhichMap == 2) {
            this.MainMap.removeLayer(this.mapLayer1);
            this.MainMap.removeLayer(this.mapLayer3);
            this.mapLayer2.addTo(this.MainMap);
        }
        else {
            this.MainMap.removeLayer(this.mapLayer1);
            this.MainMap.removeLayer(this.mapLayer2);
            this.mapLayer3.addTo(this.MainMap);
        }
    },

    setOverlay: function(whichLayer){

        this.overlayLayers[whichLayer].addTo(this.MainMap);
    },

    /////////////////////////////////////////////////////////////

    getUpdatedData: function (url, layer, mode) {
        var query = url;
        var bigCollection = this.bigCollection;
        var callback = this.processData.bind(this);

        d3.json
        (
            query, function (collection) {
                bigCollection = bigCollection.concat(collection);
                callback(bigCollection, layer, mode);
            }
        );
    },

    /////////////////////////////////////////////////////////////

    processData: function (collection, newLayer, mode) {
        var parseDate = this.parseDate;
        var today = this.today;
        var myDate, daysAgo, lastWeek = -1;
        var geoJsonData;

        geoJsonData = this.jsonToGeoJson(collection);
        //}

        if (mode === 0) {
            //Potholes


            var myIcon = L.icon({
                iconUrl: 'Res/icons/pothole.png',
                iconSize: [25, 25],
                //iconAnchor: [22, 94],
                popupAnchor: [-3, -76]

            });


            // Plot the ones in the last month.
            //geoJsonData = jQuery.parseJSON(geoJsonData);
            L.geoJson(geoJsonData, {
                filter: function (feature, layers) {

                    var status = feature.properties.status;
                    if (status === "STATUS") return false;
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;

                    return daysAgo <= 31;
                },
                pointToLayer: function (feature, latlng) {
                    //myDate = parseDate(feature.properties.creation_date);
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    if (daysAgo <= 7) {
                        return L.marker(latlng, {
                            icon: myIcon
                        }).bindPopup("Status: " + feature.properties.status + '<br>Where: ' + feature.properties.street_address, {autopan : true});
                    }
                    else if (daysAgo <= 31) {

                        return L.marker(latlng, {
                            icon: myIcon,
                            opacity: 0.7
                        }).bindPopup("Status: " + feature.properties.status + '<br>Where: ' + feature.properties.street_address, {autopan : true});
                    }

                }
            }).addTo(newLayer);
        }
        if (mode === 1) {
            //Abandoned Vehicles

            var myIcon = L.icon({
                iconUrl: 'Res/icons/carM.png',
                iconSize: [25, 25],
                //iconAnchor: [22, 94],
                popupAnchor: [-3, -76]

            });
            // tested, works fine
            L.geoJson(geoJsonData, {
                filter: function (feature, layers) {
                    var status = feature.properties.status;
                    if (status === "STATUS") return false;
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;

                    return daysAgo <= 31;
                },
                pointToLayer: function (feature, latlng) {
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    if (daysAgo <= 7) {
                        return L.marker(latlng, {
                            icon: myIcon

                        }).bindPopup("Status: " + feature.properties.status + '<br>Where: ' + feature.properties.street_address, {autopan : true});
                    }
                    else if (daysAgo <= 31) {

                        return L.marker(latlng, {
                            icon: myIcon,
                            opacity: 0.7
                        }).bindPopup("Status: " + feature.properties.status + '<br>Where: ' + feature.properties.street_address, {autopan : true});
                    }

                }
            }).addTo(newLayer);
        }
        if (mode === 2) {
            //Streetlights
            daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;

            var myIcon = L.icon({
                iconUrl: 'Res/icons/streetlightM.png',
                iconSize: [35, 35],
                //iconAnchor: [22, 94],
                popupAnchor: [-3, -76]

            });
            // Plot the ones in the last month.

            L.geoJson(geoJsonData, {
                filter: function (feature, layers) {

                    var status = feature.properties.status;
                    if (status === "STATUS") return false;
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;

                    return daysAgo <= 31;
                },
                pointToLayer: function (feature, latlng) {
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    if (daysAgo <= 7) {
                        return L.marker(latlng, {
                            icon: myIcon
                        }).bindPopup("Status: " + feature.properties.status + '<br>Where: ' + feature.properties.street_address, {autopan : true});
                    }
                    else if (daysAgo <= 31) {

                        return L.marker(latlng, {
                            icon: myIcon,
                            opacity: 0.7
                            //color: 'red'
                        }).bindPopup("Status: " + feature.properties.status + '<br>Where: ' + feature.properties.street_address, {autopan : true});
                    }

                }
            }).addTo(newLayer);
        }
        if (mode === 3) {
            //Potholes

            daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;


            L.geoJson(geoJsonData, {
                filter: function (feature, layers) {

                    var status = feature.properties.status;
                    if (status === "STATUS") return false;
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;

                    return daysAgo <= 31;
                },
                pointToLayer: function (feature, latlng) {
                    myDate = parseDate(feature.properties.creation_date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    if (daysAgo <= 7) {
                        return L.marker(latlng, {
                            icon: L.AwesomeMarkers.icon({
                                icon: 'coffee',
                                markerColor: 'orange',
                                prefix: 'fa',
                                iconColor: 'black'
                            })
                        });
                    }
                    else if (daysAgo <= 31) {
                        return L.marker(latlng, {
                            icon: L.AwesomeMarkers.icon({
                                icon: 'coffee',
                                markerColor: 'orange',
                                prefix: 'fa',
                                iconColor: 'white'
                            })
                        });
                    }

                }
            }).addTo(newLayer);
        }

        if (mode === 5) {

            L.geoJson(geoJsonData, {
                filter: function (feature, layers) {
                    myDate = parseDate(feature.properties.date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    // console.log("days ago : " + daysAgo);
                    return daysAgo <= 20;          //Filter for result for around 6 months ago only
                },
                pointToLayer: function (obj, latlng) {
                    myDate = parseDate(obj.properties.date);
                    daysAgo = (today - myDate) / 1000 / 60 / 60 / 24;
                    var status = obj.properties.description;

                    if (daysAgo <= 15) {                  // Only few number of cases in past 7 days usually
                        if (status !== "FIRST DEGREE MURDER") {
                            switch (obj.properties.primary_type) {
                                case "THEFT" :
                                case"BURGLARY":
                                case "MOTOR VEHICLE THEFT":
                                case "ROBBERY":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'red',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;
                                case "ASSAULT":
                                case "HOMICIDE":
                                case "CRIM SEXUAL ASSAULT":
                                case "BATTERY":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'red',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;
                                case "CRIMINAL DAMAGE":
                                case "CRIMINAL TRESPASS":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'red',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;

                                case "NARCOTICS":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'red',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;

                                case "DECEPTIVE PRACTICE":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'red',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;

                                default:
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'warning',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;
                            }
                        }

                    }
                    else if(daysAgo <= 31){
                        if (status !== "FIRST DEGREE MURDER") {
                            switch (obj.properties.primary_type) {
                                case "THEFT" :
                                case"BURGLARY":
                                case "MOTOR VEHICLE THEFT":
                                case "ROBBERY":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;
                                case "ASSAULT":
                                case "HOMICIDE":
                                case "CRIM SEXUAL ASSAULT":
                                case "BATTERY":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'wrench',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;
                                case "CRIMINAL DAMAGE":
                                case "CRIMINAL TRESPASS":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;

                                case "NARCOTICS":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;

                                case "DECEPTIVE PRACTICE":
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'gavel',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;

                                default:
                                    return L.marker(latlng, {
                                        icon: L.AwesomeMarkers.icon({
                                            icon: 'warning',
                                            markerColor: 'orange',
                                            prefix: 'fa',
                                            iconColor: 'white'
                                        })
                                    }).bindPopup("Crime: " + obj.properties.primary_type + '<br>Subtype: ' + status);
                                    break;
                            }
                        }

                    }

                }
            }).addTo(newLayer);
        }

    },

    /////////////////////////////////////////////////////////////

    refreshData: function () {
        console.log("This should come after every minute")

        if (this.campusFlag && !this.areaFlag) {
            this.overlayLayers[0].clearLayers();
            this.overlayLayers[1].clearLayers();
            this.overlayLayers[2].clearLayers();
            this.overlayLayers[3].clearLayers();
            this.overlayLayers[4].clearLayers();
            this.overlayLayers[5].clearLayers();
            this.overlayLayers[6].clearLayers();

            if (this.MainMap.hasLayer(this.Rect)) {
                this.MainMap.removeLayer(this.Rect);
                if (this.MainMap.hasLayer(this.m1)) {
                    this.MainMap.removeLayer(this.m1);
                }
                if (this.MainMap.hasLayer(this.m2)) {
                    this.MainMap.removeLayer(this.m2);
                }
            }
            this.lat1 = 41.8757207;
            this.long1 = -87.6603623;
            this.lat2 = 41.8577444;
            this.long2 = -87.6112346;

            this.getUpdatedData("http://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ") AND (status%20=%20%27Completed%27%20OR%20status%20=%20%27Open%27)&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[0], 0);

            this.getUpdatedData("http://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[1], 1);

            this.getUpdatedData(
                "http://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
                "," + this.long2 + ")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[2], 2);
            this.getUpdatedData(
                "http://data.cityofchicago.org/resource/4ijn-s7e5.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
                "," + this.long2 + ")&$order=inspection_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[4], 4);

            this.DivvyJson("http://www.divvybikes.com/stations/json", this.lat1, this.long1, this.lat2, this.long2);
            this.getUpdatedData("http://data.cityofchicago.org/resource/ijzp-q8t2.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ")&$order=date DESC&$limit=5000&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[5], 5);


        }
        else if (this.areaFlag && !this.campusFlag) {
            this.overlayLayers[0].clearLayers();
            this.overlayLayers[1].clearLayers();
            this.overlayLayers[2].clearLayers();
            this.overlayLayers[3].clearLayers();
            this.overlayLayers[4].clearLayers();
            this.overlayLayers[5].clearLayers();
            this.overlayLayers[6].clearLayers();

            this.getUpdatedData("http://data.cityofchicago.org/resource/7as2-ds3y.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ") AND (status%20=%20%27Completed%27%20OR%20status%20=%20%27Open%27)&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[0], 0);

            this.getUpdatedData("http://data.cityofchicago.org/resource/3c9v-pnva.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[1], 1);

            this.getUpdatedData("http://data.cityofchicago.org/resource/zuxi-7xem.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ")&$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[2], 2);
            this.getUpdatedData("http://data.cityofchicago.org/resource/4ijn-s7e5.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ")&$order=inspection_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[4], 4);

            this.getUpdatedData("http://data.cityofchicago.org/resource/ijzp-q8t2.json?$where=within_box(location," + this.lat1 + "," + this.long1 + "," + this.lat2 +
            "," + this.long2 + ")&$order=date DESC&$limit=5000&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[5], 5);

            this.DivvyJson("http://www.divvybikes.com/stations/json", this.lat1, this.long1, this.lat2, this.long2);
        }
        else if (!this.areaFlag && !this.campusFlag) {
            this.overlayLayers[0].clearLayers();
            this.overlayLayers[1].clearLayers();
            this.overlayLayers[2].clearLayers();
            this.overlayLayers[3].clearLayers();
            this.overlayLayers[4].clearLayers();
            this.overlayLayers[5].clearLayers();
            this.overlayLayers[6].clearLayers();

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
            this.getUpdatedData("http://data.cityofchicago.org/resource/7as2-ds3y.json?$order=creation_date%20DESC&$limit=2000&$where=status%20=%20%27Completed%27%20OR%20status%20=%20%27Open%27&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca",
                this.overlayLayers[0], 0);

            this.getUpdatedData("http://data.cityofchicago.org/resource/3c9v-pnva.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[1], 1);

            this.getUpdatedData("http://data.cityofchicago.org/resource/zuxi-7xem.json?$order=creation_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[2], 2);
            this.getUpdatedData("http://data.cityofchicago.org/resource/4ijn-s7e5.json?$order=inspection_date DESC&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[4], 4);
            //$.getJSON(url, jsonHolder, callBack);
            this.DivvyJson("http://www.divvybikes.com/stations/json", 0, 0);
            this.CTAData("http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=8xwSBP7tg2XKh79UV3Us3UvF4&rt=");
            this.getUpdatedData("http://data.cityofchicago.org/resource/ijzp-q8t2.json?$order=date DESC&$limit=5000&$$app_token=xjk2V2sZjI0r5ZuTUNSE0rLca", this.overlayLayers[5], 5);
        }

    },

    init: function () {

        for (var index = 0; index < this.overlayLayers.length; index++) {
            if (this.MainMap.hasLayer(this.overlayLayers[index])) {
                this.MainMap.removeLayer(this.overlayLayers[index]);
            }
        }
        if (this.MainMap.hasLayer(this.mapLayer1))
            this.MainMap.removeLayer(this.mapLayer1);

        if (this.MainMap.hasLayer(this.mapLayer2))
            this.MainMap.removeLayer(this.mapLayer2);
        if (this.MainMap.hasLayer(this.mapLayer3))
            this.MainMap.removeLayer(this.mapLayer3);

        this.overlayLayers = [];

        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());
        this.overlayLayers.push(new L.LayerGroup());

        for (var i = 0; i < 13; i++) {
            this.CtaLayer.push(new L.LayerGroup());
        }

        var baseLayers = {
            "Aerial": this.mapLayer1,
            "Map": this.mapLayer2,
            "StreetView": this.mapLayer3
        };

        var overlays = {
            "Potholes": this.overlayLayers[0],
            "Abandoned Vehicles": this.overlayLayers[1],
            "Street Lights": this.overlayLayers[2],
            "Divvy Stands": this.overlayLayers[3],
            //"Food Inspection": this.overlayLayers[4],
            "Crime": this.overlayLayers[5],
            "CTA Bus": this.overlayLayers[6]
        };
        //setInterval(this.refreshData(), 60 * 1000);
        this.campusFlag = true;
        this.areaFlag = false;
        this.refreshData();
        //setInterval(function() {mapClass.refreshData() }, 60*1000);
        L.control.layers(baseLayers, overlays, {collapsed: false, position: 'bottomright'}).addTo(this.MainMap);

        var functionCallHere = this.MapClicked.bind(this);
        this.MainMap.addLayer(this.mapLayer3);
        this.MainMap.addLayer(this.overlayLayers[0]);


        this.MainMap.on('click', function (e) {
            functionCallHere(e.latlng.lat, e.latlng.lng, e.latlng);
        });

        var sidebar = L.control.sidebar('sidebar').addTo(this.MainMap);
        //overlays.addTo(sidebar);

    },
    MapClicked: function (latitude, longitude, latlong) {

        var counter = this.popupCounter;

        if (counter == 0) {
            this.lat1 = latitude;
            this.long1 = longitude;
            this.m1 = L.marker(latlong);
            counter = 1;
            this.popupCounter = counter;
            this.m1.addTo(this.MainMap);
        }
        else if (counter == 1) {
            if (this.lat1 > latitude)
                this.lat2 = latitude;
            else {
                this.lat2 = this.lat1;
                this.lat1 = latitude;
            }

            if (this.long1 < longitude)
                this.long2 = longitude;
            else {
                this.long2 = this.long1;
                this.long1 = longitude;
            }
            this.m2 = L.marker(latlong);
            this.m2.addTo(this.MainMap);

            counter = 3;
            //console.log("Counter = " + counter);
            this.popupCounter = counter;
            this.areaFlag = true;
            this.campusFlag = false;
            this.refreshData();
    //        this.CTAOnMap();
            this.printCTAonMap();
            if (this.boxFlag) {
                this.drawRect();
            }
            else{
                this.drawRouteStuff();
            }
        }
        else {
            this.MainMap.removeLayer(this.m2);
            this.MainMap.removeLayer(this.m1);
// 426684
            this.MainMap.removeLayer(this.Rect);
            counter = 0;
            // console.log("Counter2 = " + counter);
            this.popupCounter = 0;
            this.Rect.hide();
            $('path').remove('.leaflet-clickable');
            //$('div').remove('.leaflet-marker-pane');
            $('img').remove('.leaflet-marker-icon');
            $('img').remove('.leaflet-marker-shadow');
        }


    },
    limitView: function () {
        this.campusFlag = true;
        this.areaFlag = false;
        this.refreshData();
    },
    fullView: function () {
        this.campusFlag = false;
        this.areaFlag = false;
        this.refreshData();
    },
    drawRect: function () {
        var x1 = this.lat1,
            x2 = this.lat2,
            y1 = this.long1,
            y2 = this.long2;
        latlngs = [[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]];

        this.Rect = L.Routing.control({
            waypoints: [L.latLng(x1, y1), L.latLng(x2, y2)],
            fitSelectedRoutes: false
        });

        this.Rect.addTo(this.MainMap);
        //$('div').hide('.leaflet-routing-container-hide');

        L.polyline(latlngs, {color: 'red'}).addTo(this.MainMap);
        //this.Rect.hide();

    },
    getStationOnMap: function (json, layerVariable) {


        L.geoJson(json, {
                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: L.AwesomeMarkers.icon({
                            prefix: 'fa',
                            icon: 'bicycle',
                            markerColor: 'blue',
                            iconColor: 'white'
                        })
                    });
                }
            }
        ).addTo(layerVariable);
        //layerVariable.addTo(this.MainMap);
    },
    DivvyData: function (data, newLayer) {


        var stationList = data.stationBeanList;
        var reqGeo = this.convertDivvyJsonToGeoJson(stationList);

        this.getStationOnMap(reqGeo, this.overlayLayers[3]);
    },

    DivvyJson: function (site, lat1, long1, lat2, long2) {

        var callback = this.DivvyData.bind(this);
        requestCrossDomainJSON(site, callback);

    },
    convertDivvyJsonToGeoJson: function (stationArray) {
        //console.log("Divvy : " + json);
        var geoJson = '{"type": "GeometryCollection", "geometries": [';
        var geoJsonInter = '{"type": "Point","coordinates":[';
        var geoJsonInterClose = ']},';
        //geoJson = geoJson + json.latitude + "," + json.longitude;
        //var geoJsonClose = ']}};';
        //geoJson = geoJson + geoJsonClose;
        var x1, x2, y1, y2;
        if (this.lat1 >= this.lat2) {
            x1 = this.lat1;
            x2 = this.lat2;
        }
        else {
            x1 = this.lat2;
            x2 = this.lat1;
        }
        if (this.long1 >= this.long2) {
            y2 = this.long1;
            y1 = this.long2;
        }
        else {
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
        else {
            stationArray.forEach(function (d) {
                if (d.latitude <= x1 && d.latitude >= x2 && d.longitude <= y2 && d.longitude >= y1) {
                    geoJson = geoJson + geoJsonInter + d.longitude + "," + d.latitude + geoJsonInterClose;
                }
            });
        }
        geoJson = geoJson.substr(0, geoJson.length - 1);        //removing the trailing comma in the end
        //console.log(geoJson);
        geoJson = $.parseJSON(geoJson + "]}");
        return geoJson;
    },
    CTAData: function (geturl) {

        // I was too tired to make a 2D array and do it like a nirmal human being :/

        var callback = this.printStuff.bind(this);
        var url = geturl;

        for (var i = 0; i < this.busroutes1.length; i++) {
            url = url + this.busroutes1[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes2.length; i++) {
            url = url + this.busroutes2[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes3.length; i++) {
            url = url + this.busroutes3[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes4.length; i++) {
            url = url + this.busroutes4[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes5.length; i++) {
            url = url + this.busroutes5[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes6.length; i++) {
            url = url + this.busroutes6[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes7.length; i++) {
            url = url + this.busroutes7[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes8.length; i++) {
            url = url + this.busroutes8[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes9.length; i++) {
            url = url + this.busroutes9[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes10.length; i++) {
            url = url + this.busroutes10[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes11.length; i++) {
            url = url + this.busroutes11[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes12.length; i++) {
            url = url + this.busroutes12[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);
        var url = geturl;

        for (var i = 0; i < this.busroutes13.length; i++) {
            url = url + this.busroutes13[i] + ',';
        }
        url = url.substr(0, url.length - 1);  //remove the trailing comma
        requestxmldata(url, callback);

    },

    printStuff: function (data) {

        var vehicles = data['bustime-response'];
        //vehiclesArray = jQuery.parseJSON(vehiclesArray);
       // if (vehicles.vehicle.length > 0) {
            var vehiclesArray = vehicles.vehicle;


            var geoJsonData = '{"type": "GeometryCollection", "geometries": [';
            var geoJsonInter = '{"type": "Point","coordinates":[';
            var geoJsonInterClose = ']},';


            vehiclesArray.forEach(function (d) {
                //console.log(d);
                geoJsonData = geoJsonData + geoJsonInter + d.lon + "," + d.lat + geoJsonInterClose;
                // console.log(geoJson)
            });

            geoJsonData = geoJsonData.substr(0, geoJsonData.length - 1);        //removing the trailing comma in the end
            //console.log(geoJson);
            geoJsonData = $.parseJSON(geoJsonData + "]}");
            this.CTAGeoJson = geoJsonData;
        if(geoJsonData.hasOwnProperty('geometries')) {
            this.printCTAonMap();
        }
       // }
        },
        printCTAonMap: function(){
            var geoJsonData = this.CTAGeoJson;
            var counter = this.timeKeeper;

            var x1, x2, y1, y2;
            if (this.lat1 >= this.lat2) {
                x1 = this.lat1;
                x2 = this.lat2;
            }
            else {
                x1 = this.lat2;
                x2 = this.lat1;
            }
            if (this.long1 >= this.long2) {
                y2 = this.long1;
                y1 = this.long2;
            }
            else {
                y1 = this.long1;
                y2 = this.long2;
            }
            if(geoJsonData.hasOwnProperty('geometries')) {
                L.geoJson(geoJsonData, {
                    filter: function (features, layers) {
                        var feature = features.geometries;
                        if (x1 !== 0) {
                            feature.forEach(function (d) {
                                {
                                    if (d.coordinates[1] <= x1 && d.coordinates[0] <= y2 && d.coordinates[1] >= x2 && d.coordinates[0] >= y1)
                                        return true;
                                }
                            });
                        }
                        else return true;
                    },

                    pointToLayer: function (feature, latlng) {
                        // myDate = parseDate(feature.properties.creation_date);
                        //console.log(latlng);
                        return L.marker(latlng, {
                            icon: L.AwesomeMarkers.icon({
                                prefix: 'fa',
                                icon: 'bus',
                                markerColor: 'blue',
                                iconColor: 'white'
                            })
                        });

                    }
                }).addTo(this.CtaLayer[counter]);
            }
            this.timeKeeper++;
            if (this.timeKeeper === 13) {
                this.timeKeeper = 0;
                for (var i = 0; i < 13; i++)
                    this.CtaLayer[i].addTo(this.overlayLayers[6]);
            }

        }



});