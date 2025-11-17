document.getElementById("signupForm").addEventListener("submit", signupUser);



async function signupUser(event)
{
    //stops page from refreshing on form submission as the button type is submit
    event.preventDefault();
    //Get values at the time of submission
    const userNameInput = document.getElementById("newUsername").value;
    const passwordInput = document.getElementById("newPassword").value;
    const confirmPasswordInput = document.getElementById("confirmPassword").value;
    const phoneNumberInput = document.getElementById("phoneNumber").value;
    const emailInput = document.getElementById("email").value;
    const githubInput = document.getElementById("github").value;
    try
    {
        if (passwordInput !== confirmPasswordInput) {
            alert("Passwords do not match.");
            return;
        }
        const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ username: userNameInput, 
            password: passwordInput, 
            phoneNumber: phoneNumberInput, 
            email: emailInput, 
            github: githubInput})
        });
        if (!response.ok){
        const errorMsg = await response.text();
        throw new Error(errorMsg);          
        }
        document.getElementById("statusMsg").innerText = await response.text(); 
        window.location.href = "index.html";
    }
    catch (err)
    {
        alert("Connection error. Please try again later.");

    }
}