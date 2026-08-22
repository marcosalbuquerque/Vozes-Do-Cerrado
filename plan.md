# Plano de design e desenvolvimento — Vozes do Cerrado

## 1. Objetivo do produto

Transformar os dados, critérios e evidências do Painel ClimaBrasil em uma experiência clara de apoio à decisão, capaz de responder:

- **Onde agir:** quais componentes e itens climáticos apresentam as maiores lacunas no estado.
- **Por que agir:** quais evidências sustentam a avaliação e quais riscos a inação produz.
- **O que fazer:** quais passos são necessários para alcançar o próximo nível de implementação.
- **Como acompanhar:** quais ações foram planejadas, quem é responsável, qual é o prazo e quais evidências comprovam o avanço.

Proposta de valor: **mostrar ao gestor onde agir, por que agir e o que fazer para avançar na ação climática**.

Jornada principal: **Diagnóstico → Priorização → Orientação → Plano de ação → Acompanhamento → Evidências**.

## 2. Escopo e públicos

### Público principal — gestor público

O MVP será desenhado prioritariamente para o gestor estadual identificar lacunas, definir prioridades e acompanhar ações. Deve permitir:

1. selecionar ou identificar seu estado;
2. visualizar o diagnóstico geral e os componentes com menor desempenho;
3. entender cada lacuna em linguagem direta;
4. consultar critérios, evidências e uma referência comparável;
5. avaliar riscos da inação;
6. criar e acompanhar um plano de ação;
7. registrar evidências e observar a evolução esperada do componente.

### Público complementar — população

A população terá uma leitura pública, simplificada e rastreável do desempenho estadual. No MVP, poderá consultar prioridades, evidências e ações e iniciar uma manifestação de ouvidoria vinculada ao estado e ao tópico escolhido.

### Público futuro — auditor

Não haverá área exclusiva para auditor no MVP. A arquitetura deve, porém, preservar rastreabilidade de fontes, versões das avaliações, alterações nas ações e evidências para permitir uma futura visão de fiscalização.

## 3. Delimitação do MVP

### Incluído

- painel estadual com resumo, notas e prioridades;
- ranking explicável de componentes e itens;
- página de detalhe da lacuna com problema, critérios, evidências, referência, próximos passos, riscos e ressalva contextual;
- visualização geográfica dos riscos da inação e indicadores de impacto, sempre com fonte e período;
- criação, edição e acompanhamento de planos de ação;
- registro de evidências e histórico de mudanças;
- leitura pública do diagnóstico e das ações publicadas;
- encaminhamento à ouvidoria com estado e tópico pré-selecionados;
- análise assistida por IA com referências, limitações e validação humana;
- estados de carregamento, vazio, dados parciais, erro e sucesso;
- experiência responsiva e acessível.

### Fora do MVP

- módulo exclusivo para auditores;
- cruzamento automatizado completo com manifestações de ouvidoria e metas públicas;
- previsão oficial de nova nota antes da reavaliação do Painel ClimaBrasil;
- automação de decisões ou publicação de recomendações sem revisão humana;
- apresentação, pitch e organização de arquivos no Google Drive.

## 4. Stack e arquitetura definidas

### 4.1 Decisões de tecnologia

| Camada | Escolha | Uso no produto |
| --- | --- | --- |
| Linguagem | TypeScript em modo estrito | Tipos compartilhados e menos divergência entre frontend e backend |
| Gerenciador/monorepo | pnpm workspaces | Um repositório com aplicações e pacotes compartilhados |
| Frontend | React + Vite | SPA responsiva para gestor e área pública |
| Rotas | React Router | Rotas públicas, autenticadas e estados de navegação |
| Dados remotos | TanStack Query | Cache, invalidação, carregamento e retentativas da API |
| Formulários | React Hook Form + Zod | Formulários acessíveis com validação compartilhável |
| UI | Tailwind CSS + Radix UI | Tokens visuais e componentes acessíveis sem prender o produto a um tema pronto |
| Mapas | MapLibre GL JS | Camadas geográficas interativas sem dependência de licença proprietária |
| Gráficos | Recharts | Indicadores e comparações com alternativa textual obrigatória |
| Testes frontend | Vitest + Testing Library + Playwright | Unidade, integração e fluxos ponta a ponta |
| Backend | Node.js LTS + Express | API REST, autenticação, regras e integrações |
| Contratos | Zod + OpenAPI | Validação em runtime e documentação da API |
| Banco/ORM | PostgreSQL + Prisma | Dados relacionais, migrações e histórico auditável |
| Filas/cache | Redis + BullMQ | Importações, análises de IA e tarefas demoradas fora da requisição HTTP |
| Arquivos | Railway Storage Bucket + SDK S3 | Evidências, arquivos importados e URLs temporárias de acesso |
| Testes backend | Vitest + Supertest | Regras, rotas, permissões e contratos |
| Hospedagem | Railway | Frontend, API, worker, PostgreSQL, Redis e arquivos no mesmo projeto |

