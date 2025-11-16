const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
// default route is not needed as the express will look 
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
    const { name, date, location, time, capacity } = req.body || {};
    if (!name || !date || !location || !time || !capacity) 
    {
        return res.status(400).send('Missing required fields.');
    }

    const sql = 'INSERT INTO Events (event_name, event_date, event_location, event_time, event_capacity)' + 
    			'VALUES (?, ?, ?, ?, ?)';
    			
    db.query(sql, [name, date, location, time, capacity || null], (err) =>
    {
    	if (err)
    	{
    		console.error('Error inserting event: ', err);
    		return res.status(500).send('Error with database');
    	}
    	res.send('Event scheduled successfully');
    });
});

// Handle viewing events (viewEvents.html)
app.get('/events', (req, res) => 
{
	const sql =  'SELECT event_id, event_name, event_date, event_location, event_time, event_capacity ' +
			     'FROM Events ' +
			     'ORDER BY event_name ASC';

	db.query(sql, (err, rows) => 
	{
		if (err)
		{
			console.error('Error fetching events from database: ', err);
			return res.status(500).send('Error with database');
		}
		res.json(rows);	
	});
});

// Get event ID (for editing events)
app.get('/events/:id', (req, res) =>
{
	const eventID = req.params.id;
	const sql = 'SELECT event_id, event_name, event_date, event_location, event_time, event_capacity ' +
				'FROM Events WHERE event_id = ?';

	db.query(sql, [eventID], (err, rows) =>
	{
		if (err)
		{
			console.error('Error fetching event ID: ', err);
			return res.status(500).send('Error with database');
		}

		if (rows.length === 0)
		{
			return res.status(404).send('Event not found');
		}

		res.json(rows[0]);	
	});
});

// Handle editing events (by event ID)
app.put('/events/:id', (req, res) =>
{
	const eventID = req.params.id;
	const { name, date, location, time, capacity } = req.body || {};

	if (!name || !date || !location || !time || !capacity)
	{
		return res.status(400).send('Missing required fields.');
	}

	const sql = 'UPDATE Events ' +
				'SET event_name = ?, event_date = ?, event_location = ?, event_time = ?, event_capacity = ? ' +
				'WHERE event_id = ?';

	db.query(sql, [name, date, location, time, capacity, eventID], (err, result) =>
	{
		if (err)
		{
			console.error('Error updating event: ', err);
			return res.status(500).send('Error with database');
		}

		if (result.affectedRows === 0)
		{
			return res.status(404).send('Event not found');
		}

		res.send('Event updated successfully');	
	});	
});

// Handle deleting events (by event ID)
app.delete('/events/:id', (req, res) =>
{
	const eventID = req.params.id;
	const sql = 'DELETE FROM Events WHERE event_id = ?';

	db.query(sql, [eventID], (err, result) =>
	{
		if (err)
		{
			console.error('Error deleting event: ', err);
			return res.status(500).send('Error with database');
		}

		if (result.affectedRows === 0)
		{
			return res.status(404).send('Event not found');
		}

		res.send('Event deleted successfully')
	});	
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


// Start Express
app.listen(80, () => console.log('Running on port 80'));

