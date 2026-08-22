# Vozes-Do-Cerrado

Plataforma de apoio à decisão que transforma dados, critérios e evidências do Painel ClimaBrasil em prioridades e planos de ação para o avanço das políticas climáticas estaduais.

Consulte o [plano de desenvolvimento](../docs/plan.md) para conhecer o escopo de design e código.

## Rotas disponíveis

- `/`: diagnóstico real do Distrito Federal.
- `/prioridade/:componentId`: detalhe dos itens avaliados e mapa climático do DF.
- `/acompanhamento`: transparência sobre quais dados de planos ainda não estão disponíveis.
- `/ouvidoria`: formulário demonstrativo sem envio externo.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

O frontend estará disponível em `http://localhost:5173`. As notas são calculadas diretamente dos CSVs do Painel ClimaBrasil incluídos no projeto, sem depender de dados demonstrativos ou de uma API externa.

No Railway, configure `frontend` como diretório raiz do serviço. O `Dockerfile` desta pasta constrói e publica a SPA com Caddy, preservando a rota de saúde `/health`.

O backend é independente e está documentado em [`../backend/README.md`](../backend/README.md).
