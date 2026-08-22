# Climaton Brasil 2026 — Design System de Identidade Visual

> Documento mestre para criar peças, apresentações, interfaces, painéis e conteúdos do Climaton Brasil 2026 com uma identidade consistente, acessível e reconhecível.

**Status:** proposta baseada nas referências fornecidas  
**Escopo:** identidade visual, comunicação, dados, apresentações e produtos digitais  
**Fontes analisadas:** apresentação “ClimatonBrasil 2026 - Painel ClimaBrasil.pdf” e paleta cromática fornecida  
**Owner:** a definir pela organização  
**Última atualização:** 22 de agosto de 2026

---

## 1. Visão do sistema

### 1.1 Essência

O Climaton Brasil 2026 transforma dados climáticos complexos em compreensão pública e ação coletiva. Sua identidade deve unir três qualidades:

- **Urgência construtiva:** o clima exige ação, mas a comunicação aponta caminhos.
- **Credibilidade pública:** dados, método e transparência sustentam cada mensagem.
- **Energia brasileira:** cor, ritmo e diversidade sem cair em estereótipos.

### 1.2 Promessa visual

**Dados que ganham forma, voz e movimento para mudar o futuro.**

### 1.3 Personalidade

| Somos | Não somos |
|---|---|
| Claros e mobilizadores | Alarmistas ou fatalistas |
| Institucionais e humanos | Burocráticos ou frios |
| Brasileiros e contemporâneos | Folclóricos ou genéricos |
| Orientados por evidências | Decorativos sem função |
| Enérgicos e acessíveis | Infantis ou estridentes |

### 1.4 Princípios de design

1. **O dado vem primeiro.** A forma visual deve tornar a informação mais compreensível.
2. **Uma ideia forte por composição.** Cada tela, card ou página deve ter um foco dominante.
3. **Contraste cria direção.** Verde, lima e marinho organizam a hierarquia; não competem entre si.
4. **Complexidade em camadas.** Começar pelo significado, permitir aprofundamento e manter a fonte acessível.
5. **A identidade se move.** Barras, ondas e progressões representam dados vivos, colaboração e transformação.

---

## 2. Arquitetura da identidade

O sistema é organizado em quatro camadas. Essa separação evita que toda peça use todos os recursos ao mesmo tempo.

| Camada | Função | Elementos principais |
|---|---|---|
| Fundação | Garantir consistência | cores, tipografia, espaçamento, formas |
| Expressão | Tornar a marca reconhecível | assinatura, onda de dados, recortes, fotografia |
| Informação | Explicar e comparar | gráficos, escalas, mapas, números, evidências |
| Aplicação | Adaptar aos canais | apresentações, redes sociais, site, painel, eventos |

### 2.1 Fluxo de comunicação

1. **Chamar atenção:** pergunta, número ou declaração curta.
2. **Dar contexto:** explicar por que o tema importa para pessoas e políticas públicas.
3. **Mostrar evidência:** apresentar dados, fonte e recorte de análise.
4. **Indicar ação:** orientar acesso, participação, cobrança ou continuidade.

---

## 3. Sistema de cores

Os valores abaixo foram medidos diretamente da paleta fornecida. Eles são a fonte cromática principal do sistema.

### 3.1 Paleta base

| Token | Hex | Papel recomendado |
|---|---:|---|
| `color.green.500` | `#018A3C` | verde institucional, marca e superfícies principais |
| `color.green.900` | `#005222` | verde profundo, contraste e fundos premium |
| `color.teal.700` | `#017147` | apoio, dados ambientais e variação tonal |
| `color.lime.400` | `#D8E814` | energia, ênfase, destaques e chamada para ação |
| `color.indigo.800` | `#333355` | autoridade, texto escuro e fundos institucionais |
| `color.blue.400` | `#62A4FA` | informação, tecnologia e links |
| `color.lime.500` | `#4CCA0F` | sucesso, avanço e desempenho positivo |
| `color.yellow.300` | `#F8D668` | atenção leve, contexto e faixas intermediárias |
| `color.amber.500` | `#EEA10D` | atenção e desempenho em desenvolvimento |
| `color.red.600` | `#CB1615` | alerta, risco e desempenho crítico |
| `color.neutral.900` | `#1E1E1E` | texto principal e fundos de alto contraste |
| `color.neutral.100` | `#D9E0EA` | superfícies secundárias, divisores e skeletons |
| `color.white` | `#FFFFFF` | superfície clara e conteúdo sobre fundos escuros |

