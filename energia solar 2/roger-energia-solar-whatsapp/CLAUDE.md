# Guia do projeto — Zênite

(Salve como `CLAUDE.md` na raiz do projeto se você usa o Claude Code, ou como `AGENTS.md` se usa o Codex, o Cursor ou outro agente. O conteúdo é o mesmo.)

Hero da Zênite, uma instaladora de energia solar fictícia de Goiânia, com um bloco curto de fechamento. Vite sem framework, GSAP (só na entrada e na contagem do HUD), fontes Archivo e IBM Plex Mono. A cara vem de **uma maquete em miniatura solta no céu da manhã**: a casa com os painéis numa ilha de terra vermelha, nuvens em camadas que derivam e seguem o cursor, o nome gigante sentado nas nuvens e, na rolagem, a câmera descendo para dentro da nuvem até o fechamento. O código já vem pronto em `arquivos/src/`, a página no `arquivos/index.html` e as imagens em `arquivos/public/`: o trabalho é montar, conferir e, depois, personalizar. A régua: **uma cena só**, nunca camadas coladas, e **nenhuma linha reta na tela** em momento nenhum da saída.

O site foi feito para ser mudado: os textos, os números e até a posição de cada nuvem estão no HTML das seções, as cores num bloco só, e o JS lê o que o HTML tem (quantas nuvens, quantas linhas no parágrafo, quais números o HUD conta, quantos dados no fechamento). Quase toda mudança que a pessoa pedir é editar HTML ou CSS, sem tocar nos módulos.

## Arquitetura
- **Uma seção por arquivo.** O `index.html` só tem o `<head>` e a ordem das seções (`<!-- @secao hero -->` etc.); o plugin `secoes` do `vite.config.js` troca cada marca pelo `src/sections/<nome>.html` no dev e no build. Mudar a ordem das seções ou tirar uma é mexer nessa lista (ver "Tirar, repetir ou trocar seções").

  | seção (`src/sections/`) | o que tem | estilo | movimento |
  |---|---|---|---|
  | `nav.html` | os quatro links (sem logo: o logo é o nome gigante) | `nav.css` | `nav.js` |
  | `hero.html` | o palco com as camadas (céu e serra, nuvens de longe, horizonte, ilha, frente, sombra de nuvem, muro, véu), o nome, o parágrafo, o botão, a dica e o HUD | `hero.css` | `palco.js`, `nuvens.js`, `entrada.js`, `hud.js`, `ilha.js`, `letras.js` |
  | `fecho.html` | o rótulo, o título, a linha de dados, o botão, a nota e o rodapé | `fecho.css` | — |

  O `<div class="grao">` fica no próprio `index.html`, depois do `<main>`.
- **O CSS é uma folha só**, `src/styles/site.css` (por `@import`, nesta ordem: `fonts.css`, `tokens.css`, `base.css` e uma folha por seção), ligada por `<link>` no `<head>`. Antes dela, inline: o script que escolhe a paleta (`?tema=`) e pinta o fundo da primeira tela, e o estilo crítico (a cena e a nav nascem escondidas, só com a névoa, até o `main.js` armar a entrada e pôr a classe `armada` no `<html>`). Nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página pinta crua por um instante a cada recarregamento.
- **Módulos** (`src/motion/`; cada um explica o que faz no cabeçalho):

  | arquivo | o que faz |
  |---|---|
  | `src/main.js` | a ordem: o grão, o nome em letras (e do tamanho que cabe), a ilha, as nuvens, o HUD e a entrada armada; solta a trava da primeira pintura; liga o palco e a nav; toca a entrada quando a ilha, as nuvens e as fontes estão prontas (no máximo 3 s). Sem o hero na página, só a nav e os links |
  | `grao.js` | o ladrilho de ruído do grão, gerado uma vez em canvas |
  | `letras.js` | divide o texto de `.marca__linha` em uma letra por `<span>` (a entrada sobe uma a uma) e diminui o nome se ele não couber na coluna |
  | `ilha.js` | a máscara da perspectiva aérea sai do próprio `<img>` da ilha, e a caixa toma a proporção do `width`/`height` dele |
  | `nuvens.js` | embrulha cada `<img>` de nuvem numa caixa que deriva em loop (animação CSS), posiciona pelos atributos e mostra só as da tela atual (computador ou celular) |
  | `hud.js` | lê os números do HUD no HTML, conta até eles na entrada e depois os mantém vivos (relógio em tempo real, geração oscilando, total somando) |
  | `entrada.js` | a tabela `ENTRADA`: cada peça com o estado de partida, o de chegada e o tempo. Peça que não existe no HTML é pulada |
  | `palco.js` | a cada quadro, o parallax do cursor e a saída pela rolagem; lê `data-prof`, `data-saida` e `data-escala` de cada `.camada`; os momentos da saída estão na tabela `SAIDA` |
  | `nav.js` | some ao descer, volta ao subir e ao receber foco; sem o hero, nasce tinta cheia |