As versões exatas devem ser fixadas no lockfile usando as versões estáveis disponíveis no início da implementação. Atualizações de versão não devem acontecer automaticamente em produção sem testes.

### 4.2 Estrutura do monorepo

```text
vozes-do-cerrado/
├── apps/
│   ├── web/                 # React + Vite
│   ├── api/                 # Express + API REST
│   └── worker/              # BullMQ: importação, IA e processamento
├── packages/
│   ├── contracts/           # Schemas Zod e tipos de request/response
│   ├── database/            # Prisma schema, migrations e seed
│   ├── ui/                  # Componentes e tokens compartilhados
│   ├── config/              # TypeScript, ESLint e configurações comuns
│   └── observability/       # Logs, métricas e correlação
├── docs/                    # Arquitetura, regras e contratos
├── package.json
├── pnpm-workspace.yaml
└── plan.md
```

### 4.3 Serviços no Railway

Um único projeto Railway terá ambientes separados de **produção** e **staging**. A primeira entrega pode começar somente com staging e promover a mesma configuração para produção após os fluxos críticos serem aprovados.

| Serviço | Origem | Exposição | Responsabilidade |
| --- | --- | --- | --- |
| `web` | `apps/web` | Domínio público | Compilar o React e servir `dist` com Caddy, incluindo fallback da SPA |
| `api` | `apps/api` | Domínio público | API Express em `0.0.0.0:$PORT`, autenticação e regras |
| `worker` | `apps/worker` | Apenas rede privada | Consumir filas de importação, IA, relatórios e processamento de arquivos |
| `postgres` | Serviço PostgreSQL Railway | Apenas rede privada | Banco transacional e auditável |
| `redis` | Serviço Redis Railway | Apenas rede privada | Filas, locks, rate limit e cache efêmero |
| `evidence-bucket` | Railway Storage Bucket | Privado | Evidências e arquivos originais, acessados por URL pré-assinada |

Regras de implantação:

- conectar o mesmo repositório GitHub aos três serviços de código;
- usar comandos de build/start específicos do workspace e watch paths para evitar rebuilds desnecessários;
- servir o frontend com Caddy em vez do servidor de desenvolvimento do Vite;
- expor `GET /health/live` e `GET /health/ready` na API; o segundo só retorna sucesso quando dependências essenciais estão disponíveis;
- configurar o healthcheck do Railway para `/health/ready` antes de direcionar tráfego ao novo deploy;
- executar migrações Prisma como comando de pré-deploy da API, com migrações compatíveis com a versão anterior durante rollout;
- manter `postgres`, `redis`, `worker` e bucket sem domínio público;
- usar referências de variáveis do Railway para ligar serviços, sem copiar credenciais manualmente;
- habilitar backups e testar restauração do PostgreSQL antes da produção;
- usar Railway Buckets, não o disco efêmero do container, para arquivos persistentes;
- evitar volume local na API e no worker para permitir réplicas e deploys sem acoplamento ao filesystem.

### 4.4 Comunicação e segurança

- O navegador chama somente a URL pública da API por HTTPS.
- API, worker, PostgreSQL e Redis se comunicam pela rede privada do Railway.
- O frontend recebe apenas variáveis públicas prefixadas com `VITE_`; nenhum segredo entra no bundle.
- Autenticação usa sessão opaca em cookie `HttpOnly`, `Secure` e `SameSite`, persistida no PostgreSQL. Tokens de sessão não ficam em `localStorage`.
- A API aplica CORS somente para os domínios conhecidos de `web` em cada ambiente.
- Uploads usam URL pré-assinada de curta duração, validação de tipo/tamanho e chave gerada pelo servidor.
- Downloads privados exigem autorização antes da geração da URL pré-assinada.
- Redis guarda apenas dados efêmeros; PostgreSQL continua sendo a fonte de verdade.
- Toda requisição recebe um `request_id`, propagado para jobs e logs.

### 4.5 Contrato da API

- Prefixo versionado: `/api/v1`.
- JSON como formato padrão; datas em ISO 8601 e horários persistidos em UTC.
- Erros no formato `{ code, message, details, requestId }`, sem stack trace para o cliente.
- Paginação por cursor nas listas que podem crescer; filtros expressos por query string.
- Schemas Zod compartilhados geram tipos do cliente e alimentam a especificação OpenAPI.
- O frontend não acessa diretamente PostgreSQL, Redis ou Bucket.
- Endpoints públicos usam DTOs próprios e nunca reutilizam cegamente entidades internas.