### 3.2 Tokens semânticos

| Função | Token base | Uso |
|---|---|---|
| `brand.primary` | `green.500` | marca, botões principais, blocos institucionais |
| `brand.primary.deep` | `green.900` | fundos, rodapés, cabeçalhos e contraste |
| `brand.accent` | `lime.400` | palavras-chave, números e chamadas |
| `content.strong` | `indigo.800` | títulos e texto em superfícies claras |
| `content.default` | `neutral.900` | corpo de texto |
| `surface.default` | `white` | leitura e visualização de dados |
| `surface.muted` | `neutral.100` | agrupamentos e áreas de apoio |
| `info.default` | `blue.400` | links, informação e elementos digitais |
| `success.default` | `lime.500` | conclusão e resultado favorável |
| `warning.default` | `amber.500` | atenção e estágio intermediário |
| `danger.default` | `red.600` | problema, risco e resultado crítico |

### 3.3 Combinações acessíveis

| Fundo | Conteúdo | Contraste aproximado | Regra |
|---|---|---:|---|
| `green.900` | branco | 9,42:1 | liberado para qualquer texto |
| `teal.700` | branco | 6,08:1 | liberado para qualquer texto |
| `indigo.800` | branco | 12,03:1 | liberado para qualquer texto |
| `red.600` | branco | 5,73:1 | liberado para qualquer texto |
| `lime.400` | `neutral.900` | 12,28:1 | combinação de destaque preferencial |
| `yellow.300` | `neutral.900` | 11,76:1 | liberado para qualquer texto |
| `blue.400` | `neutral.900` | 6,52:1 | liberado para qualquer texto |
| `lime.500` | `neutral.900` | 7,75:1 | liberado para qualquer texto |
| `amber.500` | `neutral.900` | 7,73:1 | liberado para qualquer texto |
| `neutral.100` | `neutral.900` | 12,54:1 | liberado para qualquer texto |

> **Atenção:** branco sobre `green.500` mede aproximadamente 4,47:1. Use apenas em títulos grandes ou componentes com peso forte. Para texto pequeno, prefira `green.900`, `teal.700` ou `indigo.800`.

### 3.4 Proporção cromática

- **60% neutros:** branco, cinza-claro e preto.
- **25% verdes:** superfícies e reconhecimento de marca.
- **10% marinho ou índigo:** estrutura e autoridade.
- **5% lima e cores de status:** destaque e dados.

Não usar todas as cores em uma única composição fora de visualizações de dados. Em peças editoriais, limitar a uma cor principal, uma cor de apoio e um neutro.

### 3.5 Gradientes

Gradientes são permitidos apenas em fundos atmosféricos, capas e transições de vídeo.

```css
--gradient-climate-deep: linear-gradient(135deg, #005222 0%, #017147 55%, #018A3C 100%);
--gradient-data-energy: linear-gradient(90deg, #018A3C 0%, #D8E814 100%);
--gradient-night-earth: linear-gradient(180deg, #1E1E1E 0%, #333355 100%);
```

Não aplicar gradiente em gráficos comparativos ou áreas que carreguem significado quantitativo.

---

## 4. Tipografia

O PDF de referência utiliza a família **Aptos** nos pesos Light, SemiBold, ExtraBold e Black, com Arial em elementos pontuais. Aptos é a fonte oficial proposta para preservar fidelidade à linguagem existente.

### 4.1 Família

```css
font-family: "Aptos", "Arial", sans-serif;
```

### 4.2 Hierarquia digital

