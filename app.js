const hhtp = require('http');
const url = require('url');
const fs = require('fs');
const fileUtils = require('./fileUtils.js');
const sendFile = fileUtils.sendFile;

//array of requested event JSON objects
//each requested event has a name, date and time
let requestedEvents = [];

//create server
let myserver = http.createServer(requestHandler);

//function to handle requests
function requestHandler(req, res) {
    let parsedURL = url.parse(req.url,true); 
    let pathName = parsedURL.pathname;
    let query = parsedURL.query;
    const fileName = "." + pathName;
    switch (pathName)
    {
        case '/requestEvent':
            addEventRequest(query, res);
            break;
        default:
            sendFile(fileName, res);
    }
}

function addEventRequest(query, res)
{
    if (requestedEvents.some(event => event.time == query.time && event.date == query.date))
    {
        sendResponse(409, 'text/plain', "Time slot already booked", res)
    }
    else
    {
        requestedEvents.push({name: query.eventName, date: query.eventDate, time: query.eventTime});
        sendResponse(200, 'text/plain', "Event request submitted successfully", res);
    }
}

function sendResponse(status, message, contentType, res)
{
	res.writeHead(status, {'Content-Type': contentType});
	res.write(message);
	res.end();
}
