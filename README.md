# Vozes-Do-Cerrado

Plataforma de apoio à decisão que transforma dados, critérios e evidências do Painel ClimaBrasil em prioridades e planos de ação para o avanço das políticas climáticas estaduais.

Consulte o [plano de desenvolvimento](./docs/plan.md) para conhecer o escopo de design e código.

## Organização do projeto

- `frontend/`: aplicação ativa Vozes do Cerrado, publicada no Railway.
- `backend/`: espaço reservado para a futura API e os serviços de IA.
- `docs/`: plano, design system, referências e entregáveis do projeto.

## Rotas disponíveis

- `/`: espaço reservado para a versão final.
- `/prototipo-baixa`: sandbox pública e clicável do protótipo de baixa fidelidade.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

O frontend estará disponível em `http://localhost:5173/prototipo-baixa`.

No Railway, o deploy continua partindo da raiz do repositório. O `Dockerfile.web` constrói `frontend/` e publica a SPA com Caddy, preservando a rota de saúde `/health`. Os comandos `pnpm build` e `pnpm start` também continuam disponíveis na raiz.
