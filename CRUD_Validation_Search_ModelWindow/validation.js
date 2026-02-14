// validation.js
export function showError(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");
}

export function clearError(element) {
    element.textContent = "";
    element.classList.add("hidden");
}

// name validation
export function validateName(nameInput, nameError) {
    const name = nameInput.value.trim();
    const nameRegx = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!name) {
        showError(nameError, "Name is required");
        return false;
    } else if (name.length < 6) {
        showError(nameError, "Write complete name");
        return false;
    } else if (!nameRegx.test(name)) {
        showError(nameError, "Enter full name");
        return false;
    } else {
        clearError(nameError);
        return true;
    }
}

// email validation
export function validateEmail(emailInput, emailError) {
    const email = emailInput.value.trim();
    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        showError(emailError, "Email is required");
        return false;
    } else if (!emailRegx.test(email)) {
        showError(emailError, "Enter valid email");
        return false;
    } else {
        clearError(emailError);
        return true;
    }
}
