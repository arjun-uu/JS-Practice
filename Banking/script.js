import { setAccount, getAccount } from './utilities.js';

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const table = document.getElementById('account-table');
const overlay = document.getElementById('overlay');
const saveBtn = document.getElementById('save-btn');
const toggleModel = document.querySelectorAll('.toggle-model');

let accounts = getAccount("accounts");
let editId = null;


// ================= Overlay =================

function toggleOverlay() {
    overlay.classList.toggle("hidden");

    if (overlay.classList.contains("hidden")) {
        form.reset();
        editId = null;
        saveBtn.textContent = "Create Account";
    }
}

toggleModel.forEach(btn => {
    btn.addEventListener('click', toggleOverlay);
})

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) toggleOverlay();
});


// ================= Form Handling =================

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const balance = Number(amountInput.value);

    if (editId !== null) {
        const index = accounts.findIndex(a => a.id === editId);
        accounts[index].name = name;
    } else {
        accounts.push({
            id: Date.now(),
            name,
            balance,
            transactions: [
                { type: "Initial Deposit", amount: balance }
            ]
        });
    }

    setAccount("accounts", accounts);
    renderAccounts();
    toggleOverlay();
});


// ================= Render =================

function renderAccounts() {
    table.innerHTML = "";

    if (!accounts.length) {
        table.innerHTML = `
          <tr>
            <td colspan="4" class="text-center p-6 text-gray-500">
              No Accounts Found
            </td>
          </tr>
        `;
        return;
    }

    accounts.forEach((acc, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-3 border">${index + 1}</td>
            <td class="p-3 border">${acc.name}</td>
            <td class="p-3 border font-semibold">₹ ${acc.balance}</td>
            <td class="p-3 border space-x-2">
                <button data-id="${acc.id}" class="deposit bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">Deposit</button>
                <button data-id="${acc.id}" class="withdraw bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">Withdraw</button>
                <button data-id="${acc.id}" class="history bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">History</button>
                <button data-id="${acc.id}" class="delete bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                <button data-id="${acc.id}" class="edit bg-violet-500 hover:bg-violet-600 text-white px-2 py-1 rounded">Edit</button>
            </td>
        `;

        table.appendChild(row);
    });
}


// ================= Event Delegation =================

table.addEventListener("click", (e) => {
    const depositBtn = e.target.closest(".deposit");
    const withdrawBtn = e.target.closest(".withdraw");
    const historyBtn = e.target.closest(".history");
    const deleteBtn = e.target.closest(".delete");
    const editBtn = e.target.closest(".edit");

    if (depositBtn) depositMoney(Number(depositBtn.dataset.id));
    if (withdrawBtn) withdrawMoney(Number(withdrawBtn.dataset.id));
    if (historyBtn) showHistory(Number(historyBtn.dataset.id));
    if (deleteBtn) deleteAccount(Number(deleteBtn.dataset.id));
    if (editBtn) editAccount(Number(editBtn.dataset.id));
});


// ================= Deposit =================

function depositMoney(id) {
    const amount = Number(prompt("Enter deposit amount"));
    if (!amount) return;

    const account = accounts.find(a => a.id === id);

    account.balance += amount;
    account.transactions.push({ type: "Deposit", amount });

    setAccount("accounts", accounts);
    renderAccounts();
}


// ================= Withdraw =================

function withdrawMoney(id) {
    const amount = Number(prompt("Enter withdraw amount"));
    if (!amount) return;

    const account = accounts.find(a => a.id === id);

    if (amount > account.balance) {
        alert("Insufficient Balance");
        return;
    }

    account.balance -= amount;
    account.transactions.push({ type: "Withdraw", amount });

    setAccount("accounts", accounts);
    renderAccounts();
}


// ================= History =================

function showHistory(id) {
    const account = accounts.find(a => a.id === id);

    let historyText = account.transactions
        .map(t => `${t.type}: ₹${t.amount}`)
        .join("\n");

    alert(`Transaction History for ${account.name}\n\n${historyText}`);
}


// ================= Delete =================

function deleteAccount(id) {
    if (!confirm("Delete this account?")) return;

    accounts = accounts.filter(a => a.id !== id);

    setAccount("accounts", accounts);
    renderAccounts();
}

// ==================Edit========================

function editAccount(id) {
    toggleOverlay();
    const account = accounts.find(acc => acc.id === id);
    if (account) {
        nameInput.value = account.name;
        nameInput.focus();
        amountInput.disabled = true;
        editId = id;
        saveBtn.textContent = "Update"
    }
}

// ================= Init =================

renderAccounts();
