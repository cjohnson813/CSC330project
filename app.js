const express = require('express');
const app = express();

app.use(express.json());

//default route is not needed as the express will look 
// for index.html in public_html when a request is made to "/"
app.use(express.static('public_html'));

// Array for demonstration purposes. Replace with database later
let events = 
[
    { id: 1, name: 'Event Alpha',   date: '11/10/2025', time: '09:00 AM', location: 'Library' },
    { id: 2, name: 'Event Bravo',   date: '11/15/2025', time: '03:00 PM', location: 'School' },
    { id: 3, name: 'Event Charlie', date: '11/20/2025', time: '12:00 PM', location: 'Park' }
];

let eventRequests =
[
    { id: 1, name: 'Event Delta', date: '12/01/2025', time: '10:00 AM' , status: 'Pending' },
    { id: 2, name: 'Event Echo', date: '12/05/2025', time: '02:00 PM' , status: 'Pending' }
];

// Handle scheduling events (scheduleEvent.html)
app.post('/schedule-event', (req, res) => 
{
    const { name, date, time, location } = req.body || {};
    if (!name || !date || !time || !location) 
    {
        return res.status(400).send('Missing required fields.');
    }
    // automatically pushes event on user submission
    const newEvent = { id: events.length + 1, name, date, time, location };
    events.push(newEvent);
    res.send('Event scheduled');

    // in progress - event is submitted as a request to the admin
    const newRequest = {
        id: nextRequestId++,
        name,
        date,
        time,
        location,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    eventRequests.push(newRequest);
    adminNotifications.push({
        id: Date.now(),
        type: 'event-request',
        message: `New event request submitted: ${name}`
    });

    res.status(201).send({ message: 'Event request submitted and is pending approval.'});
});


// Handle viewing events (viewEvents.html)
app.get('/events', (req, res) => 
{
    res.json(events);
});

//Specifically for admin, set permission after database setup
app.get('/viewEventRequests', (req, res) =>
{
    res.json(eventRequests);
});

app.get('/admin/notifications', (req, res) => 
{
    const notifications = [...adminNotifications];
    adminNotifications.length = 0;
    res.json(notifications);
});

//Specific to admin, set permission after database setup
app.post("/approveEvent", (req, res) =>
{
    const eventID = req.body?.eventID;
    const eventIndex = eventRequests.findIndex(event => event.id === eventID);
    if (eventIndex === -1) {
        return res.status(404).send("Event request not found.");
    }

    const request = eventRequests[eventIndex];
    const approvedEvent = {
        id: nextEventId++,
        name: request.name,
        date: request.date,
        time: request.time,
        location: request.location
    };

    events.push(approvedEvent);
    eventRequests.splice(eventIndex, 1);
    res.send("Event request approved.");
})

//Specific to admin, set permission after database setup
app.post("/denyEvent", (req, res) =>
{
    const eventID = Number(req.body?.eventID);
    const eventIndex = eventRequests.findIndex(event => event.id === eventID);
    if (eventIndex === -1) {
        return res.status(404).send("Event request not found.");
    }
    const [request] = eventRequests.splice(eventIndex, 1);
    res.send("Event request denied.");
});


// Start Express
app.listen(3000, () => console.log('Running on port 3000'));

