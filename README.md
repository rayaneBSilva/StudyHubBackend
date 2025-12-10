# StudyHub - Backend

**StudyHub** é uma plataforma colaborativa voltada para estudantes, que permite criar, salvar e compartilhar **cards de estudo**, **trabalhos acadêmicos** e **pastas de materiais** com outros usuários.

Este repositório contém o **servidor backend**, responsável por gerenciar a lógica de negócios, autenticação, e integração com o banco de dados.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript
- **Express.js** — Framework web para criação de APIs
- **PostgreSQL**— Banco de dados relacional
- **Swagger** — Documentação da API

---

## ⚙️ Funcionalidades Principais

- Cadastro e autenticação de usuários
- Criação e gerenciamento de cards de estudo
- Criação, edição e compartilhamento de pastas
- Busca e filtro de conteúdos por tema ou disciplina
- Criação, edição e compartilhamento de resumos entre usuários

---

## 🧩 Estrutura do Projeto

StudyhubBackend/

├── src/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── services/

│ └── config/

├── tests/

├── public/

│ └── index.html

├── server.js

└── package.json

---

## Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/rayaneBSilva/StudyHubBackend.git
   cd StudyHubBackend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. Rode o servidor:
   ```bash
   npm run dev
   ```
5. Acesse no navegador:
  ```arduino
   http://localhost:3000
   ```

## Testando a API no Insomnia

Para facilitar os testes da API, você pode importar o workspace do Insomnia:

1. Baixe o arquivo `docs/insomnia/StudyHubBackend-Insomnia.json`.
2. Abra o Insomnia.
3. Vá em **Workspace → Import/Export → Import Data → From File**.
4. Selecione o arquivo JSON baixado.
5. Agora você terá todas as rotas prontas para teste.

## Video demonstrando como executar o projeto

[coleta_evidências_1_entrega.webm](https://github.com/user-attachments/assets/39bc84da-ef8f-4578-a850-0cc0ee93f9d3)





