const express = require('express');
const app = express();

app.use(express.json());

//default route is not needed as the express will look 
// for index.html in public_html when a request is made to "/"
app.use(express.static('public_html'));

// Array for demonstration purposes. Replace with database later
let events = 
[
    { id: 1, name: 'Event Alpha',   date: '11/10/2025', location: 'Library' },
    { id: 2, name: 'Event Bravo',   date: '11/15/2025', location: 'School' },
    { id: 3, name: 'Event Charlie', date: '11/20/2025', location: 'Park' }
];

let eventRequests =
[
    { id: 1, name: 'Event Delta', date: '12/01/2025', time: '10:00 AM' , status: 'Pending' },
    { id: 2, name: 'Event Echo', date: '12/05/2025', time: '02:00 PM' , status: 'Pending' }
]

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

app.get("/viewEventRequests", (req, res) =>
{
    res.json(eventRequests);
})

app.post("/approveEvent", (req, res) =>
{
    const eventID = req.body.eventID;
    const eventIndex = eventRequests.findIndex(event => event.id === eventID);
    if (eventIndex === -1) {
        return res.status(404).send("Event not found.");
    }
    const event = eventRequests(eventIndex);
    event.status = "Approved";
    events.push(event);
    eventRequests.splice(eventIndex, 1);
    res.send("Event approved.");
})

app.post("/denyEvent", (req, res) =>
{
    const eventID = req.body.eventID;
    const eventIndex = eventRequests.findIndex(event => event.id === eventID);
    if (eventIndex === -1) {
        return res.status(404).send("Event not found.");
    }
    const event = eventRequests(eventIndex);
    event.status = "Denied";
    eventRequests.splice(eventIndex, 1);
    res.send("Event denied.");
})


// Start Express
app.listen(3000, () => console.log('Running on port 3000'));

