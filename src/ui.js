// Funções de apoio usadas por todas as telas.
// Cria um elemento HTML. Exemplo: el("li", { class: "cartao" }, "Ana Souza")// Os textos entram como texto puro (como em textContent): nunca são interpretados como HTML.
export function el(tag, atributos = {}, ...filhos) {
const elemento = document.createElement(tag);
for (const [nome, valor] of Object.entries(atributos)) {
if (nome.startsWith("on")) {
elemento.addEventListener(nome.slice(2), valor); // onclick vira
addEventListener("click")
} else {
elemento.setAttribute(nome, valor);
}
}
elemento.append(...filhos.filter((filho) => filho !== null && filho !== undefined));
return elemento;
}
// Mostra uma mensagem de sucesso ou de erro em uma caixa da tela
export function mostrarMensagem(caixa, texto, tipo = "sucesso") {
caixa.textContent = texto;
caixa.className = `mensagem ${tipo}`;
caixa.hidden = false;
}
export function esconderMensagem(caixa) {
caixa.hidden = true;
}
// Item de lista para os estados "carregando" e "vazio"
export function estado(texto) {
return el("li", { class: "estado" }, texto);
}
// "2026-10-22" vira "22/10/2026"
export function formatarData(data) {
const [ano, mes, dia] = data.split("-");
return `${dia}/${mes}/${ano}`;
}
// Data de hoje no fuso do computador, no formato do input type="date" (AAAA-MM-DD)
export function hoje() {
const agora = new Date();
const mes = String(agora.getMonth() + 1).padStart(2, "0");
const dia = String(agora.getDate()).padStart(2, "0");
return `${agora.getFullYear()}-${mes}-${dia}`;
}