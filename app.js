const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
// default route is not needed as the express will look 
// for index.html in public_html when a request is made to "/"
app.use(express.static('public_html'));
//import encryption library
const bcrypt = require('bcrypt');
//encryption will be 2^number of rounds
const SALT_ROUNDS = 10;
const mysql =  require('mysql');

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
    //query database for pending event requests
    const sql = "SELECT request_id AS id, event_name AS name, event_date AS date, event_time AS time FROM EventRequests WHERE status = 'Pending'";
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
        const insertEventSql = "INSERT INTO Events (event_name, event_date, event_time) VALUES (?, ?, ?)";
        db.query(insertEventSql, [eventRequest.event_name, eventRequest.event_date, eventRequest.event_time], (err) =>
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
    const updateRequestSql = "UPDATE EventRequests SET status = 'denied' WHERE request_id = ? AND status = 'pending'";
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
            return res.status(500).send("Error with database.");
        }
        //check if user exists
        if (results.length === 0)
        {
            return res.status(401).send("Invalid username or password.");
        }
        //assign current user
        const user = results[0];
        //check encrypted password
        bcrypt.compare(password, user.password, (err, isMatch) =>
        {
            if (err)
            {
                console.error("Comparison error: ", err);
                return res.status(500).send("Error processing password.");
            }
            if (!isMatch)
            {
                return res.status(401).send("Invalid username or password.");
            }
            res.send("Login successful.");
        });    
    });
});

app.post("/signup", (req, res) => {
    //use || {} to prevent errors if body is undefined
    const {fullName, username, password, phoneNumber, email, github} = req.body || {};
    if (!fullName, !username || !password || !phoneNumber || !email) {
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

