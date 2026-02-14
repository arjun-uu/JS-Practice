import { setStudent, getStudent, checkShortlisted } from './utilities.js';
import { validateName, validateEmail, clearError } from './validation.js'


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
    }
}
overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    form.reset();
    saveBtn.textContent = "Submit"
})

document.querySelectorAll('.overlay').forEach(btn => {
    btn.addEventListener('click', ToggleOverlay);
    form.reset();
    saveBtn.textContent = "Submit"
});


// validation
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');


// Real-time validation listeners
nameInput.addEventListener('blur', () => validateName(nameInput, nameError));
emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError));



// Form Handling
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Check validity
    const isNameValid = validateName(nameInput, nameError);
    const isEmailValid = validateEmail(emailInput, emailError);

    if (!isNameValid || !isEmailValid) return;

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
        // Add()
    } else {
        students.push({ id: Date.now(), name, email, marks, status });
    }

    ToggleOverlay();
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
    if (!filtered.length) {
        table.innerHTML = `<tr><td colspan="6" class="text-xl text-center p-4">No result found <i class="ri-user-forbid-line"></i></td></tr>`;
        return;
    }
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
    ToggleOverlay();
    clearError(nameError);
    clearError(emailError);
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

// sort by marks()
const sortBtn = document.getElementById("sort-marks");
let isAscending = true;

sortBtn.addEventListener("click", () => {
    students.sort((a, b) => {
        return isAscending
            ? Number(a.marks) - Number(b.marks)
            : Number(b.marks) - Number(a.marks);
    });

    isAscending = !isAscending;

    sortBtn.innerHTML = isAscending
        ? `Sort by Marks <i class="ri-sort-desc"></i>`
        : `Sort by Marks <i class="ri-sort-asc"></i>`

    renderStudents();
});

filterInput.addEventListener('input', renderStudents)
// init()
renderStudents();