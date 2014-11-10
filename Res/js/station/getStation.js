/**
 * Created by Prateek on 11/6/2014.
 */
var getStation = Class.extend({
    construct: function(){

    },
    stationToGeoJson: function(obj) {
    return {
        "type": "Feature",
        "properties": {
            "id": obj.id,
            "stationName": obj.stationName,
            "availableDocks": obj.availableDocks,
            "availableBikes": obj.availableBikes,
            "statusValue": obj.statusValue,
            "landmark": obj.landMark,
            "testStation": obj.testStation
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                obj.longitude,
                obj.latitude
            ]
        }
    };
}

});