## Design system
- **Cores em papéis**, nunca pelo nome, em `src/styles/tokens.css`: o céu `--cor-ceu-1` a `--cor-ceu-5` (de cima para o horizonte), `--cor-nevoa` (o pé do céu e a primeira tela), `--cor-sol` (o brilho no canto), `--cor-papel` (o nome, o texto e o botão do hero), `--cor-papel-2` (o fechamento, o véu e o muro), `--cor-tinta` (a barra da nav, o círculo da seta, o texto do fechamento, as sombras de texto) e `--cor-tinta-2` (rótulos e notas do fechamento). Os **tons da cena** (`--cor-serra`, `--cor-clarao`, `--cor-bruma`, `--cor-bruma-funda`, `--cor-bruma-frente`, `--cor-bruma-pe`, `--cor-nevoa-quente`, `--cor-ceu-sombra`, `--cor-sombra`, `--cor-halo`) saem desses papéis por `color-mix`. Na paleta padrão um bloco logo abaixo (`:root:not([data-tema])`) fixa esses tons no valor exato do desenho original: **ao trocar qualquer papel da paleta, apague esse bloco**, senão os tons da paleta antiga continuam (trocando só a tinta e o papel, os tons da cena passam a sair deles, o que é o certo). Três paletas: `zenite` (padrão), `entardecer` e `mata` (`?tema=entardecer`, `?tema=mata`). Nenhuma cor solta no CSS das seções: transparência é `color-mix(in srgb, var(--cor-tinta) 42%, transparent)`.
- **Contraste**: o texto do hero é `--cor-papel` sobre o céu e as nuvens; a sombra de nuvem atrás dele e a `--sombra-texto` seguram a leitura, e não podem sair. O fechamento é `--cor-tinta` sobre `--cor-papel-2`. A tinta precisa ser escura (é a barra da nav e o círculo da seta sobre o creme). A ilha e as nuvens são imagens com a luz da manhã: um céu muito diferente (noite, verde, roxo forte) briga com elas; fique em céus de dia ou de fim de tarde.
- **Tipos**: Archivo variável (`--grotesca`), com `font-variation-settings: 'wdth' 106` no nome (104 no título do fechamento; o resto na largura normal): o nome em 560 com tracking −0,055em, os textos em 420–480 e os botões em 500; IBM Plex Mono 400 (`--mono`) no HUD, na dica, nos rótulos e no rodapé, com números tabulares no HUD. Pelo Fontsource (OFL: uso comercial liberado).
- **Tamanhos** em `tokens.css`: `--t-marca` (`min(17.6vw, 31svh)`, 29vw no celular), `--t-titulo`, `--t-texto`, `--t-nav`, `--t-hud` e `--t-micro` (12 px no celular), e a margem lateral `--margem` (`clamp(16px, 2.3vw, 40px)`).
- **Forma**: botão `.botao` em pílula de 52 px (50 no celular) com o círculo da seta de 38 px (variante `.botao--tinta` no fechamento); a nav em barra translúcida com cantos de 18 px e `backdrop-filter`; fios de 1 px na linha de dados.
- **Recortes** (ilha e nuvens): WebP com fundo transparente, alfa macio, sem halo, sem sombra projetada dentro da imagem. A luz é a mesma em todos (sol da manhã pela direita).

