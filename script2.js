/***************************
— VARIÁVEIS GERAIS
 ***************************/

let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const categoriaSelect = document.getElementById("categoria");
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");
const countSpan = document.getElementById("count");

/***************************
— ADICIONAR DESPESA
 ***************************/
document.getElementById("add-expense").addEventListener("click", () => {
    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const categoria = categoriaSelect.value;

    if (!descricao || !valor) {
        alert("Preenche a descrição e o valor!");
        return;
    }

    const novaDespesa = {
        id: Date.now(),
        descricao,
        valor,
        categoria
    };

    despesas.push(novaDespesa);
    guardar();
    atualizarInterface();

    descricaoInput.value = "";
    valorInput.value = "";
});

/***************************
— GUARDAR NO LOCALSTORAGE
 ***************************/
// Guarda as despesas no navegador (localStorage), para não se perderem ao atualizar ou fechar a página

function guardar() {
    localStorage.setItem("despesas", JSON.stringify(despesas));
}

/***************************
— ATUALIZAR TOTAL + CONTADOR
 ***************************/
function atualizarResumo() {
    const total = despesas.reduce((acc, d) => acc + d.valor, 0);

    totalSpan.textContent = "€" + total.toFixed(2);
    countSpan.textContent = despesas.length;
}

/***************************
— MOSTRAR LISTA
 ***************************/
function atualizarLista(filtro = "all") {
    lista.innerHTML = "";

    let listaFinal = despesas;

    if (filtro !== "all") {
        listaFinal = despesas.filter(d => d.categoria === filtro);
    }

    if (listaFinal.length === 0) {
        lista.innerHTML = `<p class="empty">no expenses yet! add your first one ✨</p>`;
        return;
    }

    listaFinal.forEach(despesa => {
        const item = document.createElement("div");
        item.className = "expense-item";
        item.innerHTML = `
            <div>
                <strong>${despesa.descricao}</strong><br>
                <small>${despesa.categoria}</small>
            </div>

            <div>
                <strong>€${despesa.valor.toFixed(2)}</strong>
            </div>

            <div class="actions">
                <button class="edit" onclick="editar(${despesa.id})">✏️</button>
                <button class="delete" onclick="apagar(${despesa.id})">🗑️</button>
            </div>
        `;

        lista.appendChild(item);
    });
}

/***************************
— APAGAR DESPESA
 ***************************/
function apagar(id) {
    despesas = despesas.filter(d => d.id !== id);
    guardar();
    atualizarInterface();
}

/***************************
— EDITAR DESPESA
 ***************************/
function editar(id) {
    const despesa = despesas.find(d => d.id === id);

    const novaDescricao = prompt("Nova descrição:", despesa.descricao);
    if (!novaDescricao) return;

    const novoValor = parseFloat(prompt("Novo valor:", despesa.valor));
    if (isNaN(novoValor)) return;

    despesa.descricao = novaDescricao;
    despesa.valor = novoValor;

    guardar();
    atualizarInterface();
}

/***************************
— FILTRO DE CATEGORIA
 ***************************/
document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filtro = btn.dataset.filter;
        atualizarLista(filtro);
    });
});

/***************************
— TEMA ESCURO/CLARO
 ***************************/
const themeBtn = document.getElementById("theme-toggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeBtn.textContent = 
        document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});

/***************************
— RELÓGIO E DATA
 ***************************/
function atualizarDataHora() {
    const agora = new Date();
    const elem = document.getElementById("datetime");

    elem.textContent = agora.toLocaleString("pt-PT", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

setInterval(atualizarDataHora, 1000);
atualizarDataHora();

/***************************
— API METEOROLOGIA
 ***************************/
async function carregarTempo() {
    const API = "https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&current_weather=true";

    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("weather-city").textContent = "Lisboa";
    document.getElementById("weather-temp").textContent = data.current_weather.temperature + "°C";
    document.getElementById("weather-desc").textContent = "Parcialmente nublado";
    document.getElementById("weather-wind").textContent = "💨 " + data.current_weather.windspeed + " km/h";
    document.getElementById("weather-humidity").textContent = "💧 --%";
}

carregarTempo();

/***************************
— ATUALIZAR INTERFACE TOTAL
 ***************************/
function atualizarInterface() {
    atualizarResumo();
    atualizarLista(document.querySelector(".filter.active").dataset.filter);
}

// Inicialização
atualizarInterface();





































// ----------------------------
//   TEMA CLARO / ESCURO
// ----------------------------

// Declarar variáveis
// const themeButton = document.getElementById("theme-toggle");
// const body = document.body;

// Alternar tema claro/escuro ao clicar no botão
// themeButton.addEventListener("click", function() {
//   body.classList.toggle("dark-theme");

//   //VER MELHOR ISTO AQUI!!
//   // Para mudar o ícone do botão
//   themeButton.textContent = body.classList.contains("dark-theme") ? "☀️" : "🌙";

// });

// ----------------------------
//   DATA / HORA EM TEMPO REAL
// ----------------------------
// function atualizarDataHora() {
//   const agora = new Date();
//   document.getElementById("datetime").textContent =
//     agora.toLocaleString("pt-PT");
// }
// setInterval(atualizarDataHora, 1000);
// atualizarDataHora();

// ----------------------------
//   GESTÃO DE DESPESAS
// ----------------------------