# Plano de Design e Desenvolvimento — Vozes do Cerrado (MVP)

## 1. Objetivo do Produto e Proposta de Valor

O **Vozes do Cerrado** transforma os dados do Painel ClimaBrasil em uma plataforma interativa de inteligência territorial e controle social. A solução orienta a tomada de decisão climática respondendo a quatro perguntas centrais:

* **Onde agir:** Identificação das maiores lacunas estaduais através do **Diagnóstico de Colisão** (cruzamento do Risco Natural com a menor nota do Painel ClimaBrasil).
* **Por que agir:** Apresentação de critérios, evidências e a **Matriz de Riscos da Inação** (impactos socioambientais, orçamentários e institucionais).
* **O que fazer:** Recomendações orientadas ao próximo nível de implementação e **Benchmark Geoclimático** de entes públicos comparáveis.
* **Como acompanhar:** Criação de planos de ação, registro de evidências e métricas de **Avanço Esperado**.

**Jornada Principal:** Diagnóstico de Colisão → Priorização → Orientação & Benchmark → Plano de Ação → Acompanhamento & Evidências → Validação Cidadã.

---

## 2. Escopo e Perfiis de Usuário no MVP

### Gestor Público (Público Principal)

Interface para identificação de gargalos, planejamento e execução de políticas públicas:

* Diagnóstico de colisão territorial e leitura explicável das lacunas.
* Consulta de benchmarks geoclimáticos de entes comparáveis com notas elevadas.
* Análise dos riscos decorrentes da inação.
* Criação, edição e acompanhamento de planos de ação.
* Registro de evidências de execução e projeção do ganho de nota.

### População (Público Complementar)

Portal de transparência e engajamento cidadão com foco territorial:

* Visualização simplificada das prioridades e riscos da sua região via GPS ou seleção manual.
* **Validação Cidadã (Ouvidoria de Impacto):** Botão direto para confirmar a entrega real das ações e alimentar o indicador de *Efetividade Percebida*.
* Encaminhamento contextualizado para os canais oficiais de ouvidoria.

### Auditor / TCU (Preparação de Arquitetura para Fase Futura)

No MVP, não há painel exclusivo com login para auditores. Contudo, a arquitetura garante:

* **Matriz de Riscos da Inércia:** Dados estruturados para cálculo futuro de perdas orçamentárias e socioambientais decorrentes da não execução dos planos.
* **Trilha de Auditoria:** Rastreabilidade imutável de fontes, versões de avaliações, histórico de alterações e notas de efetividade percebida geradas pela população.

---

## 3. Delimitação do Escopo do MVP

| Incluído no MVP | Fora do MVP (Fases Futuras) |
| --- | --- |
| Painel estadual com resumo, notas e prioridades recalculadas. | Módulo e login exclusivo para auditores do TCU. |
| **Diagnóstico de Colisão** (Risco Natural × Menor Nota ClimaBrasil). | Cruzamento automatizado completo com bases externas de ouvidoria. |
| Detalhe da lacuna: critérios, evidências, **Benchmark Geoclimático** e riscos. | Alteração automática da nota oficial do Painel ClimaBrasil. |
| Mapeamento de riscos da inação (sociais, orçamentários e institucionais). | Publicação de recomendações por IA sem validação humana. |
| Gestão de planos de ação, anexos de evidências e histórico. | Predição orçamentária avançada baseada em modelos macroeconômicos. |
| Portal público com **Validação Cidadã por GPS** e direcionamento à ouvidoria. | Apresentação em slide e vídeos do pitch final. |
| Análise assistida por IA com citações e revisão obrigatória. | Múltiplas réplicas de produção e staging por Pull Request. |

---

## 4. Arquitetura e Infraestrutura Técnica

### 4.1 Stack de Tecnologia

* **Linguagem & Monorepo:** TypeScript (modo estrito) via `pnpm workspaces`.
* **Frontend (`apps/web`):** React, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Radix UI, MapLibre GL JS (mapas) e Recharts (gráficos).
* **Backend (`apps/api`):** Node.js LTS, Express, contratos Zod/OpenAPI, Prisma ORM e PostgreSQL.
* **Processamento Assíncrono (`apps/worker`):** BullMQ e Redis para ingestão de dados, tarefas de IA e processamento de arquivos.
* **Armazenamento de Arquivos:** Railway Storage Bucket (compatível com S3) para evidências e anexos via URLs pré-assinadas.
* **Hospedagem & Infraestrutura:** Project Railway (ambientes de `staging` e `production`).

### 4.2 Estrutura do Monorepo

```text
vozes-do-cerrado/
├── apps/
│   ├── web/                 # SPA React + Vite (Gestor e Área Pública)
│   ├── api/                 # API REST Express (Autenticação, regras, dados)
│   └── worker/              # BullMQ (Processamento assíncrono e serviços de IA)
├── packages/
│   ├── contracts/           # Schemas Zod e DTOs compartilhados
│   ├── database/            # Schema Prisma, migrações e seeds
│   ├── ui/                  # Design System e componentes Radix/Tailwind
│   ├── config/              # Configurações compartilhadas (TS, ESLint)
│   └── observability/       # Logs estruturados e métricas
├── docs/                    # Especificações e contratos de API
└── plan.md

```

### 4.3 Arquitetura de Serviços no Railway

