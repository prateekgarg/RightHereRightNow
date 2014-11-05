var USWeatherApp = Class.extend({

    construct: function () {

        this.gwin = {};

        this.gwin.canvasWidth = 1200;
        this.gwin.canvasHeight = 800;

        this.gwin.latMinTemp = 26.5;
        this.gwin.latMaxTemp = 48.5;

        this.gwin.lonMinTemp = -124;
        this.gwin.lonMaxTemp = -67;

        this.gwin.boxSize = 100;

        this.gwin.appID = "";
        this.gwin.myTag = "";

        this.gwin.mode = 0;
        this.gwin.itsF = "F";

        this.gwin.projection = null;

        this.gwin.maxX = 0;
        this.gwin.maxY = 0;

        this.gwin.iconmostlycloudynight = new Image();
        this.gwin.iconpartlycloudynight = new Image();
        this.gwin.iconclearnight = new Image();
        this.gwin.iconsnow = new Image();
        this.gwin.iconunknown = new Image();
        this.gwin.iconstorms = new Image();
        this.gwin.icontstorms = new Image();
        this.gwin.iconmostlycloudy = new Image();
        this.gwin.iconpartlycloudy = new Image();
        this.gwin.iconrain = new Image();
        this.gwin.iconfog = new Image();
        this.gwin.iconhazy = new Image();
        this.gwin.iconsleet = new Image();
        this.gwin.iconcloudy = new Image();
        this.gwin.iconclear = new Image();
        this.gwin.iconsunny = new Image();
        this.gwin.iconsnownight = new Image();
        this.gwin.iconstormsnight = new Image();
        this.gwin.iconcloudynight = new Image();

        this.gwin.iconchanceflurriesnight = new Image();
        this.gwin.iconchanceflurries = new Image();
        this.gwin.iconstormschancerainnight = new Image();
        this.gwin.iconstormschancerain = new Image();
        this.gwin.iconchancesleet = new Image();

        this.gwin.iconchancesleetnight = new Image();
        this.gwin.iconchancestorms= new Image();
        this.gwin.iconchancestormsnight = new Image();

        this.gwin.iconflurriesnight = new Image();
        this.gwin.iconflurries = new Image();
        this.gwin.iconfognight = new Image();
        this.gwin.iconfog = new Image();
        this.gwin.iconrainnight = new Image();
        this.gwin.iconrain = new Image();
        this.gwin.icontstormsnight = new Image();
        this.gwin.icontstorms = new Image();
        this.gwin.iconhazynight = new Image();
        this.gwin.iconhazy = new Image();

        this.gwin.numIconsLoaded = 0;

    },
///////////////////////////////////////

    makeCallback: function (lat, lon, weatherOut)
    {
        var iconSet;
        var weather;
        var weatherIcon;
        var weatherImage;

        if((weatherOut === null) || (weatherOut.query === null) || (weatherOut.query.results === null) || (weatherOut.query.results.current_observation === null) || (weatherOut.query.results.current_observation.icons === null))
            return;

        weather = weatherOut.query.results.current_observation.temp_f;
        iconSet = weatherOut.query.results.current_observation.icons.icon_set;

        if ((weather === null) || (weather == "null") || (iconSet === null))
            return;

        weatherIcon = iconSet[8].icon_url;
        var weatherName = weatherIcon.substring(28, weatherIcon.length-4);
        var currentTime = new Date().getHours()+new Date().getMinutes()/60;

        if (weatherName === "")
            weatherName = "unknown";

        weatherImage = this.getCorrectWeatherIcon(weatherName, 0); //day

        // all of these times are computed in the local time of where computation is done
        // ie when Andy does it the numbers are all in Chicago time
        // not the time zone of the lat lon location

        // get today's sunrise and sunset times for a given lat lon today
        var times = SunCalc.getTimes(new Date(), lat, lon);
        var sunrise = times.sunrise.getHours() + times.sunrise.getMinutes()/60;
        var sunset = times.sunset.getHours() + times.sunset.getMinutes()/60;

        // correct for hawaii among others
        // need to improve this for more generality
        if (sunset < 12)
            sunset += 24;

        // if its night then swap out the sun icons for the moon icons
        if ( (currentTime < sunrise) || (currentTime > sunset) )
        {
            if ((weatherName == "mostlycloudy") || (weatherName == "partlycloudy") ||
                (weatherName == "clear")){
                weatherImage = this.getCorrectWeatherIcon(weatherName, 1); // night
            }
        }

        var self = this;

        //if (this.gwin.numIconsLoaded === 20){
        self.drawEverything(weather, weatherImage.src);
        //}
    },

///////////////////////////////////////

    updateOutsideTemp: function (lattitude,longitude)
    {
        var self = this;
        (
            function(lattitude,longitude, arrayX, arrayY){
                longitude = longitude.toFixed(3);
                lattitude = lattitude.toFixed(3);

                d3.json
                (
                    "https://query.yahooapis.com/v1/public/yql?q=select%20temp_f%2C%20weather%2C%20icons%20from%20wunderground.currentobservation%20where%20location%3D'"+lattitude+","+longitude+"'%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=",
                    function(err, response){
                        if(err){
                            return;
                        }
                        self.makeCallbackFunc(lattitude, longitude, response);
                    }
                );
            }(lattitude,longitude)
            );
    },

///////////////////////////////////////

    drawEverything: function (weather, iconSrc) {
        var weatherlegend = L.control({position: 'bottomright'});
        weatherlegend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'map image');
            div.innerHTML = '<img src="' + iconSrc + '"/>' + '<i class="WeatherIcon" style="color:blue;font-size=30%;font-weight:bold">' + weather + ' F</i>';
            return div;
        };
        weatherlegend.addTo(mapApp.map);
    },

