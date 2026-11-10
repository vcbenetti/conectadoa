import "./style.css";
import { verificarSaude } from "./api.js";
import { telaDoacoes, telaNovaDoacao } from "./pages/doacoes.js";
import { telaDoadores } from "./pages/doadores.js";
const app = document.querySelector("#app");
// Cada endereço depois do # mostra uma tela
const rotas = {
"#/doadores": telaDoadores,
"#/doacoes/nova": telaNovaDoacao,
"#/doacoes": telaDoacoes,
};
function navegar() {
const rota = rotas[location.hash] ? location.hash : "#/doadores";
for (const link of document.querySelectorAll("nav a")) {
if (link.getAttribute("href") === rota) link.setAttribute("aria-current", "page");
else link.removeAttribute("aria-current");
}
rotas[rota](app);
}
window.addEventListener("hashchange", navegar);
navegar();
// Indicador no rodapé, herdado da Aula 1
const statusApi = document.querySelector("#status-api");
verificarSaude()
.then((saude) => (statusApi.textContent = `${saude.status}, banco: ${saude.banco}`))
.catch(() => (statusApi.textContent = "fora do ar"));