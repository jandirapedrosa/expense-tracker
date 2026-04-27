/***************************
— VARIÁVEIS GERAIS
 ***************************/

// Inicializa o array de despesas
// Tenta carregar do localStorage, se não existir cria array vazio
let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

// Referência formulário
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const categoriaSelect = document.getElementById("categoria");

// Referência interface
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");
const countSpan = document.getElementById("count");

/***************************
— ADICIONAR DESPESA
 ***************************/
document.getElementById("add-expense").addEventListener("click", () => {
    // Obtem os valores dos inputs
    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const categoria = categoriaSelect.value;

// Validar preenchimento
    if (!descricao || !valor) {
        alert("Preenche a descrição e o valor!");
        return;
    }

// ID único gerado com timestamp
    const novaDespesa = {
        id: Date.now(),
        descricao,
        valor,
        categoria
    };

// Adiciona ao array e guarda
    despesas.push(novaDespesa);
    guardar();
    atualizarInterface();

// Limpar os inputs após adicionar
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
// Calcula o total de todas as despesas e conta quantas existem
// Atualiza od elementos HTML com os valores calculados
function atualizarResumo() {
    // Soma todos os valores utilizando o reduce
    const total = despesas.reduce((acc, d) => acc + d.valor, 0);

    // Atualiza o HTML com o total formato
    totalSpan.textContent = "€" + total.toFixed(2);
    // Atualizar o contador de despesas
    countSpan.textContent = despesas.length;
}

/***************************
— MOSTRAR LISTA
 ***************************/
function atualizarLista(filtro = "all") {
// limpa a lista HTML (antes de renderizar)
    lista.innerHTML = "";

    // Aplica filtro se não for 'all'
    let listaFinal = despesas;

    if (filtro !== "all") {
        listaFinal = despesas.filter(d => d.categoria === filtro);
    }

    // Se não houver despesas
    if (listaFinal.length === 0) {
        lista.innerHTML = `<p class="empty">no expenses yet! add your first one ✨</p>`;
        return;
    }

    // Cria um elemento HTML para cada despesa
    listaFinal.forEach(despesa => {
        const item = document.createElement("div");
        item.className = "expense-item";

        // Template HTML da despesa
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

        // OUTRA FORMA - Event listeners
        // const btnEdit = item.querySelector(".edit");
        // const btnDelete = item.querySelector(".delete");

        // btnEdit.addEventListener("click", () => editar(despesa.id));
        // btnDelete.addEventListener("click", () => apagar(despesa.id));

        lista.appendChild(item);
    });
}

/***************************
— APAGAR DESPESA
 ***************************/
function apagar(id) {
    // Filtra o array removendo a despesa com este ID
    despesas = despesas.filter(d => d.id !== id);

    // Atualiza o localStorage e interface
    guardar();
    atualizarInterface();
}

/***************************
— EDITAR DESPESA
 ***************************/
function editar(id) {
    // Encontra a despesa pelo ID
    const despesa = despesas.find(d => d.id === id);

// Pedir uma nova descrição via prompt
    const novaDescricao = prompt("Nova descrição:", despesa.descricao);
    if (!novaDescricao) return; // cancelar

// Pedir novo valor
    const novoValor = parseFloat(prompt("Novo valor:", despesa.valor));
    if (isNaN(novoValor)) return;  // valor inválido

// Atualizar os dados da despesa
    despesa.descricao = novaDescricao;
    despesa.valor = novoValor;

// Guardar e atualizar interface
    guardar();
    atualizarInterface();
}

/***************************
— FILTRO DE CATEGORIA
 ***************************/
// Adiconar event listener a todos os botões de filtro
document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {

        // REmove a classe 'active' de todos os botões
        document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));

        // Adiciona 'active' ao botão clicado
        btn.classList.add("active");

        // Obtém a categoria do atributo data-filter e filtraa
        const filtro = btn.dataset.filter;
        atualizarLista(filtro);
    });
});

/***************************
— TEMA ESCURO/CLARO
 ***************************/
const themeBtn = document.getElementById("theme-toggle");

themeBtn.addEventListener("click", () => {
    // Alterna a classe que controla o tema
    document.body.classList.toggle("dark-theme");

    // Muda o emoji do botão conforme o tema atico
    themeBtn.textContent = 
        document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});

/***************************
— RELÓGIO E DATA
 ***************************/
// a cada segundo, escreve a data e hora atualizada no elemento #datetime
function atualizarDataHora() {
    const agora = new Date();
    const elem = document.getElementById("datetime");

    // Formata a data em português
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

// Atualiza a cada segundo
setInterval(atualizarDataHora, 1000);
// Primeira atualização imediata
atualizarDataHora();

/***************************
— API METEOROLOGIA
 ***************************/
async function carregarTempo() {
    const API = "https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&current_weather=true";

    const res = await fetch(API);
    const data = await res.json();

    // Atualiza elementos HTML com dados reais
    document.getElementById("weather-city").textContent = "Lisboa";
    document.getElementById("weather-temp").textContent = data.current_weather.temperature + "°C";
    document.getElementById("weather-desc").textContent = "Parcialmente nublado";
    document.getElementById("weather-wind").textContent = "💨 " + data.current_weather.windspeed + " km/h";
    document.getElementById("weather-humidity").textContent = "💧 --%";
}

carregarTempo();

// humidade fica --% (neste API não vem) - procurar

/***************************
— ATUALIZAR INTERFACE TOTAL
 ***************************/
function atualizarInterface() {
    atualizarResumo();
    // Obtém o filtro ativo atual
    atualizarLista(document.querySelector(".filter.active").dataset.filter);
}

// Inicialização
// Carrega e mostra os dados ao abrir a página
atualizarInterface();

















