/**
 * Created by Prateek on 11/4/14.
 */
function ajaxRequest(callback, actionUrl) {
    $.ajax({
        url: actionUrl,
        dataType : "jsonp",
        success: callback,
        error:function() {
            console.log("ajax request failed");
        }
    });
}
function DivvyRequest(callback){
    $.ajax({
        url: "http://www.divvybikes.com/stations/json/",
        //dataType : "jsonp",
        success: callback,
        error:function() {
            console.log("ajax request failed");
        }
    });
}