## Regras de movimento
- **Nenhuma linha reta na tela, nunca.** Toda camada ou fundo que termina dentro da área visível em algum momento da saída termina em degradê (`mask-image`) ou é maior que a tela. Já pegaram: a base reta dos bancos de nuvem (resolvida no recorte), a base do polígono da serra (máscara), a ponta de baixo das faixas de névoa (descem até 2–3 alturas abaixo) e a borda de baixo da sombra de nuvem quando ela subia com a frente (por isso ela é uma camada própria, parada).
- **Profundidade de verdade**: quanto mais perto, mais rápido deriva, mais se mexe com o cursor e mais rápido sai na rolagem. As de longe são menores, mais frias e desfocadas; as do muro (as mais perto) são enormes e desfocadas. **Nunca céu azul no pé da tela**: as faixas de névoa existem para isso. **A mesma nuvem nunca aparece duas vezes lado a lado na mesma camada.**
- **Duas caixas por camada**: a `.camada` de fora recebe o `transform` do cursor e da saída (`palco.js`, só quando algo muda); a `.camada__in` de dentro recebe a entrada (GSAP). Assim os dois nunca brigam. A deriva das nuvens e a flutuação da ilha são animação CSS (rodam no compositor) e pausam com o hero fora da tela.
- Só `transform` e `opacity` por quadro. Filtros (desfoque, tom) fixos em cada imagem, nunca animados.
- A entrada começa com o estado inicial já aplicado (`gsap.set`) antes do primeiro quadro, senão a cena pisca pronta antes de entrar. O texto que sobe por máscara (as letras, as linhas) fica escondido até a vez dele: a sombra do texto vazaria da máscara.
- Um grão só, por cima de tudo (inclusive do texto). Nada de grão por camada.
- Nada de vídeo: a cena é feita de imagens paradas que se mexem. Se a pessoa pedir que o dia passe ou que a casa se mexa, é outra peça (vídeo, com custo de geração).
- `prefers-reduced-motion`: sem deriva, flutuação, parallax, giro do asterisco, entrada e saída; o hero não fica preso e o véu desfaz a base no creme do fechamento **por trás** do texto e do botão; a dica fica em tinta para aparecer sobre o creme; o HUD já aparece com os valores e o relógio anda.

## Celular: regras que não se quebram
- **Nunca rolar para o lado.** O palco tem `overflow: hidden`; se algo vazar fora dele, conserte a origem.
- Abaixo de 760 px o hero tem composição própria (o bloco `@media (max-width: 760px)` no fim de `hero.css`): a ilha centralizada com 98vw e centro a 32% da altura, o nome em 29vw, o parágrafo e o botão empilhados embaixo, a dica escondida, o HUD logo abaixo da nav. As nuvens do celular são as `<img>` com `data-tela="celular"`, com outra unidade de tamanho (maiores em relação à tela, menos peças). Nuvem nova precisa de uma versão para cada tela, ou fica só numa.
- Hover só com mouse: todo `:hover` fica dentro de `@media (hover: hover)`. O parallax do cursor só liga com mouse.
- Alvos de toque de 44 px (os links da nav ganham enchimento com margem negativa, sem mudar o desenho). Texto de leitura de no mínimo 12 px.

## Como checar
1. `npm run build` sem erro e sem aviso de arquivo faltando; `npm run preview` (porta 5190; ocupada, passe outra: `npm run preview -- --port 5191`; o `npm run dev` usa a mesma porta).
2. Recarregar: o primeiro quadro já é a névoa creme, nunca a página crua nem a cena pronta antes de entrar; depois o céu, as nuvens, a ilha subindo, o nome letra a letra, o HUD contando.
3. Hero em 1456 × 840 e 390 × 844: o nome inteiro na tela, o parágrafo legível sobre as nuvens (recorte o print e olhe a parte mais clara), nada cobrindo o botão.
4. Mouse: as camadas se mexem em profundidades diferentes; as nuvens derivam sem que se veja a volta.
5. Saída em 15, 30, 45, 62 e 80% (computador) e 45% (celular), esperando ~2 s depois de rolar (a suavização): amplie com `page.screenshot({ clip })` e procure **linha reta horizontal** e **pedacinho solto**. Linha reta = alguma camada terminando na tela; pedacinho = alfa sujo no recorte ou a ilha ainda visível entre as nuvens.
6. A nav some ao descer e volta ao subir; sobre o creme do fechamento, fica tinta quase cheia (92%).
7. Fechamento: a borda de cima sai da nuvem sem uma tela de creme vazio antes; a linha de dados em seis colunas (três até 1100 px, duas no celular).
8. `?tema=entardecer` (enquanto os temas de exemplo existirem): a paleta troca em toda a página. Movimento reduzido: o hero parado, inteiro e legível, com o botão por cima do creme.
9. No celular, `document.documentElement.scrollWidth` igual à largura da tela. Console sem erros.
10. O `dist/` numa subpasta, com um servidor estático de verdade (o `vite preview` esconde arquivo faltando): `cp -R dist _teste/zenite`, `python3 -m http.server 8765 --directory _teste`, abrir `http://localhost:8765/zenite/` e ver o console sem 404 (sem navegador: `curl -I` em cada arquivo que o `index.html` e o CSS do `dist/` citam). Depois derrubar o servidor e apagar `_teste/`. Caminho de arquivo nunca vai escrito como texto no JS (`"/img/..."`): a imagem fica no HTML ou no CSS, que o Vite ajusta para a subpasta.

