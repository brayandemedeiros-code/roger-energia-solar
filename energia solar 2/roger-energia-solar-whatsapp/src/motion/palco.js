// Compõe as camadas a cada quadro: parallax do cursor + separação na saída pela rolagem. Só escreve transform/opacity,
// e só quando algo mudou. Cada .camada do hero.html diz no HTML:
//   data-prof    quanto se mexe com o cursor (0 = parada, 1 = a mais perto)
//   data-saida   quanto sobe na saída, em alturas da tela (a da frente sobe mais rápido)
//   data-escala  quanto cresce (+) ou encolhe (−) até o fim da saída
// O muro (data-camada="muro") tem conta própria: sobe de baixo da tela e cobre tudo no fim.
// Os números da saída (quando o texto some, quando a ilha some na névoa, quando o véu fecha) estão em SAIDA.

const RATO = { x: 26, y: 14 } // px de deslocamento da camada de profundidade 1

// [começo, fim] de cada passo, no progresso da saída (0 = hero parado, 1 = fim da rolagem do palco)
const SAIDA = {
  texto: [0.02, 0.3], // nome, parágrafo e botão sobem e somem
  textoSobe: 0.62, // quanto o texto sobe, em alturas da tela
  hud: [0, 0.22],
  sombra: [0.02, 0.3], // a sombra de nuvem atrás do texto
  ilha: [0.28, 0.58], // a ilha some na névoa antes de as nuvens a cobrirem por partes (sem pedaços soltos)
  veu: [0.5, 0.9], // o véu creme fecha a tela
  navFecho: 0.82, // a barra da nav fica tinta cheia (sobre o creme do fechamento)
  muro: [1.16, 1.62], // o muro começa 1,16 tela abaixo e sobe 1,62 tela até o fim
}

const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const suave = (a, b, v) => {
  const t = limitar((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export function criarPalco({ hero, palco, nav, reduzido }) {
  if (reduzido) return null

  const camadas = [...palco.querySelectorAll('.camada[data-camada]')]
    .filter((el) => el.dataset.camada !== 'muro')
    .map((el) => ({
      el,
      prof: Number(el.dataset.prof) || 0,
      saida: Number(el.dataset.saida) || 0,
      escala: Number(el.dataset.escala) || 0,
      ilha: el.dataset.camada === 'ilha',
    }))
  const muro = palco.querySelector('[data-camada="muro"]')
  const texto = palco.querySelector('.texto')
  const huds = palco.querySelectorAll('.hud')
  const veu = palco.querySelector('.veu')
  const sombra = palco.querySelector('.sombra')

  const alvo = { x: 0, y: 0 }
  const rato = { x: 0, y: 0 }
  let prog = 0
  let H = palco.clientHeight
  let ultimo = ''

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    alvo.x = (e.clientX / innerWidth) * 2 - 1
    alvo.y = (e.clientY / innerHeight) * 2 - 1
  })
  document.documentElement.addEventListener('pointerleave', () => {
    alvo.x = 0
    alvo.y = 0
  })
  addEventListener('resize', () => (H = palco.clientHeight))

  const alvoProg = () => {
    const curso = hero.offsetHeight - innerHeight
    return curso > 0 ? limitar(scrollY / curso) : 0
  }

  // pausa a deriva e a flutuação quando o hero sai da tela
  new IntersectionObserver(([e]) => palco.classList.toggle('palco--parado', !e.isIntersecting)).observe(palco)

  let antes = performance.now()
  function quadro(agora) {
    const dt = Math.min(0.05, (agora - antes) / 1000)
    antes = agora
    const kRato = 1 - Math.pow(1 - 0.055, dt * 60)
    const kProg = 1 - Math.pow(1 - 0.16, dt * 60)
    rato.x += (alvo.x - rato.x) * kRato
    rato.y += (alvo.y - rato.y) * kRato
    const p = alvoProg()
    prog += (p - prog) * kProg
    if (Math.abs(p - prog) < 0.0004) prog = p

    const chave = `${rato.x.toFixed(4)}|${rato.y.toFixed(4)}|${prog.toFixed(4)}|${H}`
    if (chave !== ultimo) {
      ultimo = chave
      desenhar()
    }
    requestAnimationFrame(quadro)
  }

  function desenhar() {
    for (const c of camadas) {
      const tx = -rato.x * RATO.x * c.prof
      const ty = -rato.y * RATO.y * c.prof - prog * c.saida * H
      const s = 1 + prog * c.escala
      c.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
      if (c.ilha) c.el.style.opacity = (1 - suave(...SAIDA.ilha, prog)).toFixed(3)
    }

    // muro de nuvens: as mais perto da câmera, sobem de baixo da tela desde o começo da saída e cobrem tudo no fim
    // (a câmera desce para dentro da nuvem)
    if (muro) {
      const muroY = (SAIDA.muro[0] - SAIDA.muro[1] * prog) * H
      muro.style.transform = `translate3d(${(-rato.x * RATO.x * 1.3).toFixed(2)}px, ${muroY.toFixed(2)}px, 0)`
    }

    if (veu) veu.style.opacity = suave(...SAIDA.veu, prog).toFixed(3)
    if (sombra) sombra.style.opacity = (1 - suave(...SAIDA.sombra, prog)).toFixed(3)
    if (texto) {
      texto.style.transform = `translate3d(0, ${(-prog * SAIDA.textoSobe * H).toFixed(2)}px, 0)`
      texto.style.opacity = (1 - suave(...SAIDA.texto, prog)).toFixed(3)
      texto.style.visibility = prog > SAIDA.texto[1] + 0.02 ? 'hidden' : ''
    }
    const hudOp = (1 - suave(...SAIDA.hud, prog)).toFixed(3)
    huds.forEach((h) => (h.style.opacity = hudOp))
    nav?.classList.toggle('nav--fecho', prog > SAIDA.navFecho)
  }

  requestAnimationFrame(quadro)
  return { progresso: () => prog }
}