| Estilo | Tamanho | Peso | Altura de linha | Uso |
|---|---:|---:|---:|---|
| Display XL | 64 px | 900 | 0,95 | números, perguntas e mensagens de impacto |
| Display L | 48 px | 800 | 1,00 | capas e aberturas de seção |
| Heading 1 | 36 px | 800 | 1,10 | título principal |
| Heading 2 | 28 px | 700 | 1,15 | seções e narrativas |
| Heading 3 | 22 px | 600 | 1,20 | grupos e componentes |
| Body L | 18 px | 300 | 1,45 | introduções e conteúdo editorial |
| Body M | 16 px | 300 | 1,50 | texto padrão |
| Body S | 14 px | 400 | 1,45 | tabelas, metadados e legendas |
| Label | 13 px | 600 | 1,20 | botões, filtros e controles |
| Caption | 12 px | 400 | 1,35 | fonte, período, notas e créditos |

### 4.3 Hierarquia para apresentações 16:9

| Estilo | Tamanho sugerido | Regra |
|---|---:|---|
| Título de impacto | 34–44 pt | até 3 linhas; preferir 1–2 |
| Título de conteúdo | 24–30 pt | uma ideia por slide |
| Corpo | 17–22 pt | nunca abaixo de 17 pt |
| Legenda | 12–14 pt | apenas informação secundária |
| Número-chave | 48–80 pt | sempre com unidade e contexto |

### 4.4 Regras tipográficas

- Usar caixa baixa em perguntas e frases de abertura para manter proximidade.
- Usar caixa alta apenas em labels curtas, status e siglas.
- Realçar no máximo três trechos por bloco com SemiBold ou cor de destaque.
- Evitar itálico em textos longos; reservar para termos, títulos e ênfase curta.
- Limitar linhas de leitura a 45–75 caracteres em documentos e interfaces.
- Não simular pesos inexistentes nem comprimir ou esticar caracteres.

---

## 5. Forma, grade e espaçamento

### 5.1 Escala de espaçamento

A unidade base é **4 px**.

| Token | Valor | Uso |
|---|---:|---|
| `space.1` | 4 px | microajuste |
| `space.2` | 8 px | ícone e label |
| `space.3` | 12 px | controles compactos |
| `space.4` | 16 px | padding padrão |
| `space.6` | 24 px | grupos e cards |
| `space.8` | 32 px | seções internas |
| `space.12` | 48 px | separação editorial |
| `space.16` | 64 px | abertura de seção |
| `space.24` | 96 px | respiro de capa e campanhas |

### 5.2 Raios

| Token | Valor | Aplicação |
|---|---:|---|
| `radius.small` | 8 px | chips, tags e miniaturas |
| `radius.medium` | 16 px | cards, campos e gráficos |
| `radius.large` | 28 px | blocos editoriais e imagens |
| `radius.pill` | 999 px | indicadores, barras e botões especiais |

Os grandes recortes arredondados da apresentação são uma assinatura visual. Aplicar em uma ou duas quinas, não obrigatoriamente nas quatro.

### 5.3 Bordas e elevação

| Nível | Definição | Uso |
|---|---|---|
| 0 | sem sombra; borda `#D9E0EA` | tabelas, gráficos e cards de dados |
| 1 | `0 2px 8px rgb(30 30 30 / 0.10)` | cards interativos |
| 2 | `0 8px 24px rgb(30 30 30 / 0.16)` | menus e popovers |

Preferir separação por espaço, cor e borda. Sombra não deve ser o principal recurso de hierarquia.

### 5.4 Grades responsivas

| Faixa | Colunas | Margem | Gap | Comportamento |
|---|---:|---:|---:|---|
| Compacta, até 599 px | 4 | 20 px | 16 px | uma coluna principal |
| Média, 600–1023 px | 8 | 32 px | 24 px | uma ou duas colunas |
| Ampla, 1024 px ou mais | 12 | 64 px | 24 px | até três áreas de conteúdo |
| Apresentação 16:9 | 12 | 5% da largura | 2% | foco único por slide |

---

## 6. Assinatura e grafismos

### 6.1 Assinatura Climaton Brasil 2026

A assinatura observada combina:

- um contorno do Brasil construído por barras verticais;
- variação rítmica que remete a voz, dados e frequência;
- wordmark em caixa alta, com “BRASIL 2026” mais leve e inclinado;
- contraste entre institucionalidade e movimento.

### 6.2 Regras de uso da assinatura

