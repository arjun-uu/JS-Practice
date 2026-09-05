import { setReservationData, getReservationData } from './storage.js';
import { validateUsername, validateEmail, validatePhone, validateStartTime, validateReservation, validateEndTime, validateParking, validateSlot, validateVehicleNumber, clearError } from './validation.js';

const overlay = document.getElementById('overlay');
const form = document.getElementById('form');
const formHeader = document.getElementById('form-header');
const table = document.getElementById('table-data');

let reservations = getReservationData('reservations');
let editId = null;

const usernameInput = document.getElementById('username')
const emailInput = document.getElementById('email')
const mobileNumberInput = document.getElementById('mobile-number')
const vehicleNumberInput = document.getElementById('vehicle-number')
const slotNumberInput = document.getElementById('slot-number')
const parkingNumberInput = document.getElementById('parking-number')
const startTimeInput = document.getElementById('start-time')
const endTimeInput = document.getElementById('end-time')
const reservationStatusInput = document.getElementById('reservation-status')

// form overlay--------------------------------------------------------- 
function clearAllErrors() {
    clearError(usernameError, usernameInput);
    clearError(emailError, emailInput);
    clearError(mobileNumberError, mobileNumberInput);
    clearError(startTimeError, startTimeInput);
    clearError(endTimeError, endTimeInput);
    clearError(reservationError, reservationStatusInput)
    clearError(vehicleError, vehicleNumberInput)
    clearError(slotError, slotNumberInput)
    clearError(parkingError, parkingNumberInput)
}

function toggleOverlay() {
    overlay.classList.toggle('hidden');
    if (overlay.classList.contains('hidden')) {
        form.reset();
        clearAllErrors();
        editId = null;
        formHeader.innerText = "Add Reservation";
    }
}

document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        toggleOverlay();
        clearAllErrors();
    });
});

// error dom elements----------------------------------------------
const usernameError = document.getElementById('usernameError')
const emailError = document.getElementById('emailError')
const mobileNumberError = document.getElementById('mobileNoError')
const startTimeError = document.getElementById('startTimeError')
const endTimeError = document.getElementById('endTimeError')
const reservationError = document.getElementById('reservationError')
const vehicleError = document.getElementById('vehicleError')
const slotError = document.getElementById('slotError')
const parkingError = document.getElementById('parkingError')

// validation---------------------------------------------
usernameInput.addEventListener('blur', () => validateUsername(usernameInput, usernameError))
emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError))
mobileNumberInput.addEventListener('blur', () => validatePhone(mobileNumberInput, mobileNumberError))
startTimeInput.addEventListener('blur', () => validateStartTime(startTimeInput, startTimeError));
endTimeInput.addEventListener('blur', () => validateEndTime(startTimeInput, endTimeInput, endTimeError));
reservationStatusInput.addEventListener('blur', () => validateReservation(reservationStatusInput, reservationError));
vehicleNumberInput.addEventListener('blur', () => validateVehicleNumber(vehicleNumberInput, vehicleError));
slotNumberInput.addEventListener('blur', () => validateSlot(slotNumberInput, slotError));
parkingNumberInput.addEventListener('blur', () => validateParking(parkingNumberInput, parkingError));

// Form handling
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        id: editId || Date.now(),
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        mobile: mobileNumberInput.value.trim(),
        vehicle: vehicleNumberInput.value.trim(),
        slot: slotNumberInput.value.trim(),
        parking: parkingNumberInput.value.trim(),
        start: startTimeInput.value,
        end: endTimeInput.value,
        status: reservationStatusInput.value
    };
    const isValidUsername = validateUsername(usernameInput, usernameError)
    const isValidEmail = validateEmail(emailInput, emailError)
    const isValidPhone = validatePhone(mobileNumberInput, mobileNumberError)
    const isValidStartTime = validateStartTime(startTimeInput, startTimeError);
    const isValidEndTime = validateEndTime(startTimeInput, endTimeInput, endTimeError);
    const isValidReservationStatus = validateReservation(reservationStatusInput, reservationError);
    const isValidVehicleNumber = validateVehicleNumber(vehicleNumberInput, vehicleError);
    const isValidSlot = validateSlot(slotNumberInput, slotError);
    const isValidParking = validateParking(parkingNumberInput, parkingError);

    if (!isValidEmail || !isValidUsername || !isValidReservationStatus || !isValidParking || !isValidSlot || !isValidVehicleNumber || !isValidPhone || !isValidStartTime || !isValidEndTime) {
        return;
    }

    if (editId !== null) {
        const index = reservations.findIndex(r => r.id === editId);
        reservations[index] = formData;
        editId = null;
        formHeader.textContent = "Add Reservation";
    } else {
        reservations.push(formData);
    }
    setReservationData('reservations', reservations);
    renderData();
    toggleOverlay();
});

