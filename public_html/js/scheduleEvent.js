document.addEventListener('DOMContentLoaded', () => 
{
    const form = document.getElementById('eventForm');

    form.addEventListener('submit', async (event) => 
    {
        // Prevent default action, proceed with following code
        event.preventDefault();

        // Collect form data
        const name = document.getElementById('eventName').value;
        const date = document.getElementById('eventDate').value;
        const location = document.getElementById('eventLocation').value;
        const time = document.getElementById('eventTime').value;

        // Sanity check for event information
        if (!name || !date || !time || !location)
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
                body: JSON.stringify({ name, date, time, location })
            });

            // error handler for failed submission (with all fields correct)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Submission failed.');
           }

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
