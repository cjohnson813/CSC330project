const fs = require('fs');
const path = require('path');
function sendFile(fileName, res)
{
    const ext = path.extname(fileName);
	let contentType = setContentType(fileName);
	fs.readFile(fileName, function(err, data)
	{
		if (err)
		{
			sendResponse(404, "Error 404: resource not found", 'text/html', res);
		}
		else
		{
			sendResponse(200, data, contentType, res);
		}
	})
}

function setContentType(fileName)
{
    let contentType = 'text/plain';
	const ext = path.extname(fileName);
	switch (ext)
	{
		case '.html':
			contentType = 'text/html';
			break;
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.txt':
			contentType = 'text/plain';
			break;
	}
	return contentType;
}

module.exports = {
    sendFile: sendFile, 
    setContentType: setContentType
};
