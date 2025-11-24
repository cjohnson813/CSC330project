const express = require('express');
const app = express();
const mysql =  require('mysql');

app.use(express.json());

//default route is not needed as the express will look 
// for index.html in public_html when a request is made to "/"
app.use(express.static('public_html'));
//import encryption library
const bcrypt = require('bcrypt');
//encryption will be 2^number of rounds
const SALT_ROUNDS = 10;

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

// Handle scheduling events (scheduleEvent.html)
app.post('/schedule-event', (req, res) => 
{
	// Extracts information from req.body, assign them to seperate variables
    const { name, date, location, time, capacity } = req.body || {};
    // Sanity check for missing information
    if (!name || !date || !location || !time || !capacity) 
    {
        return res.status(400).send('Missing required fields.');
    }

	// Assign fields to be inserted into table
    const sql = 'INSERT INTO EventRequests (event_name, event_date, event_location, event_time, event_capacity)' + 
    			'VALUES (?, ?, ?, ?, ?)';

    // Insert values into table, error if unsuccessful		
    db.query(sql, [name, date, location, time, capacity || null], (err) =>
    {
    	if (err)
    	{
    		console.error('Error inserting event: ', err);
    		return res.status(500).send('Error with database');
    	}
    	res.send('Event request sent successfully');
    });
});

// Handle viewing events (viewEvents.html)
app.get('/events', (req, res) => 
{
	// Assign information to be viewed
	const sql =  'SELECT event_id, event_name, event_date, event_location, event_time, event_capacity ' +
			     'FROM Events ' +
			     'ORDER BY event_name ASC';

	// Fetch events from database, error if unsuccessful
	db.query(sql, (err, rows) => 
	{
		if (err)
		{
			console.error('Error fetching events from database: ', err);
			return res.status(500).send('Error with database');
		}
		// Package data into JSON for use by frontend
		res.json(rows);	
	});
});

// Get approved events for calendar display with RSVP counts
app.get('/calendar-events', (req, res) => 
{
	// Get approved events with RSVP counts
	const sql = `SELECT 
		e.event_name, 
		e.event_date, 
		e.event_location, 
		e.event_time, 
		e.event_capacity,
		COALESCE(COUNT(r.rsvp_id), 0) AS rsvp_count
	FROM Events e
	LEFT JOIN RSVPs r ON e.event_id = r.event_id
	GROUP BY e.event_id, e.event_name, e.event_date, e.event_location, e.event_time, e.event_capacity
	ORDER BY e.event_date ASC, e.event_time ASC`;

	// Fetch events from database, error if unsuccessful
	db.query(sql, (err, rows) => 
	{
		if (err)
		{
			console.error('Error fetching calendar events from database: ', err);
			return res.status(500).send('Error with database');
		}
		// Package data into JSON for use by frontend
		res.json(rows);	
	});
});


// Get event ID (for editing events)
app.get('/events/:id', (req, res) =>
{
	// Sent from frontend; extract event ID from URL
	const eventID = req.params.id;
	// Find event based on event's ID
	const sql = 'SELECT event_id, event_name, event_date, event_location, event_time, event_capacity ' +
				'FROM Events WHERE event_id = ?';

	// Fetch event ID
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
		
		// First row of result from MySQL query is always event_id
		res.json(rows[0]);	
	});
});