////////////////////////////////////////

    getCorrectWeatherIcon: function (weatherCondition, night) {
        if (night === 1) {
            switch (weatherCondition) {
                case "mostlycloudy":
                    return(this.gwin.iconmostlycloudynight);
                case "partlycloudy":
                    return(this.gwin.iconpartlycloudynight);
                case "clear":
                    return(this.gwin.iconclearnight);
                case "chanceflurries":
                    return(this.gwin.iconchanceflurriesnight);
                case "chancerain":
                    return(this.gwin.iconchancerainnight);
                case "chancetstorms":
                    return(this.gwin.iconchancestormsnight);
                case "cloudy":
                    return(this.gwin.iconcloudynight);
                case "flurries":
                    return(this.gwin.iconflurriesnight);
                case "fog":
                    return(this.gwin.iconfognight);
                case "rain":
                    return(this.gwin.iconrainnight);
                case "storms":
                    return(this.gwin.iconstormsnight);
                case "tstorms":
                    return(this.gwin.icontstormsnight);
                case "snow":
                    return(this.gwin.iconsnownight);
            }
        }
        else // night === 0
        {
            switch (weatherCondition) {
                case "snow":
                    return(this.gwin.iconsnow);
                case "unknown":
                    return(this.gwin.iconunknown);
                case "storms":
                    return(this.gwin.iconstorms);
                case "tstorms":
                    return(this.gwin.icontstorms);
                case "mostlycloudy":
                    return(this.gwin.iconmostlycloudy);
                case "partlycloudy":
                    return(this.gwin.iconpartlycloudy);
                case "rain":
                    return(this.gwin.iconrain);
                case "fog":
                    return(this.gwin.iconfog);
                case "hazy":
                    return(this.gwin.iconhazy);
                case "sleet":
                    return(this.gwin.iconsleet);
                case "cloudy":
                    return(this.gwin.iconcloudy);
                case "clear":
                    return(this.gwin.iconclear);
                case "sunny":
                    return(this.gwin.iconsunny);
            }
        }
    },

// load in all of the weather icons at startup time
    loadInIcons: function () {
        var path = "./icons/weather/";
        var self = this;

        this.gwin.iconmostlycloudynight.src = path + "mostlycloudy-night.jpg";
        this.gwin.iconmostlycloudynight.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconpartlycloudynight.src = path + "partlycloudy-night.jpg";
        this.gwin.iconpartlycloudynight.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconclearnight.src = path + "clear-night.jpg";
        this.gwin.iconclearnight.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconsnownight.src = path + "snow-night.jpg";
        this.gwin.iconsnownight.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconstormsnight.src = path + "storms-night.jpg";
        this.gwin.iconstormsnight.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconcloudynight.src = path + "cloudy-night.jpg";
        this.gwin.iconcloudynight.onload = function () {
            self.gwin.numIconsLoaded++
        };

        this.gwin.iconhazynight.src = path + "hazy-night.jpg";
        this.gwin.iconhazynight.onload = function () {
            self.gwin.numIconsLoaded++
        };

        this.gwin.iconsnow.src = path + "snow.jpg";
        this.gwin.iconsnow.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconunknown.src = path + "unknown.jpg";
        this.gwin.iconunknown.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconstorms.src = path + "storms.jpg";
        this.gwin.iconstorms.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.icontstorms.src = path + "tstorms.jpg";
        this.gwin.icontstorms.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconmostlycloudy.src = path + "mostlycloudy.jpg";
        this.gwin.iconmostlycloudy.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconpartlycloudy.src = path + "partlycloudy.jpg";
        this.gwin.iconpartlycloudy.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconrain.src = path + "rain.jpg";
        this.gwin.iconrain.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconfog.src = path + "fog.jpg";
        this.gwin.iconfog.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconhazy.src = path + "hazy.jpg";
        this.gwin.iconhazy.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconsleet.src = path + "sleet.jpg";
        this.gwin.iconsleet.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconcloudy.src = path + "cloudy.jpg";
        this.gwin.iconcloudy.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconclear.src = path + "clear.jpg";
        this.gwin.iconclear.onload = function () {
            self.gwin.numIconsLoaded++
        };
        this.gwin.iconsunny.src = path + "sunny.jpg";
        this.gwin.iconsunny.onload = function () {
            self.gwin.numIconsLoaded++
        };
    },

////////////////////////////////////////

    init: function (newMode, whereToRender) {
        this.makeCallbackFunc = this.makeCallback.bind(this);
        this.gwin.mode = newMode;
        this.gwin.appID = "A" + this.myTag;
        this.loadInIcons();
        this.updateOutsideTemp(41.52,87.38);
    }
});