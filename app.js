const express = require('express');
const app = express();

app.use(express.json());

//default route is not needed as the express will look 
// for index.html in public_html when a request is made to "/"
app.use(express.static('public_html'));

// Connect to database. Only works on approved IPs by server admin
const db = mysql.createConnection(
{

	host: '34.23.144.80',
	user: 'jared',
	password: '@Password1',
	database: 'CSMarketplace'
	 	
});

// Display message based on connection status
db.connect(err =>
{
	if (err) console.error('MySQL connection error: ', err);
	else console.log('MySQL connection successful');	
});

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

//Specifically for admin, set permission after database setup
app.get("/viewEventRequests", (req, res) =>
{
    res.json(eventRequests);
})

//Specific to admin, set permission after database setup
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

//Specific to admin, set permission after database setup
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

app.post("/login", (req, res) =>
{
    const {username, password} = req.body || {};
    if (!username || !password)
    {
        return res.status(400).send("Missing username or password.");
    }
    //query database for user
    const sql = "SELECT * FROM Users WHERE user_name = ?";
    db.query(sql, [username], (err, results) =>
    {
        if (err)
        {
            console.error("Database error: ", err);
            return res.status(500).send("Error with database.");
        }
        //check if user exists
        if (results.length === 0)
        {
            return res.status(401).send("Invalid username or password.");
        }
        //assign current user
        const user = results[0];
        //check password
        if (user.password !== password)
        {
            return res.status(401).send("Invalid password.");
        }
        res.send("Login successful.");     
    });
});

// Start Express
app.listen(3000, () => console.log('Running on port 3000'));