### 4.6 Variáveis por serviço

**`web`**

- `VITE_API_URL`: domínio público da API;
- `VITE_APP_ENV`: `staging` ou `production`;
- `VITE_MAP_STYLE_URL`: estilo/base cartográfica aprovada.

**`api`**

- `DATABASE_URL`: referência ao PostgreSQL Railway;
- `REDIS_URL`: referência ao Redis Railway;
- `SESSION_SECRET`: segredo longo gerado por ambiente;
- `ALLOWED_ORIGINS`: domínios públicos do frontend;
- credenciais injetadas do Railway Bucket;
- chave do provedor de IA e identificadores de modelo, somente no backend;
- `LOG_LEVEL`, `APP_ENV` e limites de upload/rate limit.

**`worker`**

- `DATABASE_URL`, `REDIS_URL` e credenciais do Bucket;
- chave do provedor de IA;
- concorrência e limites de custo configuráveis por ambiente.

### 4.7 Estratégia de deploy

1. Pull request executa tipos, lint, testes e build de todos os workspaces afetados.
2. Merge em `main` dispara deploy automático em staging.
3. Railway executa a migração de banco antes de publicar a nova API.
4. API precisa passar pelo healthcheck; web e worker precisam iniciar sem erro.
5. Testes de fumaça verificam login, painel, detalhe de prioridade e criação de ação.
6. Produção recebe promoção manual enquanto o produto estiver no MVP.
7. Em falha, reverter o serviço; migrações devem ser compatíveis para que a versão anterior continue operando.

Ambientes temporários por pull request e múltiplas réplicas entram depois que o custo e a necessidade real forem medidos.

## 5. Regras de negócio essenciais

### 5.1 Diagnóstico e priorização

- A unidade de análise é: **estado → pilar/componente → item/critério → avaliação → evidência**.
- A nota original do Painel ClimaBrasil nunca deve ser sobrescrita; correções ou novas importações geram uma nova versão do conjunto de dados.
- A prioridade não pode ser definida apenas pela menor nota. O cálculo deve combinar, com pesos visíveis e configuráveis:
  - lacuna até o próximo nível de implementação;
  - gravidade e probabilidade do risco climático relacionado;
  - população e território potencialmente expostos;
  - qualidade/atualidade das evidências disponíveis;
  - viabilidade institucional e urgência temporal.
- O sistema deve exibir a composição da prioridade e permitir distinguir **dado de origem**, **regra calculada** e **síntese gerada por IA**.
- Empates devem ser resolvidos por maior risco estimado; persistindo o empate, pela maior lacuna de implementação.
- Dados ausentes não equivalem a nota zero. Devem aparecer como “dados insuficientes” e reduzir a confiança da análise.

### 5.2 Referências comparáveis

- Uma referência deve ter desempenho superior no mesmo componente e dados suficientes para comparação.
- A similaridade deve considerar primeiro região e características geoclimáticas; critérios e pesos precisam ser documentados.
- A interface deve explicar por que o estado foi selecionado e sempre apresentar a ressalva de que a experiência é uma referência, não uma solução pronta.
- Se não houver referência comparável confiável, o produto deve declarar essa limitação em vez de recomendar um caso frágil.

### 5.3 Próximo nível e recomendações

- Cada recomendação deve estar ligada aos critérios ainda não atendidos para o próximo nível.
- Recomendações devem separar ações verificáveis, responsáveis possíveis, evidências esperadas e dependências.
- A IA pode resumir e ordenar conteúdo, mas não inventar requisito, evidência, impacto ou fonte.
- Toda saída de IA deve guardar fontes, data, versão do modelo/prompt, nível de confiança e estado de revisão humana.

### 5.4 Plano de ação e evidências

- Uma ação deve conter: título, descrição, componente/item relacionado, responsável, prazo, status, indicador, meta, evidência esperada, dependências e observações.
- Status mínimos: **não iniciada, em andamento, bloqueada, concluída e cancelada**.
- Uma ação concluída não altera automaticamente a nota oficial. Ela registra “avanço esperado” até que haja evidência validada e nova avaliação oficial.
- Evidências devem conter arquivo ou URL, descrição, fonte, data de referência, autor do registro e estado de validação.
- Alterações relevantes precisam gerar histórico auditável com autor, data e valores anterior/novo.

### 5.5 Riscos e números de impacto

- Mapas e números de impacto devem mostrar fonte, unidade, território, período, metodologia e data de atualização.
- Não usar frases causais ou alarmistas quando a fonte demonstrar apenas correlação, cenário ou estimativa.
- O mapa deve diferenciar dado observado, projeção e ausência de dados.
- A ligação entre gargalos, cenários e riscos precisa ser rastreável até as fontes originais e aprovada por uma pessoa responsável.

