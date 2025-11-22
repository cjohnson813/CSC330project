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

	// Home button brings user to landing page
    homeBtn.addEventListener('click', () => 
    {
        window.location.href = 'index.html';
    });
});