- Criar e manter um arquivo mestre vetorial antes da produção final.
- Preservar a proporção, o ritmo e a espessura das barras.
- Área de proteção mínima: a altura da letra “C” ao redor da assinatura.
- Versão preferencial: verde sobre branco ou branco sobre `green.900`/`indigo.800`.
- Em fundos fotográficos, usar uma área sólida ou overlay que garanta contraste.
- Não aplicar contorno, sombra, textura, rotação ou gradiente dentro do logo.
- Não reconstruir o símbolo com outro mapa, equalizador ou ícone genérico.

> As medidas exatas do logo são **pendentes de um arquivo vetorial oficial**. Não devem ser deduzidas de capturas rasterizadas.

### 6.3 Onda de dados

O padrão de barras usado no símbolo pode se expandir como textura de apoio:

- opacidade entre 6% e 14% em fundos;
- largura irregular, ritmo orgânico e alinhamento vertical;
- nunca competir com texto, números ou gráficos;
- pode funcionar como máscara para fotografia ou transição animada;
- não deve repetir o contorno completo do Brasil sem função de marca.

### 6.4 Molduras laterais

As faixas verticais com cantos arredondados vistas na apresentação funcionam como elemento de continuidade.

- Largura sugerida: 16–32 px em telas 16:9.
- Usar em apenas uma lateral ou em pares assimétricos.
- Cor preferencial: `lime.400` sobre marinho; verde sobre branco.
- Não usar quando houver barra lateral funcional na interface.

### 6.5 Fotografia

Priorizar imagens que mostrem:

- pessoas tomando decisões, pesquisando ou colaborando;
- cidades, territórios e infraestrutura brasileira;
- impactos climáticos apresentados com contexto humano;
- instituições públicas em atuação;
- tecnologia e dados em uso real.

Tratamento:

- enquadramento documental, próximo e verdadeiro;
- recortes arredondados grandes e assimétricos;
- cor natural; evitar filtros verdes intensos;
- sobreposição escura entre 35% e 60% quando houver texto;
- crédito e fonte sempre visíveis.

Evitar imagens genéricas de folhas na mão, lâmpadas com plantas, apertos de mão ou natureza sem relação com a mensagem.

### 6.6 Iconografia

- Estilo linear ou sólido simples, nunca misturar os dois na mesma composição.
- Grade base de 24 px; espessura visual equivalente a 2 px.
- Cantos levemente arredondados.
- Usar `green.500`, `indigo.800` ou cor semântica correspondente.
- Ícones complementam labels; não substituem texto em ações críticas.

---

## 7. Visualização de dados

### 7.1 Regra central

Cor nunca deve ser a única forma de comunicar significado. Toda escala precisa de label, valor, forma, padrão ou posição.

### 7.2 Escala ordinal de avaliação

Para manter coerência com o material analisado:

| Estágio | Cor | Label recomendado |
|---|---|---|
| 0 | `red.600` | Não iniciado / crítico |
| 1 | `amber.500` | Iniciando |
| 2 | `yellow.300` | Em desenvolvimento / quase |
| 3 | `lime.500` | Atendido / sim |

> O PDF apresenta uma escala com labels numéricos inconsistentes em algumas telas. Na implementação, adotar uma sequência única de `0–3` ou remover os números e manter apenas os quatro estágios textuais.

### 7.3 Séries categóricas

Ordem preferencial para até seis séries:

1. `green.500`
2. `indigo.800`
3. `blue.400`
4. `amber.500`
5. `teal.700`
6. `red.600`

Não usar `green.500`, `teal.700` e `green.900` lado a lado em marcas pequenas; são próximos demais para leitura rápida.

### 7.4 Gráficos

- Título responde à pergunta do gráfico, não repete o nome da métrica.
- Subtítulo informa período, recorte e unidade.
- Eixos e grades usam `neutral.100`; texto usa `indigo.800`.
- Valor principal deve estar próximo da marca correspondente.
- Legendas externas são último recurso; preferir labels diretos.
- Sempre incluir fonte, data de atualização e observação metodológica.
- Não usar 3D, sombras, degradês quantitativos sem legenda ou pictogramas distorcidos.

### 7.5 Mapas

