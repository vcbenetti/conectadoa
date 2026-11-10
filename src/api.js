// Todas as chamadas à API passam por aqui. As telas nunca usam fetch diretamente.
async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      ...opcoes,
      headers: { "Content-Type": "application/json", ...opcoes.headers },
    });
  } catch {
    throw new Error("Sem conexão com o servidor. Verifique se o frontend está rodando.");
  }
  if (resposta.status === 204) return null; // excluído: resposta sem corpo
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    // A API sempre responde erros no formato { "erro": "mensagem" }
    throw new Error(
      dados?.erro ?? `A API não respondeu (erro ${resposta.status}). Ela está rodando?`,
    );
  }
  return dados;
}
// Doadores
export const listarDoadores = () => requisicao("/doadores");
export const criarDoador = (doador) =>
  requisicao("/doadores", { method: "POST", body: JSON.stringify(doador) });
export const atualizarDoador = (id, doador) =>
  requisicao(`/doadores/${id}`, { method: "PUT", body: JSON.stringify(doador) });
export const excluirDoador = (id) => requisicao(`/doadores/${id}`, { method: "DELETE" });
// Itens e doações
export const listarItens = () => requisicao("/itens");
export const listarDoacoes = () => requisicao("/doacoes");
export const registrarDoacao = (doacao) =>
  requisicao("/doacoes", { method: "POST", body: JSON.stringify(doacao) });
// Saúde da API e do banco
export const verificarSaude = () => requisicao("/health");
