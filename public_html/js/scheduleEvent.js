document.addEventListener('DOMContentLoaded', () => 
{
    const form = document.getElementById('eventForm');

    form.addEventListener('submit', async (event) => 
    {
        event.preventDefault();

        // Form data
        const name = document.getElementById('eventName').value;
        const date = document.getElementById('eventDate').value;
        const location = document.getElementById('eventLocation').value;

        // Sanity check for event information
        if (!name || !date || !location)
        {
            alert('Please fill in all fields.');
            return;
        }

        try 
        {
            // Send data to backend (app.js)
            const response = await fetch('/schedule-event', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, date, location })
            });

            // Confirmation message, then reset form
            const message = await response.text();
            alert(message);
            form.reset();
        } 
        catch (err) 
        {
            alert('Error scheduling event.');
        }
    });
});
