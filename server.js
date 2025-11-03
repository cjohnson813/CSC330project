const express = require('express');
const { getUsers, assignRole } = require('./rolesAssign'); 

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/users', (req, res) =>
{
	res.json(getUsers());
});

app.patch('/users/:id/role', (req, res) =>
{
	try
	{
		const updated = assignRole(req.params.id, req.body.role);
		res.json(updated);
	}
	catch (err)
	{
		if (err.message === 'User not found')
			return res.status(404).json({ error: err.message });
		if (err.message === 'Invalid role')
			return res.status(400).json({ error: err.message });
		res.status(500).json({ error: 'Error, please try again' });
	}
});

app.listen(3000);
