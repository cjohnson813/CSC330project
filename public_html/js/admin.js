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