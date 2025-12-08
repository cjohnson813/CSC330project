document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
    try {
        const res = await fetch("/currentUser");
        
        if (!res.ok) {
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        if (!data.loggedIn) {
            window.location.href = "login.html";
            return;
        }

        const user = data.user;

        document.getElementById("usernameValue").textContent = user.username;
        document.getElementById("nameValue").textContent = user.name;
        document.getElementById("emailValue").textContent = user.email;
        document.getElementById("roleValue").textContent = user.isAdmin ? "Admin" : "User";

    } catch (err) {
        console.error("Error loading profile:", err);
        window.location.href = "login.html";
    }
}

// Logout function
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
        try {
            await fetch("/logout", { method: "POST" });
        } catch (err) {
            console.error("Logout error:", err);
        // Even if logout fails, redirect to login page
        } finally {
            window.location.href = "login.html";
        }
    });
});