### 5.6 Área pública e ouvidoria

- Apenas diagnósticos, ações e evidências marcados como públicos podem aparecer para a população.
- A localização deve ser solicitada com consentimento e ter alternativa de seleção manual do estado.
- O encaminhamento à ouvidoria deve levar estado, componente/tópico e um resumo editável; não deve enviar dados pessoais sem confirmação explícita.

## 6. Fluxos prioritários

### Fluxo A — gestor identifica uma prioridade

1. Entrar e selecionar o estado.
2. Ver resumo com nível geral, cobertura dos dados e últimas atualizações.
3. Abrir a lista de prioridades ordenadas.
4. Inspecionar como a pontuação de prioridade foi calculada.
5. Filtrar por pilar, componente, nível, risco ou qualidade dos dados.
6. Abrir o detalhe de uma lacuna.

**Sucesso:** o gestor identifica a principal lacuna e entende os fatores da priorização sem consultar documentação externa.

### Fluxo B — gestor entende o próximo avanço

1. Ler o resumo do problema.
2. Comparar nível atual e próximo nível.
3. Ver critérios atendidos, não atendidos e sem evidência suficiente.
4. Consultar evidências e respectivas fontes.
5. Ver referência comparável e justificativa da comparação.
6. Ler próximos passos, riscos da inação e limitações da análise.

**Sucesso:** o gestor consegue explicar qual requisito falta, qual evidência sustenta isso e qual primeiro passo é recomendado.

### Fluxo C — gestor cria e acompanha um plano

1. Converter uma lacuna em plano de ação.
2. Selecionar recomendações e adaptá-las ao contexto local.
3. Definir responsável, prazo, indicador, meta e evidência esperada.
4. Salvar rascunho e publicar internamente.
5. Atualizar status, registrar bloqueios e anexar evidências.
6. Visualizar progresso e histórico.

**Sucesso:** a prioridade possui ao menos uma ação válida, com responsável, prazo, indicador e evidência esperada.

### Fluxo D — população acompanha e cobra

1. Autorizar localização ou selecionar estado manualmente.
2. Ver diagnóstico em linguagem simples e ações públicas.
3. Abrir a fonte e as evidências de uma prioridade.
4. Selecionar “Falar com a ouvidoria”.
5. Revisar o tópico e o resumo pré-preenchidos.
6. Continuar no canal oficial de ouvidoria.

**Sucesso:** a pessoa compreende o status e chega ao canal oficial com uma manifestação contextualizada, sem envio automático de dados.

## 7. Plano detalhado por tarefa do Jira

## KAN-4 — Definir funcionalidades e regras de negócio

**Status no Jira:** Feito.  
**Objetivo detalhado:** consolidar uma especificação testável, sem ambiguidades críticas, que seja a fonte de verdade para design e código.

### Entregas

- [x] Definir proposta de valor, públicos, histórias e jornada principal.
- [ ] Validar com a equipe a delimitação de MVP deste documento.
- [ ] Confirmar a taxonomia real do Painel ClimaBrasil: pilares, componentes, itens, níveis, critérios e evidências.
- [ ] Documentar a fórmula inicial de priorização, seus pesos, intervalos e tratamento de dados ausentes.
- [ ] Definir critérios de similaridade geoclimática e fonte de cada atributo.
- [ ] Definir quem pode visualizar, editar, validar e publicar diagnósticos, ações e evidências.
- [ ] Definir política de atualização, versionamento e correção dos dados importados.
- [ ] Definir limites da IA, etapas que exigem revisão humana e textos de transparência.
- [ ] Confirmar integração com a ouvidoria: link profundo, formulário oficial ou apenas orientação.

### Critérios de aceite

- cada regra possui exemplo e ao menos um caso de exceção;
- termos usados pelo produto estão reunidos em um glossário;
- decisões pendentes têm responsável e prazo;
- funcionalidades fora do MVP estão explicitamente registradas;
- design e engenharia conseguem derivar telas, dados e testes sem interpretações conflitantes.

### Dependências e riscos

- acesso à metodologia e ao dicionário dos dados do Painel ClimaBrasil;
- validação jurídica sobre exposição pública de evidências, localização e dados pessoais;
- validação técnica sobre as fontes de cenários, riscos, orçamento e gargalos do TCU.

## KAN-5 — Criar protótipo de baixa fidelidade

**Status no Jira:** Fazendo.  
**Objetivo detalhado:** validar arquitetura da informação, sequência das decisões e compreensão do conteúdo antes do refinamento visual.

### Telas e artefatos

