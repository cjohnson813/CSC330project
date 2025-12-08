document.getElementById("viewRequestsBtn").addEventListener("click", () => {
    //show the hidden requests section when button is clicked
    document.getElementById("requestsSection").style.display = "block";
    //then call the function to view event requests
    viewEventRequests();
});


    // Add hover animation to primary button
const viewRequestsBtn = document.getElementById("viewRequestsBtn");
if (viewRequestsBtn && typeof anime !== 'undefined') {
    viewRequestsBtn.addEventListener('mouseenter', () => {
        anime({
            targets: viewRequestsBtn,
            scale: [1, 1.05],
            duration: 300,
            easing: 'easeOutQuad'
        });
    });

    viewRequestsBtn.addEventListener('mouseleave', () => {
        anime({
            targets: viewRequestsBtn,
            scale: [1.05, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
}


//make sure the function is asycnc so the page doesn't get stuck
async function viewEventRequests() {
    //using try catch block to handle erroes
    try{
        //send a get request to the server to get the list of event requests

        const response = await fetch("/viewEventRequests")
        //.ok is a property of response object that check to
        //if the response status is in the range 200-299
        if (!response.ok)
        {
            throw new Error("Failed to load event requests.");
        }
        //converts the response to array of event objects
        const events = await response.json();

        //get the table body element to populate with event requests
        const tbody = document.getElementById("requestsTableBody");
        //clear existing data in the table body
        tbody.innerHTML = "";
        //check to see if there are no event requests, === checks type and value
        if (events.length === 0){
                const tr = document.createElement("tr");
                //the purpose of colspan 5 is to make the message span across all 5 columns of the table
                tr.innerHTML = `<td colspan="5">No pending event requests found.</td>`;
                tbody.appendChild(tr);
                return;
        }
        //iterate through each event and create table rows
        for (let i = 0; i < events.length; i++){
            const event = events[i];
            const tr = document.createElement("tr");
            //assigning id to each tr so it makes it easier later to remove them when approved or denied
            tr.id = "event " + event.id;
            //Adjust the innerhtml of each table row based on the response from backend
            tr.innerHTML = 
            `<td>${event.id}</td>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.location}</td>
            <td>${event.capacity}</td>
            <td>
                <button class="primary-btn" onclick="approveEvent(${event.id})">Approve</button>
                <button class="primary-btn" onclick="denyEvent(${event.id})">Deny</button>
            </td>`;
            tbody.appendChild(tr);
        }

        // Animate event table appearance
        if (typeof anime !== 'undefined' && events.length > 0) {
            anime({
                targets: '#requestsTable',
                scale: [0.95, 1],
                opacity: [0.8, 1],
                duration: 600,
                easing: 'easeOutQuad'
            });           
        }
    }

    catch (err)
    {
            alert("Error loading event requests. Please try again later.")
    }
}

// Admin view events

// View event button actions
const viewEventsBtn = document.getElementById("viewEventsBtn");
if (viewEventsBtn)
{
    viewEventsBtn.addEventListener("click", () => 
    {
        // Display in same section used for event requests
        const requestsSection = document.getElementById("requestsSection");
        if (requestsSection) 
        {
            requestsSection.style.display = "block";

            // Changed heading text
            const heading = requestsSection.querySelector("h2");
            if (heading) 
            {
                heading.textContent = "Events";
            }
        }

        // Load events from /events
        viewEvents();
    });

    // Add hover animation, same as event requests button
    if (typeof anime !== 'undefined') 
    {
        viewEventsBtn.addEventListener('mouseenter', () => 
        {
            anime(
            {
                targets: viewEventsBtn,
                scale: [1, 1.05],
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        viewEventsBtn.addEventListener('mouseleave', () => 
        {
            anime(
            {
                targets: viewEventsBtn,
                scale: [1.05, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    }
}

// View events with edit/delete functionality
async function viewEvents() 
{
    try 
    {
        const response = await fetch("/events");
        if (!response.ok)
        {
            throw new Error("Failed to load events.");
        }

        const events = await response.json();

        // Same body as event requests
        const tbody = document.getElementById("requestsTableBody");
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = "";

        // If no events found
        if (!events || events.length === 0) 
        {
            const tr = document.createElement("tr");
            tr.innerHTML = '<td colspan="7">No events found.</td>';
            tbody.appendChild(tr);
            return;
        }

        // Create rows (same format as event requests)
        for (let i = 0; i < events.length; i++) 
        {
            const event = events[i];
            const tr = document.createElement("tr");

            // ID used to remove row after delete as needed
            tr.id = "event-" + event.event_id;

            tr.innerHTML =
                `<td>${event.event_id}</td>
                 <td>${event.event_name}</td>
                 <td>${event.event_date}</td>
                 <td>${event.event_time}</td>
                 <td>${event.event_location}</td>
                 <td>${event.event_capacity}</td>
                 <td>
                     <button class="primary-btn" onclick="editEvent(${event.event_id})">Edit</button>
                     <button class="primary-btn" onclick="deleteEvent(${event.event_id})">Delete</button>
                 </td>`;

            tbody.appendChild(tr);
        }
    } 
    catch (err) 
    {
        console.error(err);
        alert("Error loading events. Please try again later.");
    }
}

// Edit button actions
function editEvent(id) 
{
    window.location.href = "editEvent.html?id=" + id;
}

// Delete button actions
async function deleteEvent(id) {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try 
    {
        const response = await fetch("/events/" + id, { method: "DELETE" });
        if (!response.ok) 
        {
            throw new Error("Failed to delete event.");
		}

        // Remove row without reloading page
        const row = document.getElementById("event-" + id);
        if (row) 
        {
            row.remove();
        }
    } 
    catch (err) 
    {
        console.error(err);
        alert("Error deleting event. Please try again later.");
    }
}
