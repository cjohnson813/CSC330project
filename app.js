const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public_html'));

// Array for demonstration purposes. Replace with database later
let events = 
[
    { id: 1, name: 'Event Alpha',   date: '11/10/2025', location: 'Library' },
    { id: 2, name: 'Event Bravo',   date: '11/15/2025', location: 'School' },
    { id: 3, name: 'Event Charlie', date: '11/20/2025', location: 'Park' }
];

// Handle scheduling events (scheduleEvent.html)
app.post('/schedule-event', (req, res) => 
{
    const { name, date, location } = req.body || {};
    if (!name || !date || !location) 
    {
        return res.status(400).send('Missing required fields.');
    }
    const newEvent = { id: events.length + 1, name, date, location };
    events.push(newEvent);
    res.send('Event scheduled');
});

// Handle viewing events (viewEvents.html)
app.get('/events', (req, res) => 
{
    res.json(events);
});

app

// Start Express
app.listen(3000, () => console.log('Running on port 3000'));

