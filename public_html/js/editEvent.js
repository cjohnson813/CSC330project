document.addEventListener('DOMContentLoaded', async () =>
{
    var form = document.getElementById('editEventForm');
    var statusMessage = document.getElementById('statusMessage');
    var cancelBtn = document.getElementById('cancelBtn');

    // Get event ID from URL
    var params = new URLSearchParams(window.location.search);
    var eventId = params.get('id');

    // Load existing event data, so user knows what to edit
    try
    {
        var response = await fetch('/events/' + eventId);
        if (!response.ok)
        {
            throw new Error('Failed to load event');
        }

        var event = await response.json();

        // Prefill existing event details
		document.getElementById('eventName').value = event.event_name;
		document.getElementById('eventDate').value = event.event_date.toString().split('T')[0];
		document.getElementById('eventLocation').value = event.event_location;
		document.getElementById('eventTime').value = event.event_time;
		document.getElementById('eventCapacity').value = event.event_capacity;
    }
    catch (err)
    {
        console.error(err);
        if (statusMessage)
        {
            statusMessage.textContent = 'Error loading event details.';
        }
    }

    // Save changes from user's edits
    if (form)
    {
        form.addEventListener('submit', async (e) =>
        {
            e.preventDefault();

            var nameValue = document.getElementById('eventName').value.trim();
            var dateValue = document.getElementById('eventDate').value;
            var locationValue = document.getElementById('eventLocation').value.trim();
            var timeValue = document.getElementById('eventTime').value;
            var capacityValue = document.getElementById('eventCapacity').value;

            if (!nameValue || !dateValue || !locationValue || !timeValue || !capacityValue)
            {
                if (statusMessage)
                {
                    statusMessage.textContent = 'Please fill out all fields.';
                }
                return;
            }

            var bodyData = 
            {
                name: nameValue,
                date: dateValue,
                location: locationValue,
                time: timeValue,
                capacity: capacityValue
            };

            try
            {
                var updateResponse = await fetch('/events/' + eventId, 
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                });

                if (!updateResponse.ok)
                {
                    throw new Error('Update failed');
                }

                if (statusMessage)
                {
                    statusMessage.textContent = 'Event updated successfully.';
                }
            }
            catch (err)
            {
                console.error(err);
                if (statusMessage)
                {
                    statusMessage.textContent = 'Error updating event.';
                }
            }
        });
    }

    // Cancel button brings admin back to admin page
    if (cancelBtn)
    {
        cancelBtn.addEventListener('click', function ()
        {
            window.location.href = 'admin.html';
        });
    }
});
