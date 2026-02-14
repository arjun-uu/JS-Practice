import { getCurrentUser, logoutUser } from "./storage.js";

const user = getCurrentUser();

if (!user) {
    window.location.href = "index.html";
}

document.getElementById("welcome").textContent =
    `Welcome, ${user.name}!`;

document.getElementById("logoutBtn")
    .addEventListener("click", function () {
        logoutUser();
        window.location.href = "index.html";
    });