// rendering data------------------------------------------------
let currentPage = 1;
const rowsPerPage = 3;

const searchInput = document.getElementById('search-input');
function renderData() {
    table.innerHTML = '';
    const searchValue = searchInput.value.trim().toLowerCase();

    // Searching-------------------------------------------------
    const filtered = reservations.filter(r => {
        return r.username.toLowerCase().includes(searchValue) ||
            r.email.toLowerCase().includes(searchValue) ||
            r.mobile.toLowerCase().includes(searchValue) ||
            r.vehicle.toLowerCase().includes(searchValue) ||
            r.slot.toLowerCase().includes(searchValue) ||
            r.parking.toLowerCase().includes(searchValue) ||
            r.start.toLowerCase().includes(searchValue) ||
            r.end.toLowerCase().includes(searchValue) ||
            r.status.toLowerCase().includes(searchValue)
    });

    // empty filtered array
    if (!filtered.length) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="11" class="p-4 text-center">No User Found <i class="ri-user-forbid-line"></i></td>`;
        table.append(row);
        return;
    }

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    // pegination details
    const details = document.getElementById('pagination-details');
    if (details) {
        details.innerText = `Showing ${currentPage}-${totalPages} of ${totalPages}`;
    }

    // dynamic styles for reservation status
    const statusStyles = {
        booked: "bg-blue-100 text-blue-800 border-blue-500",
        completed: "bg-yellow-100 text-yellow-800 border-yellow-500",
        active: "bg-green-100 text-green-800 border-green-500",
        default: "bg-gray-100 text-gray-800 border-gray-500"
    };

    paginatedItems.forEach(r => {
        const start = new Date(r.start).toLocaleString().split('T');
        const end = new Date(r.end).toLocaleString().split('T');

        const row = document.createElement('tr');
        if (r.status === 'active') {
            row.classList.add('bg-[#0d573b]', 'border-l-3', 'border-l-green-500')
        }
        row.innerHTML = ` 
            <td class="p-2 px-6">R-${r.id.toString().slice(-4)}</td>
            <td class="p-2 px-6">${r.username}</td>
            <td class="p-2 px-6">${r.email}</td>
            <td class="p-2 px-6">${r.mobile}</td>
            <td class="p-2 uppercase px-6">${r.vehicle}</td>
            <td class="p-2 px-6">${r.slot}</td>
            <td class="p-2 px-6">${r.parking}</td>
            <td class="p-2 px-6">${start}</td>
            <td class="p-2 px-6">${end}</td>
           <td class="p-2 px-6"> <span class="px-4 py-2 rounded-full border font-bold ${statusStyles[r.status.toLowerCase()] || statusStyles.default}">
          ${r.status}</span> </td>
           <td class="p-2 px-6 flex gap-2 flex-col">
                <button data-id="${r.id}" class="editBtn bg-gray-600 text-white px-3 py-1 rounded-2xl cursor-pointer">Edit</button>
                <button data-id="${r.id}" class="deleteBtn bg-red-600 text-white px-3 py-1 rounded-2xl cursor-pointer">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
    renderPaginationControls(totalPages);
}

table.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains('editBtn')) editReservation(id);
    if (e.target.classList.contains('deleteBtn')) deleteReservation(id);
});

