# Zênite: hero de energia solar com uma casa em miniatura flutuando no céu, entre nuvens que derivam e seguem o cursor, e a câmera descendo para dentro da nuvem na rolagem

## Antes de começar: pergunte

Antes de escrever qualquer código, faça estas perguntas, uma por vez e em linguagem simples (a pessoa pode não ser programadora):

1. **O que você quer fazer com este site?**
   - **Montar a demo como ela é**, para ver funcionando e trocar depois.
   - **Fazer o site da minha empresa** com esta abertura e estas animações. Serve a energia solar e a qualquer negócio que caiba numa miniatura em cima de uma ilha flutuante (construtora, imobiliária, arquitetura, pousada, sítio, escola, loja, oficina, agro, um produto): a estrutura é a de um hero de marca, e o que é de energia solar (os painéis, o HUD de geração, os números da conta de luz) troca pelo equivalente do negócio dela.
   - **Usar só algumas peças** (a cena em camadas com nuvens derivando e o parallax do cursor, a entrada com o nome subindo letra a letra, o HUD com os números contando, a saída em que a câmera desce para dentro da nuvem, o grão de filme, a linha de dados do fechamento) num site que já tenho.
2. Se for a empresa dela: o nome, a cidade, o que ela faz em uma frase, os números que quer mostrar (prazo, preço, economia, quantidade), os contatos e os links (WhatsApp, orçamento, Instagram), as cores da marca (se tiver) e **que material já tem** (foto da fachada, do produto, logo). Avise desde já:
   - a casa com os painéis é **uma imagem gerada por IA com fundo transparente**, e nenhuma IA de código troca a casa dentro da imagem: para o prédio ou o produto dela aparecer flutuando, é preciso gerar uma ilha nova pelas receitas de `arquivos/receitas/LEIA.md` (uma imagem só). Até lá, o site funciona com a casa da demo;
   - as nuvens servem para qualquer marca, e o céu, a névoa e as cores mudam pelo código, sem imagem nova.
3. Se forem peças: quais, e onde está o site que vai recebê-las.

Depois, em qualquer caminho, **monte primeiro a demo completa como descrita abaixo** e confira que ela roda: é o caminho testado e fica de referência. Só então aplique a marca ou extraia as peças, seguindo a seção "Personalizar" do guia. Termine com uma lista curta do que ainda é da demo e do que falta a pessoa mandar.

## A demo

Construa a primeira dobra do site da **Zênite** (marca fictícia), uma instaladora de energia solar residencial de Goiânia: projeto, instalação e homologação na distribuidora em 45 dias. É **um hero com um bloco curto de fechamento** (para a página ter onde rolar); outras seções entram depois, no mesmo estilo. Leia antes o guia do projeto desta pasta (`CLAUDE.md`, ou `AGENTS.md` no Codex e outros agentes: arquitetura, design system, regras de movimento e do celular, como conferir e como personalizar) e olhe as imagens em `arquivos/conceito/`: são prints do site pronto, o alvo de cada momento, em `-desktop` e `-mobile` (`00-entrada`, `01-hero`, `02-saida-30`, `03-saida-62`, `04-fecho`).

**Tudo o que o site usa já vem pronto em `arquivos/`:** o `index.html`, o `vite.config.js` (com o plugin que monta as seções), o código inteiro em `arquivos/src/` (três seções em HTML, as folhas de estilo e os oito módulos de movimento) e a ilha e as nuvens recortadas em `arquivos/public/`. Use tudo isso como está: não gere imagem nova, não reescreva os módulos e não troque nada por uma versão "mais simples". O trabalho é montar o projeto, instalar as dependências com as versões certas, copiar os arquivos para o lugar e conferir.

