//function to approve event creation

function approveEvent(eventId)
{
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function()
    {
        if (this.status == 200)
        {
            alert("Event approved successfully.");
            document.getElementById("event-" + eventId).remove();
        }
    }
    AJAXObj.onerror = function()
    {
        errorHandler("Connection error. Try again later.");
    }
    AJAXObj.open("POST", "/approveEvent?eventID=" + eventId);
    AJAXObj.send();
}
