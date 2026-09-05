
function displayError(errorType, errorMsg, errorInput, placeholderMsg) {
    if (errorType) {
        errorType.classList.remove('hidden');
        errorType.textContent = errorMsg;
        errorInput.classList.add('outline', 'outline-1', 'outline-red-500');
        errorInput.placeholder = placeholderMsg;
    }
}

function clearError(errorType, errorInput) {
    if (errorType) {
        errorType.classList.add('hidden');
        errorType.textContent = '';
        errorInput.classList.remove('outline', 'outline-1', 'outline-red-500');
        errorInput.placeholder = "";
    }
}

// username
function validateUsername(usernameInput, usernameError) {
    const username = usernameInput.value.trim();
    if (!username) {
        displayError(usernameError, "Name is required", usernameInput, "Enter username");
        return false;
    }
    else {
        clearError(usernameError, usernameInput);
        return true;
    }
}
// email
function validateEmail(emailInput, emailError) {
    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = emailInput.value.trim();
    if (!email) {
        displayError(emailError, "Email is required", emailInput, "Enter email..");
        return false;
    } else if (!emailRegx.test(email)) {
        displayError(emailError, "Enter a valid email", emailInput, "Enter email..");
        return false;
    } else {
        clearError(emailError, emailInput);
        return true;
    }
}
// phone
function validatePhone(mobileNumberInput, mobileNumberError) {
    const number = mobileNumberInput.value.trim();
    const phoneRegx = /^\d{10}$/;
    if (!number) {
        displayError(mobileNumberError, "Phone Number is required", mobileNumberInput, "Enter Mobile Number");
        return false;
    }
    else if (number.length < 10 || number.length > 10) {
        displayError(mobileNumberError, "Must be of 10 digits", mobileNumberInput, "Enter Mobile Number");
        return false;
    } else if (!phoneRegx.test(number)) {
        displayError(mobileNumberError, "Enter a valid 10-digit phone number", mobileNumberInput, "Enter Mobile Number");
        return false;
    } else {
        clearError(mobileNumberError, mobileNumberInput);
        return true;
    }
}

// start time
function validateStartTime(startTimeInput, startTimeError) {
    const startTimeValue = startTimeInput.value;
    if (!startTimeValue) {
        displayError(startTimeError, "Start time is required", startTimeInput);
        return false;
    }
    clearError(startTimeError, startTimeInput);
    return true;
}

// end time
function validateEndTime(startTimeInput, endTimeInput, endTimeError) {
    const startValue = startTimeInput.value;
    const endValue = endTimeInput.value;
    if (!endValue) {
        displayError(endTimeError, "End time is required", endTimeInput);
        return false;
    }

    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();

    if (start >= end) {
        displayError(endTimeError, "End time must be after start time", endTimeInput);
        return false;
    }
    else {
        clearError(endTimeError, endTimeInput);
        return true;
    }

}
// reservation status 
function validateReservation(reservationStatusInput, reservationError) {
    const status = reservationStatusInput.value;
    if (!status) {
        displayError(reservationError, "Plz Select Reservation Status", reservationStatusInput)
        return false;
    }
    else {
        clearError(reservationError, reservationStatusInput);
        return true;
    }
}

// vehicle number
function validateVehicleNumber(vehicleNumberInput, vehicleError) {
    const vehicleNumber = vehicleNumberInput.value.trim();
    if (!vehicleNumber) {
        displayError(vehicleError, "Plz Add vehicle number", vehicleNumberInput, "Enter vehicle Number");
        return false;
    }
    else {
        clearError(vehicleError, vehicleNumberInput);
        return true;
    }
}
// slot number 
function validateSlot(slotNumberInput, slotError) {
    const slotNumber = slotNumberInput.value.trim();
    if (!slotNumber) {
        displayError(slotError, "Plz Add slot", slotNumberInput, "Enter slot Number");
        return false;
    }
    else {
        clearError(slotError, slotNumberInput);
        return true;
    }
}
// parking 
function validateParking(parkingNumberInput, parkingError) {
    const parking = parkingNumberInput.value.trim();
    if (!parking) {
        displayError(parkingError, "Plz Add slot", parkingNumberInput, "Enter parking Number");
        return false;
    }
    else {
        clearError(parkingError, parkingNumberInput);
        return true;
    }
}

export {
    validateEmail,
    validateUsername,
    validatePhone,
    validateStartTime,
    validateEndTime,
    clearError,
    validateReservation,
    validateVehicleNumber,
    validateParking,
    validateSlot
};
