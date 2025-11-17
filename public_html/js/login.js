document.getElementById("loginForm").addEventListener("submit", loginUser);


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
        const message = await response.text();
        if (!response.ok){
        throw new Error(message);          
        }
        document.getElementById("statusMsg").innerText = message; 
        //If login is successful, redirect to homepage
        window.location.href = "index.html";
    }
    catch (err)
    {
        alert("Connection error. Please try again later.");
    }
}

