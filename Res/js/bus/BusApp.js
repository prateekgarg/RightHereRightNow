/**
 * Created by PB on 11/6/2014.
 */
var BusApp = Class.extend({
    construct: function () {

        //
        BusApp.phpProxy = "/cs424proj3/Res/libraries/ba-simple-proxy.php?url=";
        BusApp.baseUrl = "http://www.ctabustracker.com/bustime/api/v1/";
        BusApp.apiKey = "?key=8xwSBP7tg2XKh79UV3Us3UvF4";
        BusApp.timeXML = null;
        BusApp.routesXML = null;
        BusApp.time = null;
        BusApp.routes = new Array();
        BusApp.busPackages = new Array();

        BusApp.busPackCount = 0;


        /////////////////////////////////////////////////////////////
        BusApp.fetchTime = function () {
            var requestUrl = BusApp.baseUrl + "gettime" + BusApp.apiKey;
            requestUrl = BusApp.phpProxy + BusApp.convertProxyString(requestUrl);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', requestUrl);

            var callback = function(response) {
                var responseJSON = jQuery.parseJSON( response );
                var contentsXML = jQuery.parseXML(responseJSON.contents);
                BusApp.timeXML = contentsXML;

                var tm = contentsXML.getElementsByTagName("tm");
                BusApp.time = tm[0].childNodes[0].nodeValue;
            };

            xhr.onload = function() {
                callback(xhr.responseText);
                console.log("Fetch - Time: " + BusApp.time);
            }

            xhr.send();
        };

        /////////////////////////////////////////////////////////////
        BusApp.fetchRoutes = function () {
            var requestUrl = BusApp.baseUrl + "getroutes" + BusApp.apiKey;
            requestUrl = BusApp.phpProxy + BusApp.convertProxyString(requestUrl);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', requestUrl);

            var callback = function(response) {
                var responseJSON = jQuery.parseJSON( response );
                var contentsXML = jQuery.parseXML(responseJSON.contents);
                BusApp.routesXML = contentsXML;

                var rt = contentsXML.getElementsByTagName("rt");
                for (var i = 0; i < rt.length; i++) {
                    BusApp.routes.push(rt[i].childNodes[0].nodeValue);
                }

                BusApp.fetchAllBuses();
            }

            xhr.onload = function() {
                callback(xhr.responseText);
                console.log("Fetch - Routes: " + BusApp.routes);
            }

            xhr.send();
        };

        /////////////////////////////////////////////////////////////
        BusApp.fetchAllBuses = function() {
            var rtValues = "";
            BusApp.busPackCount = Math.ceil(BusApp.routes.length / 10);
            for (var i = 0; i < BusApp.routes.length; i = i + 10) {
                rtValues = BusApp.routes[i] + ","
                + BusApp.routes[i+1] + ","
                + BusApp.routes[i+2] + ","
                + BusApp.routes[i+3] + ","
                + BusApp.routes[i+4] + ","
                + BusApp.routes[i+5] + ","
                + BusApp.routes[i+6] + ","
                + BusApp.routes[i+7] + ","
                + BusApp.routes[i+8] + ","
                + BusApp.routes[i+9];
                BusApp.fetchVehiclesByRt(rtValues);
            }
        };

        /////////////////////////////////////////////////////////////
        BusApp.fetchVehiclesByRt = function(rt) {
            var requestUrl = BusApp.baseUrl + "getvehicles" + BusApp.apiKey + "&rt=" + rt;
            requestUrl = BusApp.phpProxy + BusApp.convertProxyString(requestUrl);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', requestUrl);

            var callback = function(response) {
                var responseJSON = jQuery.parseJSON( response );
                var contentsXML = jQuery.parseXML(responseJSON.contents);

                var contentsJSON = $.xml2json(contentsXML, true);
                BusApp.busPackages.push(contentsJSON);
                BusApp.busPackCount--;
                if (BusApp.busPackCount == 0) {
                    console.log("All buses fetched");
                    console.log("All buses: " + BusApp.busPackages);
                }
            };

            xhr.onload = function() {
                callback(xhr.responseText);
            }

            xhr.send();

        };

        BusApp.convertProxyString = function(string) {
            var builderString = "";
            var currentChar = "";
            for (var i = 0; i < string.length; i++) {
                currentChar = string.charAt(i);
                if (currentChar == ':') {
                    builderString = builderString + "%3A";
                } else if (currentChar == '/') {
                    builderString = builderString + "%2F";
                } else if (currentChar == '?') {
                    builderString = builderString + "%3F";
                } else if (currentChar == '=') {
                    builderString = builderString + "%3D";
                } else if (currentChar == ',') {
                    builderString = builderString + "%2C";
                } else if (currentChar == '&') {
                    builderString = builderString + "%26";
                } else {
                    builderString = builderString + currentChar;
                }
            }
            return builderString;
        }

    },

    /////////////////////////////////////////////////////////////
    init: function(){

        BusApp.fetchTime();
        BusApp.fetchRoutes();

    }

});