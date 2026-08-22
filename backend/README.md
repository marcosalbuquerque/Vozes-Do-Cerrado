# Backend - Vozes do Cerrado

API isolada do frontend para calcular as notas públicas do Distrito Federal e comparar duas lacunas climáticas com assistência de IA.

## Segurança da chave

1. Copie `.env.example` para `.env` somente na sua máquina.
2. Preencha `OPENAI_API_KEY` no `.env` local ou nas variáveis privadas do serviço de backend no Railway.
3. Nunca coloque a chave no frontend, em variável `VITE_*`, em commits ou em requisições do navegador.

O arquivo `.env` já é ignorado pelo Git. Em produção, crie um serviço separado no Railway e configure `backend` como diretório raiz. O serviço atual do frontend continua isolado em `frontend`.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

A API fica em `http://localhost:3001`.

## Rotas

- `GET /health`: saúde do serviço.
- `GET /api/df/componentes`: notas calculadas a partir do CSV.
- `GET /api/df/componentes?elegiveis=true`: somente componentes calculáveis com nota abaixo de 2.
- `POST /api/df/priorizacao/comparar`: compara exatamente dois componentes elegíveis.

Exemplo:

```json
{
  "componentes": ["G6", "P1"]
}
```

A nota oficial é calculada por código. A IA não altera a avaliação do Painel ClimaBrasil: ela produz uma comparação preliminar pelos oito critérios e cita os IDs dos itens públicos utilizados.
