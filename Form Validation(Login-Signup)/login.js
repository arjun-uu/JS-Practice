import { getUsers, setCurrentUser } from "./storage.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
        alert("All fields required");
        return;
    }

    const users = getUsers();

    const user = users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        alert("Invalid credentials");
        return;
    }

    setCurrentUser(user);
    window.location.href = "dashboard.html";
});
