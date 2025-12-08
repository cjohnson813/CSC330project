document.addEventListener('DOMContentLoaded', loadProfile);

document.getElementById("logoutBtn").addEventListener('click', async () =>
{
	// Handle logout
    try 
    {
        const res = await fetch('/logout', { method: 'POST' });
        if (res.ok) 
        {
            window.location.href = 'login.html';
        } 
        else
        {
            alert("Error logging out.");
        }
    } 
    catch (err) 
    {
        alert("Connection error logging out.");
    }
});

async function loadProfile()
{
    try 
    {
        const res = await fetch('/profile');
        if (res.status === 401) 
        {
            // If not logged in, go to login page
            window.location.href = 'login.html';
            return;
		}

        const data = await res.json();

        // Populate with user information
        document.getElementById('profileUsername').innerText = data.user.username;
        document.getElementById('profileName').innerText = data.user.name;
        document.getElementById('profileEmail').innerText = data.user.email;
        document.getElementById('profilePhone').innerText = data.user.phone;

        // Populate with events user has RSVP'd to
        const rsvpList = document.getElementById('rsvpList');
        rsvpList.innerHTML = '';

		// If user has not RSVP'd to any events yet
        if (!data.events || data.events.length === 0) 
        {
            rsvpList.innerHTML = "<p>You have not RSVP'd to any events yet.</p>";
            return;
        }

        data.events.forEach(event =>
        {
            const item = document.createElement('div');
            item.classList.add('event-item');

            item.innerHTML =
                '<h3>' + event.event_name + '</h3>' +
                '<p>Date: ' + event.event_date.toString().split("T")[0] + '</p>' +
                '<p>Location: ' + event.event_location + '</p>' +
                '<p>Start Time: ' + event.event_time + '</p>' +
                '<p>Capacity: ' + event.event_capacity + '</p>';

            item.appendChild(document.createElement('hr'));

            rsvpList.appendChild(item);
        });
    }
    catch (err)
    {
        console.error(err);
        alert("Error loading profile.");
    }
}
