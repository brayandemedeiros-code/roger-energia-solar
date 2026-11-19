// Nuvens em camadas: cada uma é um <img> do HTML (src/sections/hero.html), com a posição nos atributos (data-tela,
// data-x, data-y, data-largura, data-espelhada, data-opacidade; ver o comentário no topo do hero.html). Aqui cada <img>
// ganha uma caixa .nuvem, que deriva para a direita em loop. A deriva é animação CSS (roda no compositor, sem JS por
// quadro): vai de logo antes da borda esquerda até logo depois da direita, então a volta nunca aparece na tela.
// Cada camada (data-nuvens) diz a velocidade (data-vel, unidades por segundo) e o desfoque (data-blur).
// Quantas nuvens houver, em qualquer camada, funciona; camada sem nuvens fica vazia.

const FOLGA = 90 // px além da borda: cobre o parallax do cursor

// unidade de tamanho e de velocidade de cada tela
const UNIDADE = {
  computador: (L, A) => Math.min(L, A * 1.9) / 100,
  celular: (L, A) => Math.max(L, A * 0.62) / 100,
}

export const telaAtual = () => (innerWidth <= 760 ? 'celular' : 'computador')

export function criarNuvens(palco) {
  const itens = []
  for (const camada of palco.querySelectorAll('[data-nuvens]')) {
    const vel = Number(camada.dataset.vel) || 0.5
    const blur = Number(camada.dataset.blur) || 0
    for (const img of camada.querySelectorAll(':scope > img')) {
      const el = document.createElement('div')
      el.className = img.hasAttribute('data-espelhada') ? 'nuvem nuvem--flip' : 'nuvem'
      if (img.dataset.opacidade) el.style.opacity = img.dataset.opacidade
      img.before(el)
      el.append(img)
      img.decoding = 'async'
      img.draggable = false
      const d = img.dataset
      itens.push({
        el,
        img,
        tela: d.tela || 'computador',
        x: Number(d.x) || 0,
        y: Number(d.y) || 0.5,
        w: Number(d.largura) || 20,
        // proporção do arquivo: width/height do <img> (ou o tamanho natural, se faltarem)
        proporcao: () => (Number(img.getAttribute('height')) || img.naturalHeight || 1) / (Number(img.getAttribute('width')) || img.naturalWidth || 1),
        vel,
        blur,
      })
    }
  }

  let tela = null

  function posicionar() {
    tela = telaAtual()
    const L = palco.clientWidth
    const A = palco.clientHeight
    const u = UNIDADE[tela](L, A)
    for (const n of itens) {
      n.el.hidden = n.tela !== tela
      if (n.el.hidden) continue
      const w = n.w * u
      const h = w * n.proporcao()
      const inicio = -w - FOLGA
      const percurso = L + w + 2 * FOLGA
      const dur = percurso / (n.vel * u)
      const fase = ((((n.x * L - inicio) / percurso) % 1) + 1) % 1
      const s = n.el.style
      s.width = `${w}px`
      s.height = `${h}px`
      s.top = `${n.y * A - h / 2}px`
      s.setProperty('--de', `${inicio}px`)
      s.setProperty('--ate', `${inicio + percurso}px`)
      s.setProperty('--x', `${n.x * L}px`)
      s.setProperty('--dur', `${dur.toFixed(2)}s`)
      s.setProperty('--atraso', `${(-fase * dur).toFixed(2)}s`)
      s.setProperty('--blur', `${((n.blur * u) / 14).toFixed(2)}px`)
    }
  }

  posicionar()

  let espera
  addEventListener('resize', () => {
    clearTimeout(espera)
    espera = setTimeout(posicionar, 120)
  })

  // as imagens que a entrada espera antes de começar (só as da tela atual)
  return { imagens: () => itens.filter((n) => n.tela === tela).map((n) => n.img) }
}
