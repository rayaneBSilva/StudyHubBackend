# StudyHub - Backend

**StudyHub** é uma plataforma colaborativa voltada para estudantes, permitindo criar, organizar e compartilhar **cards de estudo**, **pastas** e **resumos acadêmicos**.  
Este repositório contém o **backend**, responsável pela autenticação, regras de negócio, persistência de dados e testes automatizados.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript
- **TypeScript**
- **Express.js** — Framework web para criação de APIs
- **PostgreSQL**— Banco de dados relacional
- **Sequelize (ORM)**
- **JWT** — Autenticação
- **Mocha + Chai** — Testes automatizados
- **Supertest** — Testes de API
- **Insomnia** — Testes manuais
- **Swagger** — Documentação da API

---

## ⚙️ Funcionalidades Principais

### 👤 Usuários
- Cadastro
- Login com JWT
- Diferenciação de papéis:
  - **Professor** (usuário principal)
  - **Aluno**
- Logout (via expiração de token)

### 📚 Conteúdo
- Cards de estudo
   - Criar, atualizar, deletar
   - Aprovar/rejeitar (professor)
   - Revisão de cards com método SM-2
   - Filtragem por deck, autor e status
   - Paginação com page e limit
- Pastas organizadoras
- Resumos acadêmicos
   - Upload de PDFs para compartilhamento
   - Filtragem por título, disciplina e autor
   - Paginação

### 🔒 Regras de Acesso
- Apenas **professores** podem criar/editar conteúdos
- Alunos apenas visualizam e podem criar cards que ficam pendentes
- Todas as rotas protegidas por autenticação

### 🔎 Recursos Avançados
- Paginação (page e limit) para decks, cards e resumos
- Filtragem por autor, status, título e disciplina
- Upload de PDFs para resumos
- Busca textual

---

## 🧩 Estrutura do Projeto

```
StudyHubBackend/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── repository/
│   ├── middlewares/
│   ├── utils/
│   └── config/
│
├── tests/
│   ├── auth/
│   ├── users/
│   ├── deck/
│   ├── files/
│   ├── cards/
│   ├── folders/
│   ├── summaries/
│   ├── helpers/
│   └── setup.ts
│
├── docs/
│   └── insomnia/
│
├── public/
├── tsconfig.json
├── tsconfig.test.json
├── package.json
└── README.md
```

---

## ▶️ Executando o Projeto

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

---

## 🧪 Testes Automatizados

### Executar testes
```bash
cd tests
npm test
```

### Tipos de Testes Implementados
- Autenticação
- Autorização por papel
- CRUD de usuários
- CRUD de cards
- CRUD de decks
- CRUD de pastas
- CRUD de resumos
- Testes de segurança (token ausente / inválido)

---

## ▶️ Executando a Cobertura de Testes

Para executar os testes e gerar o relatório de cobertura, utilize o comando:

```bash
npm run coverage
```
Esse comando:

- Executa todos os testes automatizados do projeto
- Mede a execução do código durante os testes
- Exibe um relatório resumido no terminal
- Gera um relatório detalhado em HTML

Após a execução dos testes, será criada a pasta: coverage/
Dentro dela, o arquivo principal é: coverage/index.html

Para abrir o relatório visual no Firefox, utilize o comando:

```bash
firefox coverage/index.html
```


## 🧪 Testando a API no Insomnia

Para facilitar os testes da API, você pode importar o workspace do Insomnia:

1. Baixe o arquivo `docs/insomnia/StudyHubBackend-Insomnia.json`.
2. Abra o Insomnia.
3. Vá em **Workspace → Import/Export → Import Data → From File**.
4. Selecione o arquivo JSON baixado.
5. Agora você terá todas as rotas prontas para teste.

## Video demonstrando como executar o projeto

[coleta_evidências_1_entrega.webm](https://github.com/user-attachments/assets/39bc84da-ef8f-4578-a850-0cc0ee93f9d3)

## Evidência do upload de um arquivo:

[Evidencia_upload.webm](https://github.com/user-attachments/assets/37c21ce5-b818-40b9-bae7-f0025cb98896)





