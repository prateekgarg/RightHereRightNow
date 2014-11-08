/**
 * Created by PB on 11/6/2014.
 */
var BusApp = Class.extend({
    construct: function () {

        this.phpProxy = "/ba-simple-proxy.php?url=";
        this.baseUrl = "http://www.ctabustracker.com/bustime/api/v1/";
        this.apiKey = "?key=8xwSBP7tg2XKh79UV3Us3UvF4";
        this.time = null;
        this.routes = null;

    },

    /////////////////////////////////////////////////////////////
    init: function(){
        this.baseUrl = this.convertProxyString(this.baseUrl);
        this.apiKey = this.convertProxyString(this.apiKey);

        this.fetchTime();
        this.fetchRoutes();


    },

    /////////////////////////////////////////////////////////////
    convertProxyString: function(string) {
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
            } else {
                builderString = builderString + currentChar;
            }
        }
        return builderString;
    },

    /////////////////////////////////////////////////////////////
    fetchTime: function() {
        var requestUrl = this.phpProxy + this.baseUrl + "gettime" + this.apiKey;

        // TODO - node js express, to get around the exeption

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.onload = function() {
            var responce = xhr.responseText;
            console.log(responce);
        };
        xhr.send();


        /*
        d3.xml(requestUrl, function(error, data){

            console.log(data);
            this.time = data;

        });
        */
    },

    /////////////////////////////////////////////////////////////
    fetchVehiclesByVid: function(vid) {
        var requestUrl = this.baseUrl + "getvehicles" + this.apiKey + "?vid=" + vid;

        d3.xml(requestUrl, function(error, data){

            console.log(data);

        });
    },

    fetchVehiclesByRt: function(rt) {
        var requestUrl = this.baseUrl + "getvehicles" + this.apiKey + "?rt=" + rt;

        d3.xml(requestUrl, function(error, data){

            console.log(data);

        });
    },

    /////////////////////////////////////////////////////////////
    fetchRoutes: function (){
        var requestUrl = this.baseUrl + "getroutes" + this.apiKey;

        d3.xml(requestUrl, function(error, data){

            console.log(data);
            this.routes = data;

        });

    }
});