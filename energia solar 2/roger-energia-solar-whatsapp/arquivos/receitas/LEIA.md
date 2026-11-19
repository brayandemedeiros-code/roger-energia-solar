# Receitas: como as camadas da Zênite foram feitas

A cena do hero tem duas imagens geradas por IA, as duas recortadas com o fundo transparente: **a ilha** (a casa com os painéis em cima de um pedaço de terra que flutua) e **uma folha de nuvens** (sete nuvens soltas, das quais seis entram no site). O céu, a serra, o asterisco, o grão e a névoa são feitos em código e mudam pelas cores (`src/styles/tokens.css`). Os prompts estão em inglês porque os geradores entendem melhor.

Nenhuma IA de código troca a casa dentro de uma imagem que já existe: para o seu prédio, a sua loja ou o seu produto aparecerem flutuando, é preciso gerar uma ilha nova.

## Do que você precisa

- **Um gerador de imagem que entregue PNG com fundo transparente**: ChatGPT (imagens), Gemini, Midjourney ou outro. Se o gerador não fizer fundo transparente, peça um fundo liso de uma cor só (magenta puro, como o prompt diz) e tire o fundo com um removedor (remove.bg, Photoroom ou `rembg`). Cada imagem custa de nada (no plano de assinatura) a uns US$ 0,20; são duas imagens.
- Uma referência ajuda muito: anexe a `public/img/ilha.webp` da demo (para manter o ângulo, o tamanho e a luz) e, se tiver, uma foto da casa, da loja ou do produto que vai em cima da ilha.

## Passo a passo

1. **A ilha** (`ilha.prompt.txt`): troque a lista do que fica em cima ("SUBJECT") pelo que é seu: a sua fachada, o seu galpão, a sua obra, o seu produto em miniatura. Mantenha o resto: maquete em miniatura, vista de três quartos de cima, a terra em cone por baixo com raízes e pedras penduradas, a luz da manhã vindo da direita, a ilha inteira no quadro com uma margem vazia em volta. Se o negócio não é de energia solar, tire os painéis.
2. **As nuvens** (`nuvens.prompt.txt`): só se quiser outra luz (um fim de tarde, por exemplo). As da demo servem para qualquer marca. A folha sai com sete nuvens; recorte cada uma num PNG (`nuvem-1.png` a `nuvem-7.png`, na ordem em que o site usa: 1 e 6 são os bancos largos, 3 o cúmulo alto, 4 o médio, 2 o pequeno, 7 o fragmento).
3. A luz das duas imagens tem de ser a mesma (sol da manhã pela direita): se a ilha nova vier com outra luz, ela parece colada no céu.

## Depois de gerar

Salve a ilha como `fonte/ilha.png` (e as nuvens como `fonte/nuvem-<n>.png`) na raiz do projeto e rode `node arquivos/fonte/camadas.mjs` (precisa do `sharp`: `npm install -D -E sharp@0.35.5`). Ele tira os pedacinhos soltos do recorte, desfaz a base de cada nuvem (para nenhuma terminar em linha reta quando as camadas sobem) e grava os WebP em `public/img/`, mostrando o `width` e o `height` de cada um. Ponha esses dois números no `<img>` da ilha (ou da nuvem) em `src/sections/hero.html`: a caixa da ilha toma a proporção deles. Se a ilha nova for mais alta ou mais larga que a da demo, ajuste o tamanho e o centro dela em `hero.css` (`.ilha`: `--ilha-w`, `left`, `top`; no celular, o bloco do fim do arquivo).

## Sem imagem nova

O site funciona com a casa da demo enquanto a sua não chega. Ela é uma casa térrea brasileira com dez painéis no telhado: serve como ilustração para energia solar residencial, e o texto do site pode ser todo seu desde já. Para outro negócio, avise a pessoa que a casa da demo continua aparecendo até a ilha nova ficar pronta.
