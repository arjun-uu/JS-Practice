function displayError(errorType, errorMsg) {
    errorType.classList.remove('hidden')
    errorType.textContent = errorMsg;
}
function clearError(errorType) {
    errorType.classList.add('hidden')
    errorType.textContent = '';
}


function validateName(nameInput, nameError) {

    const nameRegx = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const name = nameInput.value.trim();
    if (!name) {
        displayError(nameError, "Name is required");
        return false;
    }

    else if (!nameRegx.test(name)) {
        displayError(nameError, "Enter the full valid name");
        return false;
    }
    else {
        clearError(nameError);
        return true;
    }
}
function validateEmail(emailInput, emailError) {

    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = emailInput.value.trim();
    if (!email) {
        displayError(emailError, "Email is required");
        return false;
    }

    else if (!emailRegx.test(email)) {
        displayError(emailError, "Enter a valid email");
        return false;
    }
    else {
      clearError(emailError)
        return true;
    }
}

function validatePassword(passwordInput, passwordError) {

    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])(?=.{6,}).*$/;
    const password = passwordInput.value.trim();
    if (!password) {
        displayError(passwordError, "Password is required");
        return false;
    }

    else if (!passwordRegx.test(password)) {
        displayError(passwordError, "Enter a valid password");
        return false;
    }
    else {
        clearError(passwordError)
        return true;
    }
}



export { validateEmail, validateName, validatePassword, clearError }