- [ ] mapa da jornada ponta a ponta do gestor e da população;
- [ ] inventário de conteúdo e arquitetura da informação;
- [ ] entrada/seleção de perfil e estado;
- [ ] painel estadual com resumo, cobertura e lista priorizada;
- [ ] explicação do cálculo de prioridade;
- [ ] detalhe do componente/item;
- [ ] comparação entre nível atual e próximo nível;
- [ ] painel de evidências e fontes;
- [ ] referência comparável e justificativa de similaridade;
- [ ] mapa e indicadores de risco da inação;
- [ ] criação/edição do plano de ação;
- [ ] acompanhamento de ações e registro de evidência;
- [ ] visão pública do estado;
- [ ] encaminhamento à ouvidoria;
- [ ] estados vazio, carregando, dados parciais, erro, sem permissão e sucesso.

### Testes de fluxo

- [ ] realizar teste moderado com pelo menos 3 gestores ou representantes do perfil;
- [ ] testar separadamente compreensão da nota, prioridade, evidência e “avanço esperado”;
- [ ] verificar se o usuário diferencia referência comparável de recomendação pronta;
- [ ] testar o fluxo público com pelo menos 3 pessoas sem domínio técnico do Painel;
- [ ] registrar severidade, frequência e decisão para cada problema encontrado.

### Critérios de aceite

- o fluxo principal pode ser percorrido de ponta a ponta;
- o usuário encontra a maior prioridade e explica por que ela está no topo;
- todos os estados essenciais estão representados;
- nenhuma tela depende de texto genérico para esconder uma decisão de produto;
- problemas críticos dos testes foram corrigidos ou aceitos com justificativa.

## KAN-6 — Criar e refinar protótipo de alta fidelidade

**Status no Jira:** A fazer.  
**Objetivo detalhado:** produzir uma experiência realista, consistente, responsiva e acessível, pronta para orientar o frontend.

### Sistema visual e componentes

- [ ] definir fundamentos: cores, tipografia, espaçamento, grid, ícones, elevação e movimento;
- [ ] garantir contraste mínimo WCAG AA e não depender apenas de cor para notas/risco;
- [ ] criar componentes de navegação, filtros, cartões de prioridade, badges de nível, tabelas, acordeões, modais, formulários, alertas e toasts;
- [ ] criar padrões de visualização para escala de notas, decomposição da prioridade, comparação de níveis, linha do tempo e mapa;
- [ ] documentar variantes, estados e comportamento responsivo dos componentes;
- [ ] escrever microcopy em pt-BR com linguagem pública clara e termos técnicos explicados no contexto.

### Conteúdo realista obrigatório

O protótipo deve incluir ao menos um exemplo completo no formato:

> Seu estado está em estágio inicial em gestão de riscos. A avaliação identificou ausência de um processo estruturado de prevenção e monitoramento.
>
> **Referência:** o Estado X recebeu avaliação avançada por apresentar mapeamento de áreas de risco, sistema de alertas e planos de contingência.
>
> **Próximo passo sugerido:** verificar se o estado possui mapeamento atualizado, definir responsáveis e estabelecer uma rotina de monitoramento.
>
> **Riscos da ausência de ação:** maior exposição da população, respostas tardias a eventos extremos, perdas humanas e materiais e uso emergencial de recursos que poderiam ser destinados à prevenção.
>
> **Atenção:** a experiência do Estado X é uma referência, não uma solução pronta. Contexto territorial, capacidade institucional, recursos e necessidades locais devem ser avaliados antes da adoção.

Todo número apresentado no protótipo deve ter fonte, período e unidade visíveis, ainda que os dados sejam marcados como demonstração.

### Critérios de aceite

- versão desktop e móvel do fluxo principal;
- navegação por teclado, foco visível, contraste e rótulos verificados;
- gráficos possuem alternativa textual e mapas não concentram informação indispensável sem equivalente em lista/tabela;
- componentes e padrões estão documentados para implementação;
- teste ponta a ponta confirma que o refinamento visual não prejudicou a compreensão.

## KAN-11 — Desenvolver frontend

**Status no Jira:** A fazer.  
**Objetivo detalhado:** implementar a interface aprovada com componentes reutilizáveis, integrações confiáveis e comportamento acessível.

### Fundação técnica

- [ ] criar `apps/web` com React, Vite e TypeScript estrito;
- [ ] configurar React Router, TanStack Query, React Hook Form e Zod;
- [ ] configurar Tailwind CSS, Radix UI e os tokens do design system;
- [ ] implementar MapLibre GL JS e Recharts com carregamento sob demanda;
- [ ] criar cliente tipado para `/api/v1` a partir dos contratos compartilhados;
- [ ] implementar autenticação por cookie, proteção de rotas e renovação/expiração de sessão;
- [ ] configurar Vitest, Testing Library, Playwright, lint, formatação e validação de tipos;
- [ ] adicionar `Dockerfile` e `Caddyfile` para servir o build Vite no Railway;
- [ ] configurar telemetria sem registrar dados pessoais ou conteúdo sensível.