A ideia da página: **uma maquete em miniatura solta no céu da manhã**. Uma casa brasileira (paredes caiadas, porta azul, telhado de barro com 10 painéis solares, caixa d'água azul numa torre, mangueira carregada, varal colorido, moto vermelha, cachorro caramelo dormindo) em cima de um pedaço de terra vermelha do cerrado, com raízes e pedras penduradas, flutua entre nuvens que passam na frente e atrás dela, em camadas que se mexem em profundidades diferentes. O nome gigante fica embaixo, sentado nas nuvens. O risco é as camadas parecerem coladas; o que costura tudo é a mesma luz em todas, alfa macio nos recortes, névoa na base da ilha e **um grão de filme só, por cima de tudo**. A régua: **nenhuma camada termina numa linha reta que apareça na tela**, nem no hero nem no meio da saída.

---

## Parte 1 — O site

### Marca e tom
- Público: quem tem casa em Goiânia e região, paga de R$ 400 a R$ 1.000 de luz e está juntando orçamentos. Quer saber quanto a conta cai e em quanto tempo fica pronto.
- Tom concreto, número na frente: fala de painel, telhado, conta e dias ("10 painéis pagam a conta de luz", "45 dias", "R$ 780 para R$ 86"). Nada de "sustentabilidade", "economia inteligente" ou "energia do futuro".
- **Cores em papéis**, nunca pelo nome (`src/styles/tokens.css`): o céu de cima para o horizonte `--cor-ceu-1` a `--cor-ceu-5` (`#2B66A3`, `#3A78B4`, `#6F9EC9`, `#B7C8D6`, `#EAD9C2`), `--cor-nevoa` `#F3E3C8` (o pé do céu e a primeira tela), `--cor-sol` `#FFE8C4` (o brilho no canto de cima), `--cor-papel` `#FAF6EE` (o nome, o texto e o botão do hero), `--cor-papel-2` `#F1E7D6` (o fechamento, o véu e o muro da saída), `--cor-tinta` `#14233A` (a barra da nav, o círculo da seta, o texto do fechamento, as sombras de texto) e `--cor-tinta-2` `#3B4A60`. Os tons da cena (a serra, a névoa das nuvens, a sombra de nuvem, o lado da sombra da ilha) saem desses papéis por `color-mix`, então **a paleta inteira troca num lugar só**: `?tema=entardecer` (o céu do fim de tarde) e `?tema=mata` (a marca em verde) mostram duas outras paletas prontas.
- Tipos (Google Fonts, licença OFL, pelo Fontsource): **Archivo** variável com o eixo de largura (o nome em `wdth` 106, peso 560, tracking −0,055em; o título do fechamento em `wdth` 104, peso 520; os textos em 420–480 e os botões em 500, na largura normal); **IBM Plex Mono** 400 no HUD, na dica de rolagem, nos rótulos e no rodapé.
- Forma: botão em pílula de 52 px (50 no celular) com um círculo de 38 px e uma seta (a seta gira −45° com o mouse em cima); nav em barra translúcida com cantos de 18 px e desfoque do fundo; fios finos de 1 px na linha de dados.

### A cena, de trás para a frente
O hero é um palco de 100svh **preso** (sticky) enquanto a página rola mais 100svh (a saída, mais abaixo). Dentro dele, camadas absolutas em tela cheia, cada uma com a profundidade escrita no HTML:
1. **Céu**: gradiente CSS vertical com as cinco cores do céu e a névoa no pé, um brilho de sol radial no canto superior direito e um clarão quente largo perto do horizonte. Uma serra distante em SVG próprio, bem apagada e desfocada, na linha de 55% da altura, com a base desfeita por máscara (a base do polígono é reta e apareceria através da névoa na saída).
2. **Nuvens de longe**: pequenas, dos dois lados da ilha, mais frias e com desfoque leve.
3. **Mar de nuvens do horizonte**: o cúmulo alto à esquerda e dois bancos largos, com uma faixa de névoa quente por baixo, para que **nunca apareça céu azul no pé da tela**. As faixas de névoa descem muito além da tela, para a ponta de baixo nunca aparecer quando as camadas sobem.
4. **A ilha** (1446 × 994, fundo transparente), centrada em 51,5% da largura e 40,5% da altura, com `min(62vw, 96svh)` de largura, levemente dessaturada. Por cima, uma camada com a **própria ilha como máscara** pintada com um gradiente: o azul do céu no lado esquerdo (sombra) e a névoa creme nos 25% de baixo (perspectiva aérea). Atrás da base, uma névoa radial desfocada.
5. **Nuvens da frente**: bancos largos e um cúmulo passando sobre a base da ilha e atrás do nome, com outra faixa de névoa no pé.
6. **Sombra de nuvem** atrás do texto, numa camada própria e **parada**, do tamanho do palco (se subisse com as nuvens, a borda de baixo apareceria como faixa reta): gradientes de tinta a ~40% atrás do parágrafo, ~20% atrás do nome e ~30% subindo do pé. Parece sombra de nuvem, não mancha.
7. **O muro**: as nuvens mais perto da câmera, enormes e desfocadas, em três fileiras que se sobrepõem, escondidas abaixo da tela até a saída.
8. **Texto e interface** (abaixo) e, cobrindo a página inteira, o **grão**: um ladrilho de ruído gerado em canvas (180 px, desenhado a 160), em `soft-light` a 30%, pulando de posição em saltos.

As nuvens são `<img>` no `hero.html`, com a posição nos atributos (`data-tela` computador ou celular, `data-x`, `data-y`, `data-largura`, `data-espelhada`, `data-opacidade`): cada tela tem a sua composição, e seis recortes se repetem com outro tamanho, espelho e opacidade, nunca lado a lado na mesma camada.

### Texto e interface
- **Nav**: barra centrada no topo (14 px da borda), em tinta translúcida com desfoque, só com links em creme: "Como funciona", "Simulação", "Obras", "Dúvidas". Sem logo: o logo é o nome gigante. **Some ao descer e volta ao subir** (sempre visível no topo e ao receber foco), assim nunca passa por cima da ilha na saída; sobre o creme do fechamento, vira tinta quase cheia (92%).
- **HUD** em mono, creme com sombra suave, números tabulares: no canto superior esquerdo "10:40 · Goiânia · 16°40′S" / "Gerando agora 4,1 kW"; no direito "Hoje: 9,8 de 27 kWh".
- **Nome**: "Zênite" gigante embaixo à esquerda (`min(17.6vw, 31svh)`), creme, e logo depois um **asterisco-sol** em SVG próprio (oito raios arredondados), alto como um expoente, girando devagar (uma volta em 48 s). Um nome que não caiba na coluna diminui sozinho até caber.
- **À direita**, alinhado com a base do nome: "10 painéis pagam a conta de luz / de uma casa em Goiânia. Projeto, / instalação e homologação em 45 dias." (três linhas fixas, uma por `<span class="linha">`) e o botão creme "Simular minha conta".
- **No pé, ao centro**: "[ role para ver o sistema ]" em mono.

### Movimento
- **Nuvens derivando sem parar** para a direita, cada camada numa velocidade (longe devagar, frente mais rápido), em **loop sem emenda**: cada nuvem anima em CSS de logo antes da borda esquerda até logo depois da direita, com atraso negativo para começar no lugar certo. Nunca dá para ver a volta.
- **Ilha flutuando**: ±0,8% da altura dela em 7,5 s, ida e volta, com ±0,3° de giro.
- **Parallax do cursor**: cada camada se desloca no sentido contrário ao cursor, até 26 px na horizontal e 14 px na vertical vezes a profundidade (céu 0,05; longe 0,18; horizonte 0,34; ilha 0,58; frente 1), suavizado. Só com mouse.
- **Entrada em camadas** (GSAP), depois que a ilha, as nuvens e as fontes carregam (no máximo 3 s de espera): a tela começa na névoa; o céu aparece; as nuvens de longe e do horizonte sobem; **a ilha sobe 20% da altura** e cresce de 0,94 a 1; as nuvens da frente sobem; **o nome entra letra a letra por máscara**; o asterisco gira para o lugar; o parágrafo entra linha a linha por máscara; nav e botão aparecem; **o HUD conta**: o relógio de 05:40 a 10:40, a geração de 0 a 4,1 kW, o total de 0 a 9,8 kWh. Tudo em ~4 s. Cada peça é uma linha na tabela do `entrada.js`, e peça ausente é pulada.
- **HUD vivo** depois da entrada: o relógio anda em tempo real, a geração oscila de leve em volta do valor e o total do dia soma o que está sendo gerado. Os valores de partida e de chegada estão no HTML.
- **Saída na rolagem** (a câmera desce para dentro da nuvem), pelo progresso `p` de 0 a 1 nos 100svh do palco preso, suavizado: cada camada sobe `p × saída × altura` (céu 0,06; longe 0,16; horizonte 0,32; ilha 0,6 encolhendo 14%; frente 1,25 crescendo 38%); a ilha some na névoa entre `p` 0,28 e 0,58 (sem pedaços de raiz soltos entre as nuvens); o **muro** sobe de baixo desde o começo e cobre tudo; nome, parágrafo e botão sobem e somem até 0,3, o HUD até 0,22; um véu creme fecha a tela de 0,5 a 0,9; o fechamento sobe 45svh por cima do fim do hero, com a borda de cima desfazendo em gradiente, e o conteúdo sai de dentro da nuvem.

### Depois do hero: o fechamento
Fundo `--cor-papel-2`, texto tinta: "[ o sistema dessa casa ]" em mono; o título "A conta de luz caiu / de R$ 780 para R$ 86."; a **linha de dados** de borda a borda, rótulo em mono e valor embaixo, separados por fios: Painéis "10 × 550 W" · Potência "5,5 kWp" · Geração "27 kWh/dia" · No mês "810 kWh" · Conta "R$ 780 → R$ 86" · Retorno "2 anos e 9 meses" (qualquer quantidade de dados funciona); o botão tinta "Simular minha conta" e ao lado "Com a sua conta de luz em mãos, a simulação leva dois minutos."; o rodapé em mono com "Zênite✱", "Energia solar · Goiânia, GO" e "Projeto, instalação e homologação". Os links da nav e os botões levam a este bloco.

### Interações, movimento reduzido e celular
- Os hovers só existem com mouse (`@media (hover: hover)`): no toque, nada fica "grudado". Foco visível com anel creme.
- `prefers-reduced-motion`: sem deriva, flutuação, parallax, giro do asterisco, entrada e saída; o hero não fica preso e a base desfaz no creme do fechamento por trás do texto; o HUD já aparece com os valores e o relógio anda.
- Celular (390 px): a ilha centralizada com 98vw, o nome em 29vw cabendo na largura, o parágrafo e o botão empilhados embaixo; a nav em largura cheia com os quatro links (cada um com 44 px de alvo de toque); o HUD em 12 px logo abaixo dela; sem a dica de rolagem; uma composição própria de nuvens (maiores em relação à tela, menos peças) e a mesma saída; a linha de dados em duas colunas. Nada rola para o lado.

---

## Parte 2 — Como construir (stack)

- **Vite sem framework**: HTML, CSS e JS puros. Crie o arquivo `package.json` escrevendo-o direto (não use `npm init` nem um template do `npm create`, que trazem campos e arquivos a mais), com `"type": "module"`, `"private": true` e os scripts `"dev": "vite"`, `"build": "vite build"` e `"preview": "vite preview"` (nome e versão à sua escolha), e instale com versão travada, escrito por extenso (`npm install`, não `npm i`), um comando por linha:
  - `npm install -E gsap@3.15.0 @fontsource-variable/archivo@5.3.0 @fontsource/ibm-plex-mono@5.3.0`;
  - `npm install -E -D vite@8.3.3` (dependência de desenvolvimento).

  O npm pode avisar de vulnerabilidades em dependências internas do Vite (as ferramentas de desenvolvimento, que não vão para o site publicado). Não rode `npm audit fix --force`: ele troca o Vite de versão e o projeto deixa de bater com o testado.
- Crie um `.gitignore` com `node_modules/`, `dist/` e `_teste/`.
- **Copie os arquivos** com `cp` (as pastas inteiras de uma vez, um comando por linha, sem encadear com `&&`: em sessões com permissões restritas, comando composto pede aprovação):

  | de | para |
  |---|---|
  | `arquivos/index.html` | a raiz |
  | `arquivos/vite.config.js` | a raiz (o plugin `secoes` troca cada `<!-- @secao nome -->` do `index.html` por `src/sections/nome.html`; `base: './'`: o `dist/` abre em qualquer pasta da hospedagem; o servidor de desenvolvimento e o `preview` abrem na porta 5190; se ela estiver ocupada, passe outra: `npm run preview -- --port 5191`) |
  | `arquivos/src/` (a pasta inteira) | `src/` |
  | `arquivos/public/` (a pasta inteira) | `public/` |

  Os comandos, da raiz do projeto: `cp arquivos/index.html .`, `cp arquivos/vite.config.js .`, `cp -R arquivos/src src` e `cp -R arquivos/public public` (sem barra no fim do nome da pasta). Copie antes de existir uma pasta `src/` ou `public/` na raiz (senão o `cp -R` cria `src/src/`); se alguma já existir de uma tentativa anterior, apague-a antes de copiar. A pasta `arquivos/` continua onde está: não entra no site nem no `dist/`.

  Confira depois da cópia: `src/main.js`; `src/motion/` com 8 módulos (`entrada.js`, `grao.js`, `hud.js`, `ilha.js`, `letras.js`, `nav.js`, `nuvens.js`, `palco.js`); `src/sections/` com 3 HTML (`nav`, `hero`, `fecho`) e 3 folhas CSS com os mesmos nomes; `src/styles/` com 4 folhas (`site.css`, `fonts.css`, `tokens.css`, `base.css`); `public/favicon.svg`; `public/img/` com 7 imagens (`ilha.webp` e `nuvem-1`, `nuvem-2`, `nuvem-3`, `nuvem-4`, `nuvem-6`, `nuvem-7`, todas `.webp`; a nº 5 não existe, de propósito).
- **CSS numa folha só, por `<link>`**: o `arquivos/index.html` já traz, no `<head>`, o script que escolhe a paleta (`?tema=`) e pinta o fundo da primeira tela antes de qualquer arquivo, o estilo crítico inline (a cena nasce escondida, só com a névoa, até o JS armar a entrada) e depois `<link rel="stylesheet" href="/src/styles/site.css">` (as fontes, os tokens, a base e as seções por `@import`). Mantenha assim e nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página aparece crua por um instante a cada recarregamento.
- Leia o cabeçalho dos módulos antes de mexer em qualquer coisa: `src/main.js` divide o nome em letras, põe as nuvens no lugar, arma a entrada (as peças escondidas no ponto de partida), solta a trava da primeira pintura, liga o palco (cursor e saída) e a nav, e toca a entrada quando a ilha, as nuvens e as fontes estão prontas. O mapa de cada arquivo está no guia.
- `arquivos/conceito/` e `arquivos/receitas/` não entram no site; `arquivos/fonte/` só serve para converter uma ilha ou nuvens novas (ver o guia).
- No fim:
  - `npm run build` passa sem erro e sem aviso de arquivo faltando;
  - `npm run preview` abre o site em `http://localhost:5190/` (rodando em segundo plano, o PID do servidor é o do processo `node` do Vite, não o do `npm`): o primeiro quadro já é a névoa creme (recarregar nunca mostra a página sem estilo nem a cena pronta antes de entrar); o céu aparece, as nuvens sobem, a ilha sobe, o nome entra letra a letra, o asterisco gira para o lugar, o HUD conta até 10:40, 4,1 kW e 9,8 kWh; as nuvens derivam sem parar; o console fica limpo; `?tema=entardecer` troca a paleta inteira (céu, névoa, nav, botões, fechamento);
  - com o mouse: as camadas se mexem em profundidades diferentes (a da frente mais, o céu quase nada); a seta do botão gira; o Tab passa pelos links com o anel visível;
  - rolando devagar e de volta: a nav some ao descer e volta ao subir; as camadas se separam (a da frente sai mais rápido), a ilha some na névoa, o muro de nuvens sobe e fecha a tela em creme, e o fechamento sai de dentro da nuvem. Em nenhum momento aparece **linha reta horizontal** nem **pedacinho solto** (amplie os prints da saída em 15, 30, 45, 62 e 80%, se tiver como);
  - no celular (390 × 844) nada rola para o lado (`document.documentElement.scrollWidth` igual à largura da tela): a ilha centralizada, o nome cabendo na largura, o parágrafo e o botão empilhados embaixo, a linha de dados em duas colunas;
  - o `dist/` sobe em qualquer hospedagem estática, inclusive numa subpasta. Confira com um servidor estático de verdade, não com o `vite preview` (ele devolve o `index.html` para qualquer caminho e esconde arquivo faltando): crie uma pasta de teste dentro do projeto (`mkdir -p _teste`), copie o `dist/` para dentro dela com o nome `zenite/` (`cp -R dist _teste/zenite`), rode `python3 -m http.server 8765 --directory _teste` (ou outra porta, se essa estiver ocupada), abra `http://localhost:8765/zenite/` e confira o console sem nenhum 404, a ilha, as nuvens e a fonte. Sem navegador, faça essa parte pelo terminal: peça com `curl -I` cada arquivo que o `index.html` e o CSS do `dist/` citam (fontes, imagens, o JS e o CSS) e confira que todos respondem 200. Só arquivo conta: `href="#…"` (âncoras) não é arquivo e não entra na lista. Depois derrube o servidor e apague a pasta `_teste/`;
  - as conferências de tela (a entrada, o mouse, a rolagem, o celular) pedem um navegador. Se você não tiver como ver a página, abra o site para a pessoa e confira com ela, item por item, em vez de dar por conferido; se não houver ninguém para olhar, termine dizendo com todas as letras o que ficou sem conferir.
