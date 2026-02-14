import { setStudent, getStudent, checkShortlisted } from './utilities.js';

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const marksInput = document.getElementById('marks');
const saveBtn = document.getElementById('save-btn');
const table = document.getElementById('data-table');


let students = getStudent("students");
let editId = null;

// overlay
const overlay = document.getElementById('overlay');

function ToggleOverlay() {
    overlay.classList.toggle('hidden');
    if (overlay.classList.contains('hidden')) {
        form.reset();
        editId = null;
        saveBtn.textContent = 'Submit';
        nameError.textContent = "";
        emailError.textContent = "";
    }
}
overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
})

document.querySelectorAll('.overlay').forEach(btn => {
    btn.addEventListener('click', ToggleOverlay);
});


// validation
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');

let isValid = true;

function validateName() {
    nameError.textContent = "";
    const name = nameInput.value.trim();

    // name validation
    const nameRegx = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!name) {
        nameError.textContent = "Name is required";
        isValid = false;
    }
    else if (name.length < 6) {
        nameError.textContent = "Write full name"
        isValid = false;
    }
    else if (!nameRegx.test(name)) {
        nameError.textContent = "Enter full name";
        isValid = false;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    emailError.textContent = "";


    const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        emailError.textContent = "Email is required";
        isValid = false;
    }
    else if (!emailRegx.test(email)) {
        emailError.textContent = "Enter a valid email";
        isValid = false;
    }
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);


// Form Handling
form.addEventListener('submit', (e) => {
    e.preventDefault();
    isValid = true;

    validateName();
    validateEmail();

    if (!isValid) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const marks = marksInput.value.trim();
    const status = checkShortlisted(marks) ? "Shortlisted" : "Rejected";

    // Update()
    if (editId !== null) {
        const index = students.findIndex(s => s.id === editId);
        students[index] = { id: editId, name, email, marks, status };
        editId = null;
        saveBtn.textContent = "Submit";
    } else {
        // Add()
        if (isValid) {
            students.push({ id: Date.now(), name, email, marks, status });
            ToggleOverlay();
        }
    }

    setStudent("students", students);
    renderStudents();
});

// Rendering()
const filterInput = document.getElementById("filter-input");

function renderStudents() {
    table.innerHTML = '';
    const filterValue = filterInput.value.trim().toLowerCase();
    const filtered = students.filter(s => s.name.toLowerCase().includes(filterValue));
    // no result found
    if (!filtered.length) table.innerHTML = `
    <p class = "text-xl text-center">No result found <i class="ri-user-forbid-line"></i></p>
    `
    filtered.forEach((s, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2 border">${index + 1}</td>
            <td class="p-2 border">${s.name}</td>
            <td class="p-2 border">${s.email}</td>
            <td class="p-2 border">${s.marks}</td>
            <td class="p-2 border">${s.status}</td>
            <td class="p-2 border">
            <button data-id="${s.id}" class="editStudent cursor-pointer bg-violet-500  hover:bg-violet-600 text-white px-3 mr-2 py-1 rounded">Edit <i class="ri-pencil-ai-line"></i></button>
                <button data-id="${s.id}" class="deleteStudent cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete <i class="ri-delete-bin-5-line"></i></button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Event Deligation for edit and delete 
table.addEventListener('click', (e) => {
    if (e.target.classList.contains("editStudent")) {
        editStudent(Number(e.target.dataset.id));
    }
    else if (e.target.classList.contains("deleteStudent")) {
        deleteStudent(Number(e.target.dataset.id));
    }
})

// edit()
function editStudent(id) {
    ToggleOverlay()
    nameError.textContent = "";
    emailError.textContent = "";
    const student = students.find(s => s.id === id);
    if (student) {
        nameInput.value = student.name;
        emailInput.value = student.email;
        marksInput.value = student.marks;
    }
    nameInput.focus();
    editId = id;
    saveBtn.textContent = "Update";
}
// delete()
function deleteStudent(id) {
    if (!confirm("Are u sure to delete this record?")) return;
    students = students.filter(s => s.id !== id);
    setStudent("students", students);
    renderStudents();
}

filterInput.addEventListener('input', renderStudents)
// init()
renderStudents();


