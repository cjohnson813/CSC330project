function denyEvent(eventID) 
{
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function() 
    {
        if (this.status == 200) 
        {
            alert("Event denied successfully.");
            document.getElementById("event-" + eventID).remove();
        }
    }
    AJAXObj.onerror = function() 
    {
        alert("Connection error. Try again later.");
    }
    AJAXObj.open("POST", "/denyEvent?eventID=" + eventID);
    AJAXObj.send();
}