// Pagination Controls-----------------------------
function renderPaginationControls(totalPages) {
    const container = document.getElementById('pagination-controls');
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const maxVisible = 1;
    let startPage = Math.floor((currentPage - 1) / maxVisible) * maxVisible + 1;
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);

    //  Previous btn
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = `<i class="ri-arrow-left-s-line"></i>`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.className =
        `px-3 py-1 border rounded-2xl border-white text-white  rounded ${currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer active:scale-95'
        }`;

    prevBtn.onclick = () => {
        currentPage--;
        renderData();
    };

    container.appendChild(prevBtn);

    // Page btns
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className =
            "px-4 py-1 border rounded-2xl cursor-pointer transition-colors  bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold";

        btn.onclick = () => {
            currentPage = i;
            renderData();
        };
        container.appendChild(btn);
    }

    //  Next btn
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = `<i class="ri-arrow-right-s-line"></i>`
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className =
        `px-3 py-1 border rounded-2xl border-white text-white ${currentPage === totalPages
            ? 'opacity-50 text-black cursor-not-allowed'
            : 'cursor-pointer active:scale-95'
        }`;
    nextBtn.onclick = () => {
        currentPage++;
        renderData();
    };
    container.appendChild(nextBtn);
}

document.addEventListener('DOMContentLoaded', () => {
    const details = document.getElementById('pagination-details');
    if (details) {
        details.innerText = `Showing 1-${totalPages} of ${totalPages}`;
    }
});

//Sorting------------------------------------
const sortBy = document.getElementById('sort-by');
const btnStart = document.getElementById('sort-start');
const btnStatus = document.getElementById('sort-status');
const sortDirections = { startTime: true, status: true, default: true };

const handleSort = (sortValue) => {
    const isAsc = sortDirections[sortValue] ?? true;

    switch (sortValue) {
        case 'startTime':
            reservations.sort((a, b) => isAsc ? new Date(a.start) - new Date(b.start) : new Date(b.start) - new Date(a.start));
            break;
        case 'status':
            reservations.sort((a, b) => isAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
            break;
        default:
            reservations.sort((a, b) => isAsc ? a.id - b.id : b.id - a.id);
            break;
    }

    sortDirections[sortValue] = !isAsc;
    currentPage = 1;
    renderData();
};

sortBy.addEventListener('change', (e) => {
    handleSort(e.target.value);
});

btnStart.addEventListener('click', () => {
    sortBy.value = 'startTime';
    handleSort('startTime');
});

btnStatus.addEventListener('click', () => {
    sortBy.value = 'status';
    handleSort('status');
});


// edit-------------------------------------------------------
function editReservation(id) {
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    editId = id;
    formHeader.textContent = "Edit Reservation";

    usernameInput.value = res.username;
    emailInput.value = res.email;
    mobileNumberInput.value = res.mobile;
    vehicleNumberInput.value = res.vehicle;
    slotNumberInput.value = res.slot;
    parkingNumberInput.value = res.parking;
    startTimeInput.value = res.start;
    endTimeInput.value = res.end;
    reservationStatusInput.value = res.status;

    toggleOverlay();
    usernameInput.focus();
}

// delete------------------------------------------

const deleteOverlay = document.getElementById('delete-overlay');
const cancelBtn = document.getElementById('cancel-delete');
const confirmBtn = document.getElementById('confirm-delete');

let reservationIdToDelete = null;

function deleteReservation(id) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation.status === 'completed') {
        deleteError.classList.toggle('hidden')
        return;
    }
    reservationIdToDelete = id;
    deleteOverlay.classList.remove('hidden');
}

function closeDeleteModal() {
    deleteOverlay.classList.add('hidden');
    reservationIdToDelete = null;
}

cancelBtn.addEventListener('click', closeDeleteModal);

const deleteError = document.getElementById('error-delete')

confirmBtn.addEventListener('click', () => {
    if (reservationIdToDelete !== null) {
        reservations = reservations.filter(r => r.id !== reservationIdToDelete);
        setReservationData('reservations', reservations);
        renderData();
        closeDeleteModal();
    }
});

document.getElementById('ok').addEventListener('click', () => {
    deleteError.classList.toggle('hidden');
})

deleteOverlay.addEventListener('click', (e) => {
    if (e.target === deleteOverlay) closeDeleteModal();
});

// init()----------------------------------------
searchInput.addEventListener('input', renderData)
renderData();