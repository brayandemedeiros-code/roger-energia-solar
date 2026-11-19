// Ordem de inicialização. O CSS não entra por aqui: ele vem por <link> no index.html (src/styles/site.css), senão no
// dev do Vite a página aparece crua por um instante a cada recarregamento. O HTML vem das seções (src/sections/) e os
// módulos leem o que está nele; cada um confere se a peça dele existe.
//   1. o grão, o nome em letras (e do tamanho que cabe), a ilha (máscara e proporção) e as nuvens no lugar
//   2. o HUD e a entrada armada (as peças escondidas no ponto de partida); solta a trava da primeira pintura (.armada)
//   3. o palco (cursor e saída) e a nav que some ao descer
//   4. a entrada toca quando a ilha, as nuvens e as fontes estão prontas (no máximo 3 s de espera)
import { gsap } from 'gsap'
import { criarGrao } from './motion/grao.js'
import { letras, cabeNome } from './motion/letras.js'
import { ilha } from './motion/ilha.js'
import { criarNuvens } from './motion/nuvens.js'
import { criarHud } from './motion/hud.js'
import { criarEntrada } from './motion/entrada.js'
import { criarPalco } from './motion/palco.js'
import { criarNav } from './motion/nav.js'

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches
const hero = document.querySelector('.hero')
const palco = hero?.querySelector('.palco')
const nav = document.querySelector('.nav')

criarGrao()

let imagens = []
if (palco) {
  letras(palco.querySelector('.marca__linha'))
  const medeNome = cabeNome(palco.querySelector('.marca'))
  document.fonts.ready.then(medeNome)
  const img = ilha(palco)
  const nuvens = criarNuvens(palco)
  imagens = [img, ...nuvens.imagens()].filter(Boolean)
  const hud = palco.querySelector('[data-hud]') ? criarHud(palco, gsap) : null
  const entrada = criarEntrada({ gsap, palco, hud, reduzido })
  criarPalco({ hero, palco, nav, reduzido })

  // a entrada só começa com a ilha e as nuvens decodificadas e as fontes prontas (ou depois de 3 s, o que vier antes)
  const prontas = Promise.all(imagens.map((i) => i.decode().catch(() => {})))
  const limite = new Promise((r) => setTimeout(r, 3000))
  Promise.race([Promise.all([prontas, document.fonts.ready]), limite]).then(() => {
    medeNome()
    entrada.tocar()
  })
}
document.documentElement.classList.add('armada')
criarNav(nav)

// links internos: rolagem suave nativa
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (ev) => {
    let alvo = null
    try {
      alvo = document.querySelector(a.getAttribute('href'))
    } catch {}
    if (!alvo) return
    ev.preventDefault()
    alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth' })
  })
)
