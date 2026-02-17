import { setData, getData } from './utility.js';
import { validateEmail, validateName, validatePassword, clearError } from './validation.js';

// form Dom Elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const dateInput = document.getElementById('date');
const form = document.getElementById('form');
const formBtn = document.getElementById('form-btn');

// toggle Overlay Functionality------------------------------------------
const overlay = document.getElementById('overlay');
const overlayForm = document.getElementById('overlayForm');
const toggleBtns = document.querySelectorAll('.overlay');

function toggleOverlay() {
    overlay.classList.toggle('hidden');
    form.reset();
    formBtn.textContent = 'Submit'
    // clearing all errors field
    clearError(nameError);
    clearError(emailError);
    clearError(passwordError);
}

toggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleOverlay);
});

overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    form.reset();
});

overlayForm.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Data management
let users = getData('users');
let editId = null;

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

nameInput.addEventListener('blur', () => validateName(nameInput, nameError));
emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError));
passwordInput.addEventListener('blur', () => validatePassword(passwordInput, passwordError));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValidName = validateName(nameInput, nameError);
    const isValidEmail = validateEmail(emailInput, emailError);
    const isValidPassword = validatePassword(passwordInput, passwordError);

    if (!isValidEmail || !isValidName || !isValidPassword) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const date = dateInput.value;

    // edit()
    if (editId !== null) {
        const index = users.findIndex(user => user.id === editId);
        if (index !== -1) {
            users[index] = { id: editId, name, email, password, date };
            editId = null;
            formBtn.textContent = 'Submit';
        }
        // add()
    } else {
        users.push({ id: Date.now(), name, email, password, date });
    }

    setData('users', users);
    renderData();
    toggleOverlay();

});

let currentPage = 1;
const rowsPerPage = 5;
// renderData()-----------------------------------------------
const table = document.getElementById('table');
const serachInput = document.getElementById('search');
function renderData() {
    table.innerHTML = '';
    const searchValue = serachInput.value.trim().toLowerCase();
    const filtered = users.filter(user => {
    return (
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.password.toLowerCase().includes(searchValue) ||
        user.date.toLowerCase().includes(searchValue)
    );
});


    if (!filtered.length) {
        table.innerHTML = `<tr><td colspan="6" class="text-xl text-center p-4">No result found <i class="ri-user-forbid-line"></i></td></tr>`;
        document.getElementById('pagination-controls').innerHTML = '';
        return;
    }


    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    paginatedItems.forEach((user) => {
        const row = document.createElement('tr');
        row.classList.add('text-center');
        row.innerHTML = `
                        <td class="p-2 border">${users.indexOf(user)+1}</td>
                        <td class="p-2 border">${user.name}</td>
                        <td class="p-2 border">${user.email}</td>
                        <td class="p-2 border">${user.password}</td>
                        <td class="p-2 border">${user.date}</td>
                        <td class="p-2 border ">
                            <button data-id='${user.id}' class="mr-4 edit p-2 py-1 bg-violet-500 hover:bg-violet-600 cursor-pointer active:scale-95 text-white font-bold rounded">Edit</button>

                            <button data-id='${user.id}' class=" delete p-2 py-1 bg-red-500 hover:bg-red-600 cursor-pointer active:scale-95 text-white font-bold rounded">Delete</button>
                        </td>
    `
        table.append(row)
    })
    renderPaginationControls(totalPages);
}
table.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains('edit')) {
        editUser(id);
    }
    if (e.target.classList.contains('delete')) {
        deleteUser(id);
    }
})

// rendering Pagination Controls-----------------------------
function renderPaginationControls(totalPages) {
    const container = document.getElementById('pagination-controls');
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const maxVisible = 5;

    let startPage = Math.floor((currentPage - 1) / maxVisible) * maxVisible + 1;
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);

    // ✅ Previous
    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.className =
        `px-3 py-1 border rounded ${
            currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-gray-100'
        }`;

    prevBtn.onclick = () => {
        currentPage--;
        renderData();
    };

    container.appendChild(prevBtn);

    // ✅ Page Buttons
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;

        btn.className =
            `px-4 py-1 border rounded cursor-pointer transition-colors ${
                currentPage === i
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-white hover:bg-gray-100'
            }`;

        btn.onclick = () => {
            currentPage = i;
            renderData();
        };

        container.appendChild(btn);
    }

    // ✅ Next
    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className =
        `px-3 py-1 border rounded ${
            currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-gray-100'
        }`;

    nextBtn.onclick = () => {
        currentPage++;
        renderData();
    };

    container.appendChild(nextBtn);
}

// editId()----------------------------------------
function editUser(id) {
    toggleOverlay()
    const user = users.find(user => user.id === id);
    if (user) {
        nameInput.value = user.name;
        emailInput.value = user.email;
        passwordInput.value = user.password;
        dateInput.value = user.date;
    }
    editId = id;
    formBtn.textContent = 'Update'
    nameInput.focus();

}
// delete()--------------------------------
function deleteUser(id) {
    if (!confirm("Do you want to delete this record")) return;
    users = users.filter(user => user.id !== id);
    setData("users", users);
    renderData();
}

// sort by date()----------------------------------------

const sortBtn = document.getElementById('sort-btn');
let isAscending = true;

function sortByDate() {
    users.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return isAscending ? dateA - dateB : dateB - dateA
    })
    isAscending = !isAscending;

    sortBtn.innerHTML = isAscending
        ? `Sort by Date <i class="ri-sort-asc"></i>`
        : `Sort by Date <i class="ri-sort-desc"></i>`
    renderData();
}
sortBtn.addEventListener('click', sortByDate);

serachInput.addEventListener('input', () => {
    currentPage = 1;
    renderData()
});

// init()
renderData();


