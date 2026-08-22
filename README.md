# Vozes-Do-Cerrado

🔗 **Acesso à plataforma em produção:** [https://vozes-do-cerrado-production.up.railway.app/](https://vozes-do-cerrado-production.up.railway.app/)

Plataforma de apoio à decisão que transforma dados, critérios e evidências do Painel ClimaBrasil em prioridades e planos de ação para o avanço das políticas climáticas estaduais, com foco inicial no Distrito Federal.

## 🛠 Stacks Utilizadas

**Frontend:**
- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) para build rápido
- CSS Modules / Design System customizado
- Dados carregados via CSV integrado (Painel ClimaBrasil e AdaptaBrasil MCTI)

**Backend:**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google Gemini API](https://ai.google.dev/) para análise e ranqueamento inteligente via IA
- [Zod](https://zod.dev/) para validação de dados

**Infraestrutura e Deploy:**
- [Railway](https://railway.app/) e [Vercel](https://vercel.com/)
- Docker e Caddy para o front-end estático
- Script avulso em Node.js (`ai-ranking-script`) para ordenação de métricas por IA off-line e sem custos

## 📂 Estrutura do Projeto

- `/frontend`: Aplicação Web SPA ([Documentação do Front](frontend/README.md))
- `/backend`: API que integra e consome os dados e IA ([Documentação da API](backend/README.md))
- `/ai-ranking-script`: Script de IA (Gemini) para geração de ranking estático inteligente das prioridades climáticas.
- `/docs`: Documentação geral (Design System, Planejamento, Mapas)

## Como rodar localmente

Clone o repositório e instale as dependências usando [pnpm](https://pnpm.io/):

### Front-end
```bash
cd frontend
pnpm install
pnpm dev
```
(Acessível em `http://localhost:5173`)

### Back-end
```bash
cd backend
pnpm install
pnpm dev
```
(Acessível em `http://localhost:3001` - Lembrar de adicionar `GEMINI_API_KEY` no `.env`)
