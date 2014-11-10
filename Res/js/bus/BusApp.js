/**
 * Created by PB on 11/6/2014.
 */
var BusApp = Class.extend({
    construct: function () {

        //
        this.phpProxy = "/cs424proj3/App/php/ba-simple-proxy.php?url=";
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

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.onload = function() {
            var response = xhr.responseText;
            var responseJSON = jQuery.parseJSON( response );
            var contentsXML = jQuery.parseXML(responseJSON.contents);
            //var contentsJSON = xml2json(contentsXML);
            this.time = contentsXML;
        };
        xhr.send();
    },

    /////////////////////////////////////////////////////////////
    fetchVehiclesByVid: function(vid) {
        var requestUrl = this.baseUrl + "getvehicles" + this.apiKey + "&vid=" + vid;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.onload = function() {
            var response = xhr.responseText;
            var responseJSON = jQuery.parseJSON( response );
            var contentsXML = jQuery.parseXML(responseJSON.contents);
            //var contentsJSON = xml2json(contentsXML);
            // TODO - draw buses
        };
        xhr.send();
    },

    fetchVehiclesByRt: function(rt) {
        var requestUrl = this.baseUrl + "getvehicles" + this.apiKey + "&rt=" + rt;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.onload = function() {
            var response = xhr.responseText;
            var responseJSON = jQuery.parseJSON( response );
            var contentsXML = jQuery.parseXML(responseJSON.contents);
            //var contentsJSON = xml2json(contentsXML);
            // TODO - draw buses
        };
        xhr.send();
    },

    /////////////////////////////////////////////////////////////
    fetchRoutes: function (){
        var requestUrl = this.phpProxy + this.baseUrl + "getroutes" + this.apiKey;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl);
        xhr.onload = function() {
            var response = xhr.responseText;
            var responseJSON = jQuery.parseJSON( response );
            var contentsXML = jQuery.parseXML(responseJSON.contents);
            //var contentsJSON = xml2json(contentsXML);
            this.routes = contentsXML;
        };
        xhr.send();
    }
});