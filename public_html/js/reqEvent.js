//Event listner for create event button
document.getElementById("create_event").addEventListener("click", requestEvent);

let eventName = document.getElementById("event_name");
let eventDate = document.getElementById("event_date");
let eventTime = document.getElementById("event_time");
let eventReqStatus = document.getElementById("event_request_status");

//function to request event creation

function requestEvent()
{
    if (!inputValidation())
    {
        return;
    }
    let AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function()
    {
        if (this.status == 200)
        {
            eventReqStatus.innerHTML = this.responseText;
        }
    }
    AJAXObj.onerror = function()
    {
        errorHandler("Connection error. Try again later.");
    }
    AJAXObj.open("POST", "/requestEvent?eventName=" + eventName.value + "&eventDate=" + eventDate.value + "&eventTime=" + eventTime.value, true);
    AJAXObj.send();
}


function inputValidation()
{
    if (!eventName.value || !eventDate.value || !eventTime.value)
    {
        eventReqStatus.innerHTML = "All fields are required.";
        return false;
    }
    return true;
}