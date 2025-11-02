document.addEventListener('DOMContentLoaded', () =>
{
	// Replace array with database later
	const events =
	[
		{ id: 1, name: 'Event Alpha', date: '10 Nov 2025', location: 'Library' },
		{ id: 2, name: 'Event Bravo', date: '20 Nov 2025', location: 'School' },
		{ id: 3, name: 'Event Charlie', date: '30 Nov 2025', location: 'Park' }
	];

	const eventList = document.getElementById('eventList');

	// Display events, seperate by horizontal line
	if (events.length > 0)
	{
		events.forEach(event =>
		{
			const item = document.createElement('div');
			item.classList.add('event-item');
			item.innerHTML = '<h3>' + event.name + '</h3>' +
			                 '<p>Date: ' + event.date + '</p>' +
					 '<p>Location: ' + event.location +  '</p>' +
					 '<hr>';
			eventList.appendChild(item);
		});
	}
	else
	{
		eventList.innerHTML = '<p>No events available</p>';
	}

	// Home (back) button, bring to homepage
	const homeBtn = document.getElementById('homeBtn');
	homeBtn.addEventListener('click', () =>
	{
		window.location.href = 'index.html';
	});

});
