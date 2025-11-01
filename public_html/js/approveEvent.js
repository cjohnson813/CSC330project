//function to approve event creation

function approveEvent(eventId)
{
    const eventName = document.getElementById("event_name-" + eventId).textContent;
    const eventDate = document.getElementById("event_date-"+ eventId).textContent;
    const eventTime = document.getElementById("event_time-" + eventId).textContent;
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
