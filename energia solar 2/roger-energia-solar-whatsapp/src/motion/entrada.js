// Entrada em camadas: céu, nuvens de trás, a ilha subindo, nuvens da frente, o nome letra a letra por máscara, o texto
// linha a linha, a nav e o HUD contando. Anima só os .camada__in e o que está dentro deles; o palco.js cuida das .camada
// (cursor e saída), então os dois nunca brigam.
// Cada peça é uma linha da tabela ENTRADA: [seletor, estado de partida, estado de chegada, quando começa (s)].
// Peça que não existe no HTML é pulada: tirar uma camada, a dica ou o botão não pede mudança aqui. Uma camada nova
// entra com uma linha nova (copie a de uma vizinha).

const camada = (nome) => `[data-camada="${nome}"] > .camada__in`

const ENTRADA = [
  [camada('ceu'), {}, { autoAlpha: 1, duration: 1.4, ease: 'power2.inOut' }, 0],
  [camada('fundo'), { y: 40 }, { autoAlpha: 1, y: 0, duration: 2.2 }, 0.3],
  [camada('horizonte'), { y: 70 }, { autoAlpha: 1, y: 0, duration: 2.2 }, 0.45],
  // a ilha sobe 20% da altura da tela e cresce de 0,94 a 1
  [camada('ilha'), { y: (A) => A * 0.2, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 2.8, ease: 'power3.out' }, 0.6],
  [camada('frente'), { y: 130 }, { autoAlpha: 1, y: 0, duration: 2.4 }, 0.8],
  ['.sombra-in', {}, { autoAlpha: 1, duration: 1.6, ease: 'power1.out' }, 0.9],
  // o texto sobe de dentro da própria linha (máscara); escondido até a vez dele, senão a sombra do texto vaza da máscara
  ['.marca__letra', { yPercent: 115, visibility: 'hidden' }, { yPercent: 0, duration: 1.4, stagger: 0.065 }, 1.15],
  ['.marca__sol', { scale: 0, rotate: -140 }, { scale: 1, rotate: 0, duration: 1.6 }, 1.55],
  ['.linha > span', { yPercent: 115, visibility: 'hidden' }, { yPercent: 0, duration: 1.2, stagger: 0.09 }, 1.4],
  ['.chamada__botao', { y: 18 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.7],
  ['.nav__in', { y: -16 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 1.3],
  ['.hud p', {}, { autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: 'power1.out' }, 1.3],
  ['.dica', {}, { autoAlpha: 0.85, duration: 1.2, ease: 'power1.out' }, 2.3],
]
const HUD_CONTA = { em: 1.3, dura: 1.9 } // a contagem do HUD: quando começa e quanto dura (s)

export function criarEntrada({ gsap, palco, hud, reduzido }) {
  if (reduzido) {
    hud?.pronto()
    return { tocar() {} }
  }

  const A = () => palco.clientHeight
  const pecas = ENTRADA.map(([sel, de, para, em]) => {
    const alvos = [...document.querySelectorAll(sel)].filter((el) => palco.contains(el) || el.closest('.nav'))
    return { alvos, de, para, em }
  }).filter((p) => p.alvos.length)

  // estado inicial já no primeiro quadro: tela de névoa (quem chega com autoAlpha começa invisível)
  for (const { alvos, de, para } of pecas) {
    const ini = { ...de }
    for (const k in ini) if (typeof ini[k] === 'function') ini[k] = ini[k](A())
    if ('autoAlpha' in para) ini.autoAlpha = 0
    gsap.set(alvos, ini)
  }
  hud?.zerar()

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
  for (const { alvos, de, para, em } of pecas) {
    const ini = { ...de }
    for (const k in ini) if (typeof ini[k] === 'function') { const f = ini[k]; ini[k] = () => f(A()) }
    if ('autoAlpha' in para) ini.autoAlpha = 0
    const oculto = ini.visibility === 'hidden'
    delete ini.visibility
    tl.fromTo(alvos, ini, { ...para }, em)
    if (oculto) tl.set(alvos, { visibility: 'visible', stagger: para.stagger ?? 0 }, em)
  }
  if (hud) tl.add(() => hud.contar(HUD_CONTA.dura), HUD_CONTA.em)

  return { tocar: () => tl.play(), linha: tl }
}