## Personalizar

Vale sempre que a pessoa pedir uma mudança, hoje ou daqui a meses: trocar a marca, um texto, um número, a cena, o negócio inteiro, ou levar uma peça para outro site.

### As três perguntas
Se ainda não sabe, pergunte (uma por vez, em linguagem simples):
1. É **a demo**, **a empresa da pessoa** (de energia solar ou de outro negócio) ou **peças soltas** num site que já existe?
2. Que material ela já tem (foto da fachada, do produto, logo, cores) e o que falta? Nome, cidade, o que faz em uma frase, os números que quer mostrar, contatos e links (WhatsApp, orçamento, Instagram): pergunte o que não sabe, sem pedir tudo de uma vez.
3. O que ela quer manter da demo (a entrada em camadas, o HUD contando, as nuvens seguindo o cursor, a saída para dentro da nuvem, a linha de dados)?

Diga com clareza o que muda só com texto e o que depende de imagem nova (tabela abaixo). A casa com os painéis é uma imagem: nenhuma IA de código troca a casa dentro dela.

Para peças soltas: leia o código do site de destino antes. Se for React, Next ou outro framework, leve o HTML da seção, a folha dela (com os tokens que ela usa) e os módulos de `src/motion/` que ela usa, adaptados ao framework (cada módulo vira um efeito que roda depois de o componente montar e se desfaz ao desmontar), em vez de colar esta página inteira. A cena precisa do palco preso (`.hero` com 200svh e `.palco` sticky) para a saída funcionar.

