function denyEvent(eventId) 
{
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function() 
    {
        if (this.status == 200) 
        {
            alert("Event denied successfully.");
            document.getElementById("event-" + eventId).remove();
        }
    }
    AJAXObj.onerror = function() 
    {
        alert("Connection error. Try again later.");
    }
    AJAXObj.open("POST", "/denyEvent?eventID=" + eventId);
    AJAXObj.send();
}