### Implementação por módulo

- [ ] **Acesso e contexto:** autenticação do gestor, seleção de estado, persistência de contexto e permissões.
- [ ] **Painel estadual:** resumo, atualização, cobertura de dados, filtros e prioridades.
- [ ] **Explicabilidade:** decomposição da pontuação, critérios, evidências, fontes e confiança.
- [ ] **Detalhe da lacuna:** problema, nível atual/próximo, referência, ações sugeridas, riscos e ressalvas.
- [ ] **Riscos:** mapa acessível, legenda, filtros, números de impacto e alternativa em tabela.
- [ ] **Plano de ação:** criação, edição, validação, responsáveis, prazos, indicadores, metas e evidências esperadas.
- [ ] **Acompanhamento:** status, bloqueios, histórico, anexos/links de evidência e avanço esperado.
- [ ] **Área pública:** páginas somente leitura, fonte dos dados e ações publicadas.
- [ ] **Ouvidoria:** consentimento de localização, seleção manual, escolha de tópico, resumo editável e saída para canal oficial.

### Estados e qualidade

- [ ] skeleton de carregamento sem mudança brusca de layout;
- [ ] vazio com orientação clara do próximo passo;
- [ ] dados parciais com indicação do que falta e efeito sobre a confiança;
- [ ] erro recuperável com tentativa novamente e identificador para suporte;
- [ ] confirmação antes de perder alterações não salvas;
- [ ] testes unitários de componentes e regras de apresentação;
- [ ] testes de integração dos fluxos principais;
- [ ] testes ponta a ponta para identificar prioridade, criar ação, anexar evidência e abrir ouvidoria;
- [ ] auditoria automática e manual de acessibilidade;
- [ ] orçamento de desempenho para carregamento inicial, interação e mapa.

### Critérios de aceite

- aderência ao protótipo aprovado nas larguras definidas;
- fluxo principal funcional com teclado e leitor de tela;
- estados vazio, carregando, parcial, erro e sucesso implementados;
- nenhum número, risco ou recomendação sem fonte/estado de validação correspondente;
- testes críticos aprovados e sem erros bloqueadores no monitoramento.

## KAN-7 — Desenvolver backend

**Status no Jira:** A fazer.  
**Objetivo detalhado:** fornecer dados versionados, regras explicáveis, integrações rastreáveis e APIs seguras para as experiências do gestor e da população.

### Fundação técnica

- [ ] criar `apps/api` com Express, Node.js LTS e TypeScript estrito;
- [ ] criar `apps/worker` com BullMQ e processamento idempotente;
- [ ] criar `packages/contracts` com Zod e geração da especificação OpenAPI;
- [ ] criar `packages/database` com Prisma, migrations e seed de demonstração;
- [ ] configurar middlewares de sessão, autorização, CORS, rate limit, logs e erros;
- [ ] implementar `/health/live` e `/health/ready`;
- [ ] configurar encerramento gracioso da API e do worker para deploys/restarts;
- [ ] adicionar Dockerfiles e comandos de build/start por workspace;
- [ ] criar configuração Railway para migração de pré-deploy, healthcheck e watch paths.

### Modelo de dados inicial

- [ ] `users`, `roles`, `organizations` e vínculos com estados;
- [ ] `states`, `territorial_profiles` e atributos de similaridade;
- [ ] `dataset_versions` e registros de importação;
- [ ] `pillars`, `components`, `items`, `criteria` e níveis de implementação;
- [ ] `assessments`, `scores`, `assessment_evidence` e fontes;
- [ ] `priority_scores`, fatores, pesos, resultado e versão da regra;
- [ ] `risk_scenarios`, camadas geográficas, métricas de impacto e fontes;
- [ ] `reference_cases` e justificativas de comparabilidade;
- [ ] `recommendations`, fontes e estado de revisão;
- [ ] `action_plans`, `actions`, responsáveis, indicadores, metas e dependências;
- [ ] `action_updates`, `evidence_records`, validações e visibilidade pública;
- [ ] `audit_log` imutável para mudanças relevantes;
- [ ] `ai_runs` com entrada, saída, citações, modelo, prompt, confiança e revisão.

### Ingestão e qualidade dos dados

- [ ] mapear colunas dos arquivos brutos para o modelo canônico;
- [ ] validar tipos, faixas, chaves, duplicidades, referências e cobertura;
- [ ] gerar relatório de importação com aceitos, rejeitados e avisos;
- [ ] preservar arquivo original, checksum, data e versão;
- [ ] permitir reprocessamento idempotente sem duplicar avaliações;
- [ ] implementar testes com amostras válidas, incompletas e inconsistentes.