### O que muda e onde
| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome, textos, links | o HTML da seção (tabela da Arquitetura); o `<title>` e a `description` no `index.html`; o ícone da aba, `public/favicon.svg` (o asterisco azul da Zênite: troque pelo símbolo da marca); os nomes da demo que aparecem para quem visita ou para o leitor de tela: o `id="simular"` do fechamento (vira `#simular` na URL), os `aria-label` do HUD ("Geração da casa agora") e o `alt` da ilha | não |
| O nome gigante | `hero.html`: o texto de `.marca__linha` (o JS divide em letras; o asterisco-sol fica no fim) e o `.sr` logo acima (o nome para leitor de tela), os dois iguais; no rodapé, `.fecho__marca` em `fecho.html`. O tamanho padrão vale até o nome encher a coluna; um nome mais comprido diminui sozinho. De 4 a 8 letras fica como na demo; com mais, ele fica mais baixo (dá para usar só a palavra mais forte do nome no hero e o nome inteiro no rodapé). O asterisco-sol é o símbolo da Zênite: com outra marca, apague o `<span class="marca__sol">` (e o do rodapé) ou troque pelo símbolo dela. O `.sr` é o título da página para o leitor de tela e a busca: pode ter o nome inteiro ("Pousada Vale Alto") mesmo quando o nome gigante mostra só a palavra mais forte | não |
| O parágrafo do hero | `hero.html`: uma linha por `<span class="linha"><span>…</span></span>` (as quebras são estas, em qualquer tela; de 2 a 4 linhas, até ~38 caracteres cada) | não |
| O HUD | `hero.html`: o texto fixo (a cidade, a latitude, "Gerando agora", "Hoje:") é texto comum; os números são `<span data-hud>`: `hora` (o horário da cena; `data-de` é de onde o relógio conta), `agora` (a geração de agora, oscila) e `hoje` (o total, soma). O valor escrito é o de chegada; as casas decimais saem dele. Sem `agora` na página, `hoje` só conta de 0 até o valor escrito: serve para qualquer número fixo do negócio ("8 chalés", "120 obras"). A `hora` é a da cena (começa no `data-de` e anda), não a hora real de quem visita; para a hora real, é preciso mudar o `hud.js`. Para outro negócio, troque por números que façam sentido ou apague o `.hud` inteiro: nada quebra. Troque também o `aria-label` de cada bloco do HUD | não |
| Linha de dados, título e nota do fechamento | `fecho.html` (`.dado`: rótulo `<dt>` e valor `<dd>`; qualquer quantidade, de 3 a 8 fica bem) | não |
| Links da nav e dos botões | `nav.html`, `hero.html`, `fecho.html`: na demo, todos levam a `#simular`; troque pelo WhatsApp (`https://wa.me/55...`), pelo formulário ou pelas seções novas | não |
| Cores | `tokens.css`: troque os papéis do `:root` (ou escolha `entardecer`/`mata` e passe os valores dela para o `:root`) e **apague o bloco `:root:not([data-tema])`**; no `index.html`, o par de cores do tema padrão (`zenite`) no script do `<head>` (a `--cor-nevoa`, fundo da primeira tela, e a `--cor-ceu-1`, cor do navegador no celular) e o `theme-color`. Os temas de exemplo podem sair (o bloco em `tokens.css` e a linha no script). Confira o contraste da seção "Design system" | não |
| Fontes | `fonts.css` (os `@import` antes de qualquer outra regra) e `--grotesca`/`--mono` em `tokens.css`. O nome pede uma grotesca de largura média; sem o eixo de largura, tire os `font-variation-settings` | não |
| Velocidade e quantidade de nuvens | `hero.html`: cada `<img>` de nuvem (`data-tela`, `data-x`, `data-y`, `data-largura`, `data-espelhada`, `data-opacidade`; o comentário no topo explica a unidade), `data-vel` e `data-blur` em cada camada. Tirar uma nuvem é apagar o `<img>` | não |
| Profundidade e saída | `data-prof`, `data-saida`, `data-escala` em cada `.camada` do `hero.html`; os momentos da saída (quando o texto some, a ilha some, o véu fecha) na tabela `SAIDA` do `palco.js`; a entrada na tabela `ENTRADA` do `entrada.js` | não |
| A ilha | `public/img/ilha.webp` e o `<img class="ilha__img">` do `hero.html` (`src`, `width`, `height`, `alt`), o preload no `index.html`; tamanho e centro em `.ilha` no `hero.css` (computador e celular). Mantendo a ilha da demo num outro negócio, deixe o `alt` vazio (`alt=""`) até a imagem nova chegar: o texto atual descreve uma casa com painéis solares | sim |
| As nuvens | `public/img/nuvem-<n>.webp` (com `width`/`height` no `<img>`) | só para outra luz |
| O céu, a serra, a névoa, o grão | código: as cores em `tokens.css`, a serra é o SVG no `hero.html` (apague para um horizonte sem serra), o grão é o `<div class="grao">` do `index.html` (apague para tirar) | não |

### Outro nicho
A cena é uma maquete flutuando: o que é de energia solar está em pontos marcados. Para uma construtora, uma imobiliária, uma pousada, uma escola, uma loja:
- **A ilha**: a fachada, a obra, a casa à venda, a pousada, o produto em miniatura, gerada pelas receitas (`arquivos/receitas/LEIA.md` diz o que trocar no prompt). É a única imagem nova; até ela chegar, a casa com painéis continua aparecendo, e isso contradiz um negócio que não é de energia solar: diga à pessoa sem rodeio.
- **O HUD**: números do negócio que mudem com o tempo (obras entregues no ano, a hora local e o clima, a ocupação da pousada) ou só a hora e a cidade; os valores ficam `[preencher]` até a pessoa dar.
- **O parágrafo e o fechamento**: o que ela faz e os números dela (prazo, área, quartos, alunos, preço a partir de). O título do fechamento troca "a conta de luz caiu" pelo resultado que o cliente dela tem.
- **A dica e os links**: "[ role para ver o sistema ]" vira o que vem depois ("[ role para ver a obra ]"); a nav aponta para as seções que existirem.
- **Paleta**: a da marca dela nos papéis (a tinta e o papel), mantendo um céu de dia ou de fim de tarde (a luz das imagens). No hero, a tinta só aparece na barra da nav (a 42%, sobre o céu) e no círculo da seta: a cor da marca aparece mesmo no fechamento. Para ela pesar mais no hero, o botão do hero pode passar a ser tinta cheia (`.botao` em `hero.css`).

