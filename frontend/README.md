# Vozes-Do-Cerrado

Plataforma de apoio à decisão que transforma dados, critérios e evidências do Painel ClimaBrasil em prioridades e planos de ação para o avanço das políticas climáticas estaduais.

Consulte o [plano de desenvolvimento](../docs/plan.md) para conhecer o escopo de design e código.

## Rotas disponíveis

- `/`: espaço reservado para a versão final.
- `/prototipo-baixa`: sandbox pública e clicável do protótipo de baixa fidelidade.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

O frontend estará disponível em `http://localhost:5173/prototipo-baixa`.

No Railway, configure `frontend` como diretório raiz do serviço. O `Dockerfile` desta pasta constrói e publica a SPA com Caddy, preservando a rota de saúde `/health`.

O backend é independente e está documentado em [`../backend/README.md`](../backend/README.md).
