document.addEventListener('DOMContentLoaded', async () => 
{
    const eventList = document.getElementById('eventList');
    const homeBtn = document.getElementById('homeBtn');

    try 
    {
        const response = await fetch('/events');
        const events = await response.json();

		// Display events array from app.js
        if (events.length > 0)
        {
            events.forEach(event => 
            {
                const item = document.createElement('div');
                item.classList.add('event-item');
                item.innerHTML =
                	// Event information
                    '<h3>' + event.event_name + '</h3>' +
                    '<p>Date: ' + event.event_date.toString().split('T')[0] + '</p>' + // Remove extra date characters
                    '<p>Location: ' + event.event_location + '</p>' +
                    '<p>Start Time: ' + event.event_time + '</p>' +
                    '<p>Capacity: ' + event.event_capacity + '</p>' +
					// Edit and delete buttons
					'<button class="nav-btn edit-btn" data-id="' + event.event_id + '">Edit</button>' +
					'<button class="nav-btn delete-btn" data-id="' + event.event_id + '" style="margin-left:10px;">Delete</button>' +
                    '<hr>'; // Horizontal line to seperate events
                eventList.appendChild(item);
            });
        } 
        else 
        {
            eventList.innerHTML = '<p>No events available</p>';
        }
    }
    catch (err) 
    {
        eventList.innerHTML = '<p>Error loading events</p>';
    }

    // Edit and Delete button behaviors
    eventList.addEventListener('click', async (e) =>
    {
    	// Edit events
    	if (e.target.classList.contains('edit-btn'))
    	{
    		const id = e.target.getAttribute('data-id');
    		window.location.href = "editEvent.html?id=" + id;
    		return;
    	}

    	// Delete events
    	if (e.target.classList.contains('delete-btn'))
    	{
    		const id = e.target.getAttribute('data-id');

    		const confirmed = confirm('Are you sure you want to delete this event?');
    		if (!confirmed) return;

    		try
    		{
    			const response = await fetch("/events/" + id, { method: 'DELETE' });
    			if (!response.ok) throw new Error ("Failed to delete event");

    			// Reload page upon deleting event
    			location.reload();
    		}
    		catch (err)
    		{
    			alert("Error deleting event");
    		}
    	}
    });

	// Home button brings user to landing page
    homeBtn.addEventListener('click', () => 
    {
        window.location.href = 'index.html';
    });
});