// Handle editing events (by event ID)
app.put('/events/:id', (req, res) =>
{
	// Sent from front end
	const eventID = req.params.id;
	// Assign values to seperate variables
	const { name, date, location, time, capacity } = req.body || {};

	// Sanity check
	if (!name || !date || !location || !time || !capacity)
	{
		return res.status(400).send('Missing required fields.');
	}

	// Edit event based on event's ID
	const sql = 'UPDATE Events ' +
				'SET event_name = ?, event_date = ?, event_location = ?, event_time = ?, event_capacity = ? ' +
				'WHERE event_id = ?';

	// Update event in database
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
	// Event ID from frontend
	const eventID = req.params.id;
	// Delete event by event_id
	const sql = 'DELETE FROM Events WHERE event_id = ?';

	// Delete event from frontend
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
    //query database for pending event requests
    const sql = "SELECT request_id AS id, event_name AS name, event_date AS date, event_time AS time, event_location as location, event_capacity as capacity FROM EventRequests WHERE status = 'pending'";
    db.query(sql, (err, results) =>
    {
        if (err)
        {
            console.error("Database error: ", err);
            return res.status(500).send("Error retrieving event requests.");
        }
        //send the results as JSON
        res.json(results);
    });
})
//Specific to admin, set permission after database setup
app.post("/approveEvent", (req, res) =>
{
    const eventID = req.body.eventID;
    //check if eventID is provided
    if (!eventID)
    {
        return res.status(400).send("Missing event ID.");
    }
    //Get the request from database
    const getRequestSql = "SELECT * FROM EventRequests WHERE request_id = ? AND status = 'Pending'";
    db.query(getRequestSql, [eventID], (err, results) =>
    {
        if (err)
        {
            console.error("Database error: ", err);
            return res.status(500).send("Error retrieving event request.");
        }
        //check if request exists
        if (results.length === 0)
        {
            return res.status(404).send("Event request not found.");
        }
        //Extract event details
        const eventRequest = results[0];
        //Insert the approved event into Events table
        const insertEventSql = "INSERT INTO Events (event_name, event_date, event_time, event_capacity, event_location) VALUES (?, ?, ?, ?, ?)";
        db.query(insertEventSql, [eventRequest.event_name, eventRequest.event_date, eventRequest.event_time, eventRequest.event_capacity, eventRequest.event_location], (err) =>
        {
            if (err)
            {
                console.error("Database error: ", err);
                return res.status(500).send("Error approving event.");
            }
            //Update the status of the request to Approved
            const updateRequestSql = "UPDATE EventRequests SET status = 'approved' WHERE request_id = ?";
            db.query(updateRequestSql, [eventID], (err) =>
            {
                if (err)
                {
                    console.error("Database error: ", err);
                    return res.status(500).send("Error updating event request status.");
                }
                res.send("Event approved.");
            });
        });
    });
})

//Specific to admin, set permission after database setup
app.post("/denyEvent", (req, res) =>
{
    const eventID = req.body.eventID;
    if (!eventID)
    {
        return res.status(400).send("Missing event ID.");
    }
    //Update the status of the request to Denied
    const updateRequestSql = "UPDATE EventRequests SET status = 'rejected' WHERE request_id = ? AND status = 'pending'";
    db.query(updateRequestSql, [eventID], (err, result) =>
    {
        if (err)
        {
            console.error("Database error: ", err);
            return res.status(500).send("Error denying event.");
        }
        //check if any rows were affected (i.e., if the request existed)
        if (result.affectedRows === 0)
        {
            return res.status(404).send("Event request not found.");
        }
        res.send("Event denied.");
    })
});


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
            return res.status(500).json({message: "Error with database."});
        }
        //check if user exists
        if (results.length === 0)
        {
            return res.status(401).json({message: "Invalid username or password."});
        }
        //assign current user
        isAdmin = false;
        user_id = results[0].user_id;
        const checkAdmin = "SELECT * FROM Admins WHERE user_id = ?";
        db.query(checkAdmin, [user_id], (err, adminResults) =>
        {
            if (err)
            {
                console.error("Database error: ", err);
                return res.status(500).json({message: "Error with database."});
            }
            if (adminResults.length > 0)
            {
                isAdmin = true;
            }
        });
        const user = results[0];
        //check encrypted password
        bcrypt.compare(password, user.password, (err, isMatch) =>
        {
            if (err)
            {
                console.error("Comparison error: ", err);
                return res.status(500).json({message: "Error processing password."});
            }
            if (!isMatch)
            {
                return res.status(401).json({message: "Invalid username or password."});
            }
            return res.json({
                message: "Login successful.",
                isAdmin: isAdmin
            });
        });    
    });
});

app.post("/signup", (req, res) => {
    //use || {} to prevent errors if body is undefined
    const {fullName, username, password, phoneNumber, email, github} = req.body || {};
    if (!fullName || !username || !password || !phoneNumber || !email) {
        return  res.status(400).send("Missing required fields.");
    }
    //check if username already exists
    const checkUserSql = "SELECT * FROM Users WHERE user_name = ?";
    //check for existing username
    db.query(checkUserSql, [username], (err, results) =>
    {
        if (err)
        {
            console.error("Database error: ", err);
            return res.status(500).send("Error checking existing users.");
        }
        if (results.length > 0)
        {
            return res.status(409).send("Username already exists.");
        }
        //Hash the password
        bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) =>
        {
            if (err)
            {
                console.error("Hashing error: ", err);
                return res.status(500).send("Error processing password.");
            }
            //Insert new user into database
            const insertUserSql = "INSERT INTO Users (name, user_name, password, phoneNumber, email) VALUES (?, ?, ?, ?, ?)";
            db.query(insertUserSql, [fullName, username, hashedPassword, phoneNumber, email], (err) =>
            {
                if (err)
                {
                    console.error("Database error: ", err);
                    return res.status(500).send("Error creating user.");
                }
                res.send("Signup successful.");
            });
        });
    });
});

// Start Express
app.listen(80, () => console.log('Running on port 80'));