### Serviços e APIs

- [ ] `GET /states` e `GET /states/{uf}/overview`;
- [ ] `GET /states/{uf}/priorities` com filtros, paginação e decomposição do cálculo;
- [ ] `GET /states/{uf}/components/{id}` com níveis, critérios, evidências e fontes;
- [ ] `GET /states/{uf}/components/{id}/reference`;
- [ ] `GET /states/{uf}/risks` com geometrias ou tiles e métricas agregadas;
- [ ] CRUD de planos e ações com validação de permissão e concorrência;
- [ ] criação e validação de evidências, usando upload seguro ou URL permitida;
- [ ] histórico de ações e avaliações;
- [ ] endpoints públicos separados, retornando apenas campos publicados;
- [ ] endpoint de preparação do encaminhamento à ouvidoria sem transmissão automática de dados pessoais.

### Motor de priorização

- [ ] implementar fórmula determinística e versionada;
- [ ] normalizar fatores para evitar que escalas diferentes distorçam o ranking;
- [ ] registrar valores de entrada, pesos, resultado e motivo de cada posição;
- [ ] tratar dados ausentes separadamente de desempenho baixo;
- [ ] criar testes de limite, empate, ausência de dados e mudança de pesos;
- [ ] expor explicação legível pela API, sem depender da IA.

### Análise assistida por IA

- [ ] recuperar apenas trechos de fontes autorizadas e versionadas;
- [ ] gerar resumo do problema, próximos passos e riscos com citações por afirmação;
- [ ] impedir publicação quando não houver suporte suficiente nas fontes;
- [ ] separar claramente texto de origem, inferência e sugestão;
- [ ] exigir revisão humana antes de tornar uma análise pública;
- [ ] proteger contra prompt injection contida em documentos ingeridos;
- [ ] avaliar fidelidade das citações, completude, utilidade e taxa de afirmações sem suporte;
- [ ] registrar custo, latência, falhas e versão do modelo/prompt.

### Segurança e operação

- [ ] autenticação e autorização por papel, organização, estado e visibilidade;
- [ ] validação de entrada, limite de requisições e proteção de uploads;
- [ ] criptografia em trânsito e política de retenção de dados;
- [ ] logs estruturados com correlação, sem segredos ou dados pessoais desnecessários;
- [ ] backups e procedimento testado de restauração;
- [ ] documentação OpenAPI e exemplos de resposta/erro;
- [ ] testes unitários, integração, contrato e autorização;
- [ ] métricas de saúde, latência, erros, importação e filas.
- [ ] configurar PostgreSQL e Redis pela rede privada do Railway;
- [ ] configurar Railway Bucket e URLs pré-assinadas para evidências;
- [ ] configurar backups, política de retenção e teste de restauração;
- [ ] configurar staging, produção e promoção controlada entre ambientes.

### Critérios de aceite

- APIs atendem aos contratos usados pelo frontend;
- importação é reprodutível, versionada e gera relatório de qualidade;
- ranking é determinístico, explicável e coberto por testes;
- nenhuma saída de IA é publicada sem fonte e validação humana;
- permissões impedem acesso cruzado indevido e exposição de conteúdo não público;
- serviços críticos têm testes e documentação operacional.

## KAN-10 — Avaliar conformidade técnica e de experiência

**Status no Jira:** A fazer.  
**Recorte deste plano:** somente solução, design e código; apresentação e documentação de pitch ficam excluídas.

### Verificações

- [ ] relacionar a pergunta “como os dados podem melhorar, acompanhar ou avaliar políticas públicas climáticas?” a funcionalidades demonstráveis;
- [ ] confirmar que diagnóstico e priorização apoiam **avaliar**;
- [ ] confirmar que orientação e plano de ação apoiam **melhorar**;
- [ ] confirmar que atualizações e evidências apoiam **acompanhar**;
- [ ] criar matriz de requisitos do guia versus tela, regra, endpoint e teste correspondente;
- [ ] executar revisão de acessibilidade, segurança, privacidade, qualidade dos dados e fidelidade da IA;
- [ ] corrigir bloqueadores e registrar riscos aceitos.

### Critérios de aceite

- pergunta central respondida explicitamente dentro do produto;
- requisitos técnicos e de experiência possuem evidência verificável;
- não há bloqueador conhecido nos fluxos principais;
- limitações do MVP e da análise estão visíveis para o usuário.

## 8. Sequência recomendada e dependências