```
                     [ Cliente Navegador (HTTPS) ]
                                  │
                                  ▼
                        ┌──────────────────┐
                        │   Service web    │
                        │ (Caddy + React)  │
                        └─────────┬────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │   Service api    │
                        │ (Express Node)   │
                        └─────────┬────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Service postgres │    │  Service redis   │    │  Service worker  │
│  (Privado/TCP)   │    │  Privado (Filas) │    │ (BullMQ/IA/Jobs) │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                                           │
                                                           ▼
                                                ┌──────────────────┐
                                                │ Storage Bucket   │
                                                │   (Evidências)   │
                                                └──────────────────┘

```

---

## 5. Regras de Negócio Fundamentais

### 5.1 Diagnóstico de Colisão e Priorização

* **Modelo Dimensional:** Estado → Pilar/Componente → Item/Critério → Avaliação → Evidência.
* **Cálculo da Prioridade:** A pontuação combina: lacuna de implementação, gravidade do Risco Natural (Painel Cidades), população exposta, qualidade das evidências e urgência temporal.
* **Diagnóstico de Colisão:** Destaque automático do ponto onde a piores vulnerabilidades institucionais do ClimaBrasil colidem com os maiores riscos naturais mapeados no território.
* **Preservação Histórica:** As notas oficiais do Painel ClimaBrasil são imutáveis; reavaliações geram novas versões do dataset.

### 5.2 Benchmark Geoclimático e Recomendações

* **Seleção de Referência:** O sistema identifica entes públicos do mesmo bioma/região geoclimática com pontuações elevadas no mesmo componente.
* **Ressalva Contextual:** Toda recomendação por benchmark exibe aviso claro de que a solução do ente comparável é uma referência e deve ser adaptada às particularidades locais.
* **Limites da IA:** A IA pode sintetizar recomendações e organizar textos, mas todas as saídas precisam citar fontes oficiais e passar por validação humana antes da publicação.

### 5.3 Gestão de Planos, Evidências e Matriz de Inércia

* **Ações e Avanço Esperado:** Concluir uma ação registra um "Avanço Esperado" no painel, mas não altera a nota oficial até novo ciclo do Painel ClimaBrasil.
* **Matriz de Riscos da Inação:** A não execução dos planos projeta os impactos socioambientais, perdas orçamentárias com reconstrução e potenciais omissões administrativas.
* **Indicadores de Efetividade Percebida:** Avaliações enviadas pela população via módulo público alteram o índice de validação social exibido nos relatórios das ações.

---

## 6. Fluxos de Uso Prioritários

**Fluxo A — Gestor Identifica o Gargalo Crítico:**

1. Seleciona o estado no painel inicial.
2. Visualiza o **Diagnóstico de Colisão** ressaltando o ponto cego de maior urgência.
3. Examina a decomposição do cálculo de prioridade e os critérios não atendidos.

**Fluxo B — Gestor Planeja a Intervenção:**

1. Consulta a análise da lacuna e os riscos associados à inação.
2. Analisa o **Benchmark Geoclimático** recomendado de região semelhante.
3. Converte a recomendação em um **Plano de Ação** com prazos, metas e responsáveis.

**Fluxo C — Gestor Executa e Anexa Evidências:**

1. Atualiza o status do plano de ação (Em andamento/Concluído).
2. Anexa documentos e imagens comprobatórias via upload seguro no Bucket.
3. Acompanha a projeção do ganho de desempenho no gráfico de **Avanço Esperado**.

**Fluxo D — Cidadão Valida e Cobra Resultados:**

1. Acessa a visão pública e concede permissão de localização (GPS).
2. Visualiza os riscos da sua região e as ações prometidas pelo governo.
3. Clica em **Validação Cidadã** para informar se a obra/ação foi entregue na prática, alimentando o indicador de efetividade.

---

## 7. Detalhamento das Tarefas no Jira

### KAN-4 — Definir funcionalidades e regras de negócio

* **Status:** Concluído.
* **Ações:** Consolidação da proposta de valor, taxonomia do Painel ClimaBrasil, fórmula de priorização, critérios do Benchmark Geoclimático e arquitetura de dados alinhada ao MVP.

### KAN-5 — Criar protótipo de baixa fidelidade

* **Status:** Em andamento.
* **Ações:** Wireframes dos fluxos do gestor (Diagnóstico de Colisão, Benchmark, Planos) e da população (Visão GPS, Validação Cidadã). Testes de usabilidade e compreensão das notas.

### KAN-6 — Criar e refinar protótipo de alta fidelidade

* **Status:** A Fazer.
* **Ações:** Construção dos componentes visuais com Radix UI e Tailwind CSS. Aplicação de acessibilidade WCAG AA, modos responsivos, mapas interativos e telas de acompanhamento de evidências.

### KAN-11 — Desenvolver Frontend

* **Status:** A Fazer.
* **Ações:** Configuração do Vite em `apps/web`, integração com React Router, TanStack Query, formulários com Zod, renderização de mapas via MapLibre GL JS e dashboard de indicadores do gestor e público.

### KAN-7 — Desenvolver Backend e Infraestrutura

* **Status:** A Fazer.
* **Ações:** Implementação da API REST em Express, esquemas Prisma com PostgreSQL, processamento de filas via BullMQ/Redis, endpoints do cálculo de prioridade, integração de IA para diagnósticos e deploy dos serviços no Railway.

### KAN-10 — Avaliar conformidade técnica e de experiência

* **Status:** A Fazer.
* **Ações:** Verificação dos critérios de aceitação do MVP, testes de cobertura e carga na API, testes de acessibilidade e auditoria de segurança das rotas e uploads.
