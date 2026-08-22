# Vozes-Do-Cerrado

Plataforma de apoio à decisão que transforma dados, critérios e evidências do Painel ClimaBrasil em prioridades e planos de ação para o avanço das políticas climáticas estaduais.

Consulte o [plano de desenvolvimento](./plan.md) para conhecer o escopo de design e código.

## Rotas disponíveis

- `/`: espaço reservado para a versão final.
- `/prototipo-baixa`: sandbox pública e clicável do protótipo de baixa fidelidade.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

O frontend estará disponível em `http://localhost:5173/prototipo-baixa`.

No Railway, o Railpack executa `pnpm build` e inicia a SPA com `pnpm start`, respeitando a variável `PORT` fornecida pela plataforma. O comando existe tanto na raiz quanto em `apps/web`, permitindo deploy pela raiz do monorepo ou com `apps/web` configurado como Root Directory.
