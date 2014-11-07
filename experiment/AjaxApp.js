/**
 * Created by Prateek on 11/4/14.
 */
 var mydata = [];
function ajaxRequest(actionUrl,callback ) {
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
		//console.log(data);
        // If we have something to work with...
        if ( ! data.error && data.query.results) {
            // If the user passed a callback, and it
            // is a function, call it, and send through the data var.
            if ( typeof callback === 'function') {
                callback(data.query.results.json);
            }
        }
        // Else, Maybe we requested a site that doesn't exist, and nothing returned.
        else throw new Error('Nothing returned from getJSON.');
    }

    // Request that YQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getJSON(yql, cbFunc );
}
