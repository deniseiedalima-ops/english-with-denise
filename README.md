# English with Denise 🌟

App de inglês gamificado com integração Notion + Login Google.

## Como subir na Vercel (passo a passo)

### 1. Crie as credenciais do Google
1. Acesse: https://console.cloud.google.com
2. Crie um projeto novo → "APIs & Services" → "Credentials"
3. "Create Credentials" → "OAuth 2.0 Client ID" → Web application
4. Authorized origins: `https://seu-app.vercel.app`
5. Copie o **Client ID**

### 2. Crie o token do Notion
1. Acesse: https://www.notion.so/my-integrations
2. "New integration" → nome: "English with Denise App"
3. Copie o **Internal Integration Token**
4. No Notion, abra sua base de alunos → "..." → "Add connections" → selecione sua integração
5. Faça o mesmo para a base "Agenda de Aulas"

### 3. Suba na Vercel
1. Acesse: https://vercel.com → faça login com GitHub
2. "Add New Project" → "Upload" (arraste a pasta do projeto)
3. Em "Environment Variables" adicione:
   - `REACT_APP_GOOGLE_CLIENT_ID` = seu Client ID do Google
   - `REACT_APP_NOTION_TOKEN` = seu token do Notion
4. Clique "Deploy" ✅

### Estrutura do projeto
```
src/
  pages/
    Login.js       — Tela de login com Google
    Dashboard.js   — Dashboard principal do aluno
    Practice.js    — Atividades das 4 habilidades
  components/
    Navbar.js      — Barra de navegação
  notion.js        — Integração com Notion API
  App.js           — Rotas do app
```

### IDs do Notion
- Base de alunos: `368628bb387c80259882da13d7e2ed1d`
- Agenda de aulas: `20d1f53be0104838a9e452246edfa737`
