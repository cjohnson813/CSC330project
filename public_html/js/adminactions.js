//function to approve event creation

async function approveEvent(eventId)
{
    try
    {
        //better to use separate header and body for POST requests rather than appending data to URL
        const response = await fetch("/approveEvent", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify({ eventID: eventId })
        });
        //check if response status is not between 200-299
        if (!response.ok){
        throw new Error("Failed to approve event.");
        }
        alert("Event approved successfully.");
        //if event is approved, remove the event row from the table
        //this is only for the frontend, the backend also removes it from the database
        removeEventRow(eventId);
    }
    catch (err)
    {
        alert("Connection error. Try again later.");
    }
}


//function to deny event creation
async function denyEvent(eventId) 
{
    try
    {
        //better to use separate header and body for POST requests rather than appending data to URL
        const response = await fetch("/denyEvent", {
            method: "POST",
            headers: { "Content;Type" : "application/json" },
            body: JSON.stringify({ eventID: eventId })
        });
        //check if response status is not between 200-299
        if (!response.ok){
        throw new Error("Failed to approve event.");
        }
        alert("Event denied successfully.");
        //if event is approved, remove the event row from the table
        //this is only for the frontend, the backend also removes it from the database
        removeEventRow(eventId);
    }
    //if the request never completes due to connection issues
    catch (err)
    {
        alert("Connection error. Try again later.");
    }
}

function removeEventRow(eventId)
{
    const row = document.getElementById("event " + eventId);
    if (row)
    {
        row.remove();
    }
}