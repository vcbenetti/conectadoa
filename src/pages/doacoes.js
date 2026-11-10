import { listarDoacoes, listarDoadores, listarItens, registrarDoacao } from "../api.js";
import { el, esconderMensagem, estado, formatarData, hoje, mostrarMensagem } from "../ui.js";
// Tela: registrar doação
export async function telaNovaDoacao(app) {
  app.innerHTML = `
<h1>Registrar doação</h1>
<form id="form-doacao" class="cartao formulario-doacao">
<label>
Doador
<select name="id_doador" required>
<option value="">Carregando...</option>
</select>
</label>
<label>
Data da doação
<input name="data_doacao" type="date" required />
</label>
<label>
Observação <span class="opcional">(opcional)</span>
<textarea name="observacao" maxlength="255" rows="2"></textarea>
</label>
<fieldset>
<legend>Itens doados</legend>
<div id="linhas-itens"></div>
<button type="button" id="adicionar-item" class="secundario">+ Adicionar item</button>
</fieldset>
<div class="acoes">
<button type="submit">Registrar doação</button>
<a href="#/doacoes">Ver doações registradas</a>
</div>
<p id="msg" class="mensagem" role="status" hidden></p>
</form>
`;
  const form = app.querySelector("#form-doacao");
  const selectDoador = form.elements.id_doador;
  const linhasItens = app.querySelector("#linhas-itens");
  const botaoSalvar = form.querySelector('button[type="submit"]');
  const msg = app.querySelector("#msg");
  let catalogo = [];
  form.elements.data_doacao.value = hoje();
  // Cada linha tem um select com o catálogo, agrupado por categoria, e a quantidade
  function adicionarLinha() {
    const grupos = new Map();
    for (const item of catalogo) {
      if (!grupos.has(item.categoria)) {
        grupos.set(item.categoria, el("optgroup", { label: item.categoria }));
      }
      grupos
        .get(item.categoria)
        .append(el("option", { value: item.id_item }, `${item.nome} (${item.unidade})`));
    }
    const linha = el(
      "div",
      { class: "linha-item" },
      el(
        "label",
        {},
        "Item",
        el(
          "select",
          { required: "" },
          el("option", { value: "" }, "Selecione"),
          ...grupos.values(),
        ),
      ),
      el(
        "label",
        {},
        "Quantidade",
        el("input", { type: "number", min: "1", step: "1", value: "1", required: "" }),
      ),
      el(
        "button",
        { type: "button", class: "secundario", onclick: () => removerLinha(linha) },
        "Remover",
      ),
    );
    linhasItens.append(linha);
  }
  function removerLinha(linha) {
    if (linhasItens.children.length === 1) {
      mostrarMensagem(msg, "A doação precisa de pelo menos um item.", "erro");
      return;
    }
    linha.remove();
  }
  app.querySelector("#adicionar-item").addEventListener("click", adicionarLinha);
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const linhas = [...linhasItens.querySelectorAll(".linha-item")];
    // A API espera números inteiros: o valor dos campos é sempre texto, por isso o Number()
    const doacao = {
      id_doador: Number(form.elements.id_doador.value),
      data_doacao: form.elements.data_doacao.value,
      observacao: form.elements.observacao.value.trim(),
      itens: linhas.map((linha) => ({
        id_item: Number(linha.querySelector("select").value),
        quantidade: Number(linha.querySelector("input").value),
      })),
    };
    botaoSalvar.disabled = true;
    esconderMensagem(msg);
    try {
      const nova = await registrarDoacao(doacao);
      mostrarMensagem(
        msg,
        `Doação nº ${nova.id_doacao} registrada com ${nova.itens.length} item(ns).`,
      );
      form.reset();
      form.elements.data_doacao.value = hoje();
      linhasItens.replaceChildren();
      adicionarLinha();
    } catch (erro) {
      mostrarMensagem(msg, erro.message, "erro");
    } finally {
      botaoSalvar.disabled = false;
    }
  });
  // Carrega doadores e catálogo ao mesmo tempo
  try {
    const [doadores, itens] = await Promise.all([listarDoadores(), listarItens()]);
    catalogo = itens;
    if (doadores.length === 0) {
      selectDoador.replaceChildren(el("option", { value: "" }, "Nenhum doador cadastrado"));
      mostrarMensagem(msg, "Cadastre um doador antes de registrar uma doação.", "erro");
      botaoSalvar.disabled = true;
      return;
    }
    selectDoador.replaceChildren(
      el("option", { value: "" }, "Selecione o doador"),
      ...doadores.map((doador) => el("option", { value: doador.id_doador }, doador.nome)),
    );
    adicionarLinha();
  } catch (erro) {
    mostrarMensagem(msg, erro.message, "erro");
    botaoSalvar.disabled = true;
  }
}
// Tela: listagem de doações
export async function telaDoacoes(app) {
  app.innerHTML = `
<div class="titulo-tela">
<h1>Doações</h1>
<a class="botao" href="#/doacoes/nova">+ Registrar doação</a>
</div>
<p id="resumo" class="resumo"></p>
<p id="msg" class="mensagem" role="status" hidden></p>
<ul id="lista-doacoes" class="lista"></ul>
`;
  const lista = app.querySelector("#lista-doacoes");
  const resumo = app.querySelector("#resumo");
  const msg = app.querySelector("#msg");
  lista.replaceChildren(estado("Carregando..."));
  try {
    const doacoes = await listarDoacoes();
    if (doacoes.length === 0) {
      lista.replaceChildren(estado("Nenhuma doação registrada ainda."));
      return;
    }
    resumo.textContent = `${doacoes.length} doação(ões) registrada(s)`;
    lista.replaceChildren(...doacoes.map(cartaoDoacao));
  } catch (erro) {
    lista.replaceChildren();
    mostrarMensagem(msg, erro.message, "erro");
  }
}
function cartaoDoacao(doacao) {
  return el(
    "li",
    { class: "cartao doacao" },
    el(
      "div",
      { class: "doacao-topo" },
      el("strong", {}, doacao.doador.nome),
      el("time", { datetime: doacao.data_doacao }, formatarData(doacao.data_doacao)),
    ),
    el(
      "ul",
      { class: "itens" },
      ...doacao.itens.map((item) =>
        el(
          "li",
          {},
          el("span", { class: "qtd" }, String(item.quantidade)),
          el("span", {}, item.nome),
          el("span", { class: "unidade" }, item.unidade),
        ),
      ),
    ),
    doacao.observacao ? el("p", { class: "observacao" }, doacao.observacao) : null,
  );
}
