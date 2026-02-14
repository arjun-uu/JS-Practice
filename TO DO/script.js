
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) ||[];
}

let todos = getLocalStorage("todos");
let editId = null; 


const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");



todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleAddTodo();
});

addBtn.addEventListener("click", handleAddTodo);

function handleAddTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  // EDIT MODE
  if (editId !== null) {
    const todo = todos.find(t => t.id === editId);
    if (todo) todo.task = text;

    editId = null;
    addBtn.innerText = "Add";
  }
  // ADD MODE
  else {
    todos.unshift({
      id: Date.now(), // UNIQUE ID
      task: text
    });
  }

  todoInput.value = "";
  saveToLocalStorage();
  renderTodos();
}

// renderTodos()
function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");

    li.className =
      "flex items-center justify-between bg-gray-50 p-3 rounded-lg";

    li.innerHTML = `
      <span>${todo.task}</span>

      <div class="flex gap-2">
        <button onclick = "startEdit(${todo.id})"
          class="edit-btn text-blue-500 border px-2 py-1 rounded">
          Edit
        </button>

        <button onclick = "deleteTodo(${todo.id})"
          class="delete-btn text-red-500 border px-2 py-1 rounded">
          Delete
        </button>
      </div>
    `;

    todoList.appendChild(li);
  });


}



// DELETE
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

// START EDIT
function startEdit(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  todoInput.value = todo.task;
  addBtn.innerText = "Update";
  editId = id;
  todoInput.focus();
}

renderTodos();
