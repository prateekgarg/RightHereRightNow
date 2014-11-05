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