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
// Accepts a url and a callback function to run.
function requestCrossDomainJSON( site, callback ) {
    //alert("Ajax called");         this alert came, so this function is called and reached
    // If no url was passed, exit.
    if ( !site ) {
        alert('No site was passed.');
        return false;
    }

    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?'
        + 'q=' + encodeURIComponent('select * from json where url=@url')
        + '&url=' + encodeURIComponent(site)
        + '&format=json&callback=?';
    function cbFunc(data) {
        //alert("reaching function cbFunc")         //This alert also came
        // If we have something to work with...
        if ( ! data.error && data.query.results) {
            //alert("Inside no error in data");         //This is also reached
            // If the user passed a callback, and it
            // is a function, call it, and send through the data var.
            if ( typeof callback === 'function') {
                //alert("if this is reached, function is called back");     //This is also reached
                //alert(data);
                callback(data.query.results.json);
                //console.log(data.query.results.json);
            }
        }
        // Else, Maybe we requested a site that doesn't exist, and nothing returned.
        else throw new Error('Nothing returned from getJSON.');
    }

    // Request that YQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getJSON(yql, cbFunc );
}