### Tirar, repetir ou trocar seções
- **Tirar uma seção**: apague a linha `<!-- @secao nome -->` do `index.html`. Cada módulo confere se a peça dele existe e, sem ela, não faz nada: não é preciso mexer no JS. Confira os links `href="#..."` que apontavam para ela (a nav e os botões usam `#simular`), tire o `@import` da folha dela do `site.css` se não for mais usada e, sem o hero, apague também o preload da ilha no `<head>`. Sem o fechamento, a página termina na névoa creme do fim da saída.
- **Tirar peças do hero**: o HUD, a dica, o botão, a serra, uma camada inteira de nuvens, o asterisco: apague do `hero.html`. O console fica limpo.
- **Seção nova depois do hero**: a **primeira seção dentro do `<main>`** sobe 45svh por cima do fim do hero e a borda de cima dela desfaz na névoa (`.hero + main > :first-child` no `hero.css`), então ela precisa ter o fundo `--cor-papel-2`. Seção nova vai num arquivo `src/sections/<nome>.html`, uma folha `<nome>.css` importada no `site.css`, fundo de um dos papéis, títulos em Archivo 520 com tracking negativo, rótulos em mono entre colchetes ("[ como funciona ]"), botões `.botao`, fios de 1 px em tinta a 18%; se tiver movimento, curvas que já existem (`expo.out`, texto subindo por máscara). Nada de componente de outra linguagem visual.
- **Mais ou menos itens**: linhas do parágrafo, dados do fechamento, links da nav e nuvens aceitam qualquer quantidade (com bom senso: 4 links na nav cabem no celular; 5 ficam apertados).

### Material da pessoa
Para a ilha (a única peça visual que muda de negócio para negócio), ofereça estes caminhos, do mais simples para o mais trabalhoso, e deixe a pessoa escolher:
1. **Manter a casa da demo por enquanto** e trocar todo o resto. O site fica pronto hoje.
2. **Usar uma foto que ela já tem** só como referência: uma foto comum da fachada não serve direto (a cena pede uma maquete recortada, vista de três quartos de cima, com a terra em cone embaixo), mas serve para o gerador copiar a fachada.
3. **Gerar com IA** seguindo `arquivos/receitas/LEIA.md`: o prompt que fez a ilha da demo e o que trocar nele.

**Toda camada nova passa pelo `arquivos/fonte/camadas.mjs`** (rode uma vez `npm install -D -E sharp@0.35.5`): salve em `fonte/ilha.png` (ou `fonte/nuvem-<n>.png`) na raiz do projeto, com fundo transparente, e rode `node arquivos/fonte/camadas.mjs`. Ele tira os pedacinhos soltos do recorte, desfaz a base das nuvens e grava em `public/img/`, mostrando o `width` e o `height` para pôr no `<img>`. Nunca solte um PNG grande direto em `public/img/`.

### Regras ao trocar
- A sombra de nuvem atrás do texto, a sombra no texto e as faixas de névoa ficam (seção "Design system" e "Regras de movimento").
- Fato nunca se inventa: preço, economia, prazo, potência, número de obras, retorno, endereço, telefone e depoimento que a pessoa não deu ficam `[preencher]` (nunca no nome gigante) e entram na lista do fim. Os números do HUD também são fatos: sem dado real, troque por hora e cidade ou tire o HUD. Texto que não é fato (o parágrafo do hero, a dica, a nota do fechamento) pode ser escrito no tom da marca a partir do que ela contou, avisado como provisório na lista do fim.
- Os botões da demo levam ao bloco de fechamento: troque pelo WhatsApp, pelo formulário ou pela simulação de verdade da pessoa, e diga isso a ela.
- Todo botão novo usa `.botao` (hover e foco já vêm prontos).
- Depois de cada troca, rode o "Como checar" nos trechos que mudaram e, no fim, liste para a pessoa o que ainda é da demo (a casa da ilha, textos, números, links) e o que falta ela mandar.
