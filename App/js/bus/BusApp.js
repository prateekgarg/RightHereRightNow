/**
 * Created by PB on 11/6/2014.
 */
var BusApp = Class.extend({
    construct: function () {

        this.baseUrl = "http://www.ctabustracker.com/bustime/api/v1/";
        this.apiKey = "?key=8xwSBP7tg2XKh79UV3Us3UvF4"
        this.time = null;


    },

    /////////////////////////////////////////////////////////////
    init: function(){
      this.fetchRoutes();
    },

    /////////////////////////////////////////////////////////////
    fetchTime: function() {
        var requestUrl = this.baseUrl + "gettime" + this.apiKey;

        d3.xml(requestUrl, function(error, data){

            console.log(data);

        });
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

        });

    }
});