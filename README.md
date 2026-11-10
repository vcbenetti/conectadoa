# ConectaDoa

Este é um projeto full-stack desenvolvido como parte do tutorial da disciplina (**PIE2 - Aula 1**), utilizando **Vite+**, **Express**, **pnpm** e **dotenv**.

---

## Tecnologias Utilizadas

- **Frontend:** Vite+ (React / TypeScript)
- **Backend:** Node.js com Express
- **Gerenciador de Pacotes:** `pnpm`
- **Variáveis de Ambiente:** `dotenv`

---

## Como Rodar o Projeto

Siga os passos abaixo para clonar o repositório, instalar as dependências e executar o projeto em sua máquina local.

### 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [pnpm](https://pnpm.io/)

### 2. Clonar o Repositório

```bash
git clone git@github.com:vcbenetti/conectadoa.git
cd conectadoa
```

### 3. Instalar as Dependências

Instale todas as dependências do projeto executando:

```bash
pnpm install
```

### 4. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no modelo `.env.example`:

```bash
cp .env.example .env
```

Abra o arquivo `.env` recém-criado e defina a porta do servidor backend:

```env
PORT=3000
```

---

## Executando a Aplicação

Para rodar a aplicação completa, você precisará de **dois terminais** abertos na raiz do projeto:

### Terminal 1 -> Servidor API (Backend)
Inicie a API em modo de desenvolvimento com hot-reload (`node --watch`):

```bash
vp run api
```
> A API estará disponível em: `http://localhost:3000`

### Terminal 2 -> Servidor Frontend
Inicie o servidor de desenvolvimento do Vite+:

```bash
vp dev
```
> O frontend estará rodando no endereço indicado pelo terminal (geralmente `http://localhost:5173`). As requisições para `/api` serão automaticamente redirecionadas pelo proxy do `vite.config.ts` para a porta 3000.

---

## Estrutura Básica do Projeto

```text
conectadoa/
├── server/
│   └── index.js       # Ponto de entrada do servidor Express (Backend)
├── src/               # Código-fonte do Frontend (Vite+)
├── .env               # Variáveis de ambiente locais (ignorado pelo Git)
├── .env.example       # Modelo de variáveis de ambiente (rastreado pelo Git)
├── .gitignore         # Regras de ignorados pelo Git
├── package.json       # Configurações do projeto e scripts
├── vite.config.ts     # Configurações do Vite e proxy da API
└── README.md          # Documentação do projeto
```