- Usar projeção e recorte consistentes.
- Incluir legenda, escala quando relevante, fonte e período.
- Estados e municípios sem dado usam `neutral.100`, nunca branco puro.
- Não misturar ausência de dado com desempenho zero.
- Para mapas coropléticos, testar leitura em daltonismo e impressão em cinza.

### 7.6 Evidências

Cada indicador deve permitir acesso progressivo a:

1. pontuação ou status;
2. definição do indicador;
3. justificativa da avaliação;
4. documentos e links de evidência;
5. data, autoria e metodologia.

---

## 8. Componentes de comunicação

### 8.1 Capa hero

**Estrutura:** assinatura + frase curta + imagem de território ou planeta + grafismo de onda.  
**Regra:** uma mensagem, até duas linhas, sem bloco de texto adicional.  
**Uso:** aberturas, campanhas, vídeos e página inicial.

### 8.2 Abertura por pergunta

**Estrutura:** pergunta grande, palavra-chave em `lime.400`, ponto de interrogação ampliado e fundo sólido.  
**Uso:** transições editoriais e introdução de temas.  
**Não usar:** em todas as seções; perde impacto por repetição.

### 8.3 Card de dado-chave

| Propriedade | Especificação |
|---|---|
| Fundo | branco, `green.900` ou `indigo.800` |
| Raio | 16–28 px |
| Número | Display L ou XL |
| Label | Body M, até duas linhas |
| Fonte | Caption, sempre presente |
| Padding | 24–32 px |

### 8.4 Card de eixo ou pilar

Usar para Governança, Políticas Públicas e Financiamento.

- título curto;
- descrição de até cinco itens;
- mesma altura quando exibidos em conjunto;
- borda ou fundo, nunca ambos com alta intensidade;
- ícone opcional, sempre acompanhado de label.

### 8.5 Escala de desempenho

- Quatro segmentos com largura equivalente.
- Label textual acima ou abaixo de cada cor.
- Estado selecionado indicado também por contorno, marcador ou peso.
- Em mobile, permitir empilhamento vertical.

### 8.6 Citação ou evidência textual

- Máximo recomendado de 600 caracteres na camada principal.
- Trechos longos devem abrir em painel detalhado ou página própria.
- Aspas grandes são decorativas e não substituem semântica de citação.
- Autor, órgão, documento e data devem acompanhar o conteúdo.

### 8.7 Chamada para ação

**Primária:** fundo `lime.400`, texto `neutral.900`, altura mínima de 48 px.  
**Secundária:** contorno `green.900`, texto `green.900`, fundo transparente.  
**Em fundo escuro:** botão branco com texto `green.900` ou lima com texto escuro.

Labels usam verbo + objeto: “Explorar os dados”, “Baixar a base”, “Ver evidências”. Evitar “Clique aqui”.

### 8.8 Rodapé institucional

- assinatura principal;
- logos de parceiros em faixa separada e monocromática quando possível;
- links de metodologia, acessibilidade, contato e dados abertos;
- data da última atualização;
- contraste mínimo de 4,5:1.

---

## 9. Padrões por canal

### 9.1 Apresentações

- Formato 16:9.
- Uma ideia principal por slide.
- Alternar slides expressivos e informativos para criar ritmo.
- Máximo de seis itens por lista.
- Títulos alinhados à esquerda, salvo aberturas de pergunta.
- Imagens com recorte grande e bordas arredondadas.
- Logos de parceiros apenas na abertura, fechamento ou rodapé discreto.

### 9.2 Redes sociais

- Criar um sistema modular para 1080 × 1080, 1080 × 1350 e 1080 × 1920.
- Manter assinatura e texto crítico dentro de área segura de 8%.
- Primeira tela: pergunta, dado ou ação — nunca introdução burocrática.
- Carrossel segue: gancho → contexto → dado → significado → ação → fonte.
- Texto alternativo obrigatório em cada publicação.

### 9.3 Painel e site

- Cabeçalho compacto com navegação previsível.
- Busca, filtros e download devem ser acessíveis por teclado.
- Estados de carregamento, vazio, erro e ausência de dados são obrigatórios.
- Gráficos precisam de visão tabular equivalente.
- URLs devem preservar filtros para permitir compartilhamento.
- Metodologia e evidências ficam a no máximo dois níveis do indicador.

