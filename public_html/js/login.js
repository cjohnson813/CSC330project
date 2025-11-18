document.getElementById("loginForm").addEventListener("submit", loginUser);

// home button function
document.getElementById("homeBtn").addEventListener('click', () =>
{
    window.location.href = 'index.html';
});

// view events button function
document.getElementById("viewBtn").addEventListener('click', () =>
{
    window.location.href = 'viewEvents.html';
});

async function loginUser(event)
{
    //stops page from refreshing on form submission as the button type is submit
    event.preventDefault();
    //Get values at the time of submission
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
    try
    {
        const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput})
        });
        const data = await response.json();
        if (!response.ok){
        document.getElementById("statusMsg").innerText = data.message;
        return;         
        }
        document.getElementById("statusMsg").innerText = data.message; 
        //If login is successful, redirect to homepage
        if (data.isAdmin){
            window.location.href = "admin.html";
        }
        else
        window.location.href = "index.html";
    }
    catch (err)
    {
        alert("Connection error. Please try again later.");
    }
}