1. **Fechar decisões de KAN-4:** taxonomia, fórmula, permissões, fontes e recorte do MVP.
2. **Concluir KAN-5:** fluxos, wireframes e testes de compreensão.
3. **Montar a fundação do monorepo:** workspaces, configurações comuns, contratos, testes e CI.
4. **Criar o projeto Railway de staging:** `web`, `api`, `worker`, `postgres`, `redis` e `evidence-bucket`.
5. **Definir contratos compartilhados:** modelo canônico, exemplos de payload e critérios de fonte/validação.
6. **Executar KAN-6 e fundação de KAN-7 em paralelo:** alta fidelidade e ingestão/modelo de dados.
7. **Construir o corte vertical:** painel → detalhe da prioridade → criação de uma ação, usando um estado e um componente reais.
8. **Expandir KAN-11 e KAN-7:** riscos, acompanhamento, evidências, área pública e ouvidoria.
9. **Preparar produção no Railway:** domínio, segredos, backups, healthchecks, migração e testes de fumaça.
10. **Executar KAN-10:** conformidade técnica, acessibilidade, segurança, dados, IA e correções finais.

## 9. Cortes de entrega

### Corte 1 — diagnóstico confiável

- importar uma versão dos dados;
- selecionar um estado;
- mostrar notas, cobertura e prioridades;
- explicar a fórmula e abrir fontes.

### Corte 2 — orientação acionável

- mostrar nível atual e próximo;
- exibir critérios/evidências;
- apresentar referência comparável;
- sugerir próximos passos com revisão humana.

### Corte 3 — execução acompanhável

- converter prioridade em ação;
- definir responsável, prazo, indicador, meta e evidência;
- atualizar status e registrar histórico.

### Corte 4 — risco e participação pública

- visualizar riscos e métricas com fontes;
- publicar diagnóstico e ações selecionadas;
- encaminhar manifestação contextualizada à ouvidoria.

## 10. Métricas de sucesso

### Experiência e valor

- taxa de gestores que identificam corretamente a maior prioridade;
- tempo até compreender o próximo nível e o primeiro passo;
- taxa de prioridades convertidas em plano de ação válido;
- taxa de ações com responsável, prazo, indicador e evidência esperada;
- taxa de usuários que conseguem localizar a fonte de uma afirmação;
- conclusão do encaminhamento à ouvidoria.

### Qualidade e confiança

- cobertura e atualidade dos dados por estado/componente;
- percentual de análises com citações completas e validadas;
- taxa de afirmações geradas por IA sem suporte detectadas na avaliação;
- divergência entre cálculo reproduzido e prioridade exibida (meta: zero);
- tempo de correção de importações com erro;
- incidentes de acesso indevido ou exposição de conteúdo não público (meta: zero).

### Desempenho técnico

- disponibilidade e latência das APIs críticas;
- tempo de carregamento e resposta das telas prioritárias;
- taxa de erro do fluxo principal;
- sucesso de restauração de backup e reprocessamento de importação.

## 11. Decisões pendentes antes da implementação

- Qual é a fórmula inicial de prioridade e quem aprova seus pesos?
- Quais fontes oficiais alimentarão risco, população exposta, orçamento e gargalos do TCU?
- Como será calculada e validada a similaridade geoclimática?
- O primeiro corte terá contas demonstrativas ou cadastro real com recuperação de senha?
- Quais ações/evidências podem ser públicas por padrão e quem aprova a publicação?
- A ouvidoria oferece URL parametrizada/API ou apenas um canal externo genérico?
- Quais dados e estados serão usados no primeiro corte vertical demonstrável?
- Qual domínio será usado para `web` e `api` em produção?
- Qual região do Railway atende melhor aos usuários e às exigências de residência dos dados?
- Qual orçamento mensal inicial e quais limites de CPU, memória, filas e uso de IA devem gerar alerta?

## 12. Definition of Done global

Uma funcionalidade só está concluída quando:

- regra e critério de aceite estão documentados;
- design contempla conteúdo real, estados e responsividade;
- implementação possui tipos, validações e tratamento de erros;
- permissões e privacidade foram verificadas;
- acessibilidade foi testada além da checagem automática;
- testes relevantes estão aprovados;
- fontes e limitações estão visíveis quando houver dado, risco ou IA;
- telemetria necessária está ativa sem coletar dados além do necessário;
- comportamento e contrato foram documentados para manutenção.

## 13. Referências técnicas de implantação

- [Railway — Deploy de monorepos](https://docs.railway.com/deployments/monorepo)
- [Railway — React com Vite e Caddy](https://docs.railway.com/guides/react)
- [Railway — Node.js e Express](https://docs.railway.com/guides/deploy-node-express-api-with-auto-scaling-secrets-and-zero-downtime)
- [Railway — PostgreSQL](https://docs.railway.com/databases/postgresql)
- [Railway — Redis](https://docs.railway.com/databases/redis)
- [Railway — Storage Buckets](https://docs.railway.com/storage-buckets)
- [Railway — Deployments e pré-deploy](https://docs.railway.com/deployments)
