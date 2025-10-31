// Blank users array, replace with database later
let users = 
[
	{ id: 1, name: "Alpha", role: "admin" },
	{ id: 2, name: "Bravo", role: "groupAdmin" },
	{ id: 3, name: "Charlie", role: "user" }
];


// Return users array (not needed when database gets built)
function getUsers()
{
	return users;
}

// Assign user role
function assignRole(id, role)
{
	if (!['admin', 'groupAdmin', 'user'].includes(role))
	{
		throw new Error('Invalid role');
	}

	const user = users.find(u => u.id === id);
	
	if (!user)
	{
		throw new Error ('User not found');
	}

	user.role = role; // Update user's role in array

	return user;
}

module.exports = { getUsers, assignRole };
