// ----------------------------
//   TEMA CLARO / ESCURO
// ----------------------------

// Declarar variáveis
const themeButton = document.getElementById("theme-toggle");
const body = document.body;

// Alternar tema claro/escuro ao clicar no botão
themeButton.addEventListener("click", function() {
  body.classList.toggle("dark-theme");

  //VER MELHOR ISTO AQUI!!
  // Para mudar o ícone do botão
  themeButton.textContent = body.classList.contains("dark-theme") ? "☀️" : "🌙";

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

