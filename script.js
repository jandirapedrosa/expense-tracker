// ----------------------------
//   TEMA CLARO / ESCURO
// ----------------------------
const themeSwitcher = document.getElementById("themeSwitcher");
const body = document.body;

themeSwitcher.addEventListener("change", () => {
  body.classList.toggle("dark-theme");
});


// ----------------------------
//   DATA / HORA EM TEMPO REAL
// ----------------------------
function atualizarDataHora() {
  const agora = new Date();
  document.getElementById("datetime").textContent =
    agora.toLocaleString("pt-PT");
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();


// ----------------------------
//   GESTÃO DE DESPESAS
// ----------------------------
let expenses = [];

const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const filterCategory = document.getElementById("filterCategory");

// Adicionar despesa
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  const expense = {
    id: Date.now(),
    description,
    amount,
    category
  };

  expenses.push(expense);
  form.reset();
  renderExpenses();
});

// Renderização da lista filtrada
function renderExpenses() {
  const filtro = filterCategory.value;
  expenseList.innerHTML = "";

  const filtered = filtro === "todos"
    ? expenses
    : expenses.filter(e => e.category === filtro);

  let total = 0;

  filtered.forEach(exp => {
    total += exp.amount;

    const li = document.createElement("li");
    li.classList.add("expense-item");
    li.innerHTML = `
      <span>${exp.description} (${exp.category}) - ${exp.amount.toFixed(2)}€</span>
      <button class="remove-btn" data-id="${exp.id}">❌</button>
    `;
    expenseList.appendChild(li);
  });

  totalAmount.textContent = `${total.toFixed(2)}€`;
}

// Remover item
expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const id = Number(e.target.dataset.id);
    expenses = expenses.filter(exp => exp.id !== id);
    renderExpenses();
  }
});

// Atualizar lista ao mudar filtro
filterCategory.addEventListener("change", renderExpenses);


// ----------------------------
//   API DE EXEMPLO (TEMPO)
// ----------------------------
const apiDiv = document.getElementById("apiData");

// API falsa para demonstração
function carregarAPI() {
  apiDiv.textContent = "Carregando...";

  // Simula uma chamada à API
  setTimeout(() => {
    const temperatura = (Math.random() * 15 + 10).toFixed(1); // temperatura 10° a 25°
    const estados = ["Sol", "Nuvens", "Chuva"];
    const estado = estados[Math.floor(Math.random() * estados.length)];

    apiDiv.textContent = `Tempo agora: ${temperatura}°C | ${estado}`;
  }, 1000);
}

carregarAPI();
