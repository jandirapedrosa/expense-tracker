// =============================
// Gestor de Despesas Pessoais
// JavaScript
// =============================

// Seletores
const form = document.getElementById("expenseForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const filterCategory = document.getElementById("filterCategory");
const themeSwitcher = document.getElementById("themeSwitcher");
const apiData = document.getElementById("apiData");
const datetimeDiv = document.getElementById("datetime");

let expenses = []; // Armazena despesas

// =============================
// Atualizar Data/Hora
// =============================
function updateDateTime() {
    const now = new Date();
    datetimeDiv.textContent = now.toLocaleString("pt-PT");
}
setInterval(updateDateTime, 1000);
updateDateTime();

// =============================
// Adicionar Despesa
// =============================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const expense = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        category: categoryInput.value,
    };

    expenses.push(expense);
    renderExpenses();

    form.reset();
});

// =============================
// Renderizar Lista
// =============================
function renderExpenses() {
    list.innerHTML = "";

    const filtered = filterCategory.value === "todos"
        ? expenses
        : expenses.filter(exp => exp.category === filterCategory.value);

    filtered.forEach(exp => {
        const li = document.createElement("li");
        li.classList.add("expense-item");
        li.innerHTML = `
            <span>${exp.description} - ${exp.amount.toFixed(2)}€ (${exp.category})</span>
            <div>
                <button class="edit-btn" onclick="editExpense(${exp.id})">Editar</button>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">Apagar</button>
            </div>
        `;
        list.appendChild(li);
    });

    updateTotal();
}

// =============================
// Atualizar Total
// =============================
function updateTotal() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalAmount.textContent = total.toFixed(2) + "€";
}

// =============================
// Apagar Despesa
// =============================
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    renderExpenses();
}

// =============================
// Editar Despesa
// =============================
function editExpense(id) {
    const exp = expenses.find(e => e.id === id);

    const newDesc = prompt("Editar descrição:", exp.description);
    const newAmount = prompt("Editar valor:", exp.amount);
    const newCat = prompt("Editar categoria:", exp.category);

    if (newDesc && newAmount && newCat) {
        exp.description = newDesc;
        exp.amount = parseFloat(newAmount);
        exp.category = newCat;
    }

    renderExpenses();
}

// =============================
// Filtrar por categoria
// =============================
filterCategory.addEventListener("change", renderExpenses);

// =============================
// Tema Claro/Escuro
// =============================
themeSwitcher.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
});

// =============================
// API Externa - Exemplo: Tempo
// (Open-Meteo API – sem chave)
// =============================
async function loadWeather() {
    try {
        const resp = await fetch("https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&current_weather=true");
        const data = await resp.json();

        apiData.textContent = `Temperatura Atual em Lisboa: ${data.current_weather.temperature}°C`;
    } catch (error) {
        apiData.textContent = "Erro ao carregar dados da API";
    }
}

loadWeather();