### 9.4 Evento físico

- Sinalização usa alto contraste e poucas palavras.
- QR codes devem ter área livre e alternativa textual curta.
- Credenciais usam nome grande, organização e função.
- Painéis de fundo não devem competir com pessoas ou projeções.
- Materiais impressos precisam funcionar sem depender de links digitais.

---

## 10. Motion

As regras abaixo são inferidas a partir da linguagem de barras e progressão da marca.

| Token | Duração | Uso |
|---|---:|---|
| `motion.fast` | 120 ms | hover e feedback imediato |
| `motion.base` | 220 ms | entrada de componente |
| `motion.slow` | 420 ms | transições editoriais e gráficos |

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
```

- Barras podem crescer a partir de uma linha-base para revelar dados.
- Números podem contar apenas quando isso ajuda a compreensão.
- Evitar animação contínua em dashboards.
- Respeitar `prefers-reduced-motion`; substituir movimento por troca instantânea ou fade curto.

---

## 11. Voz e conteúdo

### 11.1 Tom

- **Direto:** frases curtas e verbos ativos.
- **Didático:** explicar conceitos sem infantilizar.
- **Coletivo:** mostrar como cidadão, governo, controle e sociedade se conectam.
- **Confiável:** separar evidência, interpretação e recomendação.
- **Mobilizador:** terminar com próximo passo concreto.

### 11.2 Padrões de escrita

- Preferir “mudança do clima” quando alinhado à terminologia institucional do projeto; manter consistência no canal.
- Escrever números com unidade e período: “52% dos itens avaliados em 2026”.
- Explicar siglas na primeira ocorrência.
- Usar sentence case em títulos e botões.
- Não usar emojis como indicador de status.
- Não usar urgência artificial: “agora!”, “imperdível” ou “última chance” sem fundamento.

### 11.3 Estrutura narrativa recomendada

```text
Pergunta pública
→ dado principal
→ o que ele significa
→ como foi obtido
→ quem é afetado
→ o que pode ser feito
→ onde verificar a evidência
```

---

## 12. Acessibilidade

### 12.1 Requisitos mínimos

| Item | Requisito |
|---|---|
| Texto normal | contraste mínimo de 4,5:1 |
| Texto grande | contraste mínimo de 3:1 |
| Componentes e estados | contraste mínimo de 3:1 |
| Alvo de toque | mínimo de 44 × 44 px; preferencial 48 × 48 px |
| Foco | visível, com 2–3 px e contraste de 3:1 |
| Zoom | conteúdo funcional a 200% |
| Movimento | alternativa reduzida disponível |
| Gráficos | descrição, dados equivalentes ou tabela |
| Vídeos | legendas, transcrição e audiodescrição quando necessária |

### 12.2 Navegação por teclado

| Tecla | Ação |
|---|---|
| `Tab` / `Shift+Tab` | avançar ou voltar entre controles |
| `Enter` | ativar links e ações principais |
| `Espaço` | ativar botões, checks e switches |
| Setas | navegar em tabs, menus e opções agrupadas |
| `Esc` | fechar modal, menu ou popover |

### 12.3 Tecnologia assistiva

- Todo ícone funcional precisa de nome acessível.
- Imagens informativas precisam de texto alternativo que comunique a informação, não a aparência.
- Mapas e gráficos precisam de resumo e dados equivalentes.
- Cabeçalhos devem seguir ordem sem saltos.
- Tabelas precisam de cabeçalhos associados às células.
- Mudanças de filtro devem anunciar carregamento e quantidade de resultados.

---

## 13. Tokens para implementação

```css
:root {
  --clima-green-500: #018A3C;
  --clima-green-900: #005222;
  --clima-teal-700: #017147;
  --clima-lime-400: #D8E814;
  --clima-indigo-800: #333355;
  --clima-blue-400: #62A4FA;
  --clima-lime-500: #4CCA0F;
  --clima-yellow-300: #F8D668;
  --clima-amber-500: #EEA10D;
  --clima-red-600: #CB1615;
  --clima-neutral-900: #1E1E1E;
  --clima-neutral-100: #D9E0EA;
  --clima-white: #FFFFFF;

  --clima-brand-primary: var(--clima-green-500);
  --clima-brand-deep: var(--clima-green-900);
  --clima-brand-accent: var(--clima-lime-400);
  --clima-content-strong: var(--clima-indigo-800);
  --clima-content-default: var(--clima-neutral-900);
  --clima-surface-default: var(--clima-white);
  --clima-surface-muted: var(--clima-neutral-100);

  --clima-font-sans: "Aptos", "Arial", sans-serif;

  --clima-space-1: 4px;
  --clima-space-2: 8px;
  --clima-space-3: 12px;
  --clima-space-4: 16px;
  --clima-space-6: 24px;
  --clima-space-8: 32px;
  --clima-space-12: 48px;
  --clima-space-16: 64px;

  --clima-radius-small: 8px;
  --clima-radius-medium: 16px;
  --clima-radius-large: 28px;
  --clima-radius-pill: 999px;
}
```

Convenção: `clima.{categoria}.{papel}.{estado}`. Exemplo: `clima.color.action.primary.hover`.

---

## 14. Governança e operação

### 14.1 Fonte da verdade

- O arquivo vetorial da assinatura controla proporções e versões do logo.
- Este documento controla intenção, tokens e regras.
- A biblioteca de componentes controla estados e comportamento digital.
- Templates controlam aplicação por canal sem alterar tokens globais.

### 14.2 Fluxo para novas peças

1. Definir público, canal e ação desejada.
2. Escolher um padrão de composição existente.
3. Aplicar tokens sem criar novas cores ou estilos locais.
4. Testar contraste, hierarquia, leitura e responsividade.
5. Revisar dados, fontes, direitos de imagem e acessibilidade.
6. Registrar exceções antes da publicação.

### 14.3 Critérios de aceite

- A peça comunica uma ideia principal em até cinco segundos.
- Cores respeitam papéis semânticos e contraste.
- Tipografia usa Aptos ou fallback definido.
- Dados têm fonte, período, unidade e contexto.
- A leitura não depende apenas de cor.
- Logo e parceiros têm área de proteção.
- O conteúdo funciona no tamanho e canal de destino.
- Não existem elementos decorativos sem função narrativa.

### 14.4 Trade-offs assumidos

| Decisão | Benefício | Risco | Mitigação |
|---|---|---|---|
| Paleta ampla | flexibilidade para dados e campanhas | peças multicoloridas e inconsistentes | proporção 60/25/10/5 e papéis semânticos |
| Tipografia Aptos | continuidade com o material existente | aparência próxima de ferramentas Office | layouts, pesos e grafismos proprietários |
| Verde como marca | associação imediata ao clima e Brasil | semelhança com outras marcas ambientais | onda de dados, lima e índigo como assinatura |
| Fotografia institucional | credibilidade e contexto real | comunicação fria | priorizar pessoas, ação e proximidade |
| Perguntas grandes | forte poder editorial | repetição cansativa | reservar para aberturas e campanhas |

### 14.5 Pendências para versão 1.0

- Obter os arquivos vetoriais oficiais do logo e das marcas parceiras.
- Confirmar regras jurídicas de assinatura e co-branding.
- Definir owner e processo de aprovação.
- Criar templates editáveis para apresentação, redes sociais e documentos.
- Construir biblioteca de componentes do painel.
- Testar a paleta com usuários com diferentes tipos de daltonismo.
- Validar a terminologia oficial para status e escalas de avaliação.

---

## 15. Resumo executivo

O sistema visual do Climaton Brasil 2026 deve ser reconhecido por cinco sinais consistentes:

1. **Verde profundo + lima** como contraste proprietário.
2. **Aptos em extremos de peso**, do Light ao Black.
3. **Perguntas, números e palavras-chave** como protagonistas.
4. **Barras e ondas de dados** como grafismo de movimento coletivo.
5. **Evidência acessível**, conectando pontuação, significado, fonte e ação.

Quando houver dúvida, escolher a solução que torne o dado mais claro, a ação mais evidente e a participação mais possível.
