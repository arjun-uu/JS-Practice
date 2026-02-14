import { getUsers, saveUsers } from "./storage.js";

// Form & Inputs
const form = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Error Elements
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");


// error display function()
function showError(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");
}

function clearError(element) {
    element.textContent = "";
    element.classList.add("hidden");
}

// name validation
function validateName() {
    const name = nameInput.value.trim();
    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;

    if (!name) {
        showError(nameError, "Name is required");
        return false;
    }

    if (name.length < 6) {
        showError(nameError, "Write full name");
        return false;
    }

    if (!nameRegex.test(name)) {
        showError(nameError, "Enter full name (First and Last)");
        return false;
    }

    clearError(nameError);
    return true;
}


// email validation
function validateEmail() {
    const email = emailInput.value.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
        showError(emailError, "Email is required");
        return false;
    }

    if (!emailRegex.test(email)) {
        showError(emailError, "Enter valid email.");
        return false;
    }
    clearError(emailError);
    return true;
}


// password validation 
function validatePassword() {
    const password = passwordInput.value.trim();


    if (!password) {
        showError(passwordError, "Password is required")
        return false;
    }

    if (password.length < 6) {
        showError(passwordError, "Password must be at least 6 characters")
        return false;
    }

    clearError(passwordError)
    return true;
}
// onblur validation
nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);


// form handling
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    let users = getUsers() || [];

    // user already resgistered
    if (users.find(user => user.email === emailInput.value.trim())) {
        alert("User already exists!");
        return;
    }

    const newUser = {
        id: Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
    };

    users.push(newUser);
    saveUsers(users);

    alert("Signup successful!");
    window.location.href = "index.html";
});
