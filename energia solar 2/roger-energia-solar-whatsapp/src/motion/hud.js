// HUD dos cantos (src/sections/hero.html). Cada número é um <span data-hud> e o valor escrito no HTML é o da cena:
//   data-hud="hora"   um horário (10:40): na entrada conta a partir de data-de (05:40) e depois anda em tempo real
//   data-hud="agora"  a geração de agora (4,1): conta de data-de (ou 0) e depois oscila um pouco em volta do valor
//   data-hud="hoje"   o total do dia (9,8): conta de data-de (ou 0) e depois soma o que "agora" está gerando
// As casas decimais saem do texto (4,1 → uma casa; 120 → nenhuma), com vírgula. Peça que não existe é pulada.

const minutos = (t) => {
  const [h, m] = String(t).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}
const hh = (min) => {
  const m = ((Math.floor(min) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
const numero = (t) => Number(String(t).trim().replace(/\./g, '').replace(',', '.')) || 0
const casas = (t) => (String(t).split(',')[1] ?? '').trim().length
const formata = (n, c) => n.toFixed(c).replace('.', ',')

export function criarHud(raiz, gsap) {
  const pega = (nome) => {
    const el = raiz.querySelector(`[data-hud="${nome}"]`)
    if (!el) return null
    const texto = el.textContent.trim()
    return { el, texto, de: el.dataset.de }
  }
  const hora = pega('hora')
  const agora = pega('agora')
  const hoje = pega('hoje')

  const alvo = {
    min: hora ? minutos(hora.texto) : 0,
    kw: agora ? numero(agora.texto) : 0,
    kwh: hoje ? numero(hoje.texto) : 0,
  }
  const inicio = {
    min: hora ? minutos(hora.de ?? hora.texto) : 0,
    kw: agora ? numero(agora.de ?? 0) : 0,
    kwh: hoje ? numero(hoje.de ?? 0) : 0,
  }
  const v = { ...alvo }

  const escreve = (p, t) => p && p.el.textContent !== t && (p.el.textContent = t)
  const escrever = () => {
    if (hora) escreve(hora, hh(v.min))
    if (agora) escreve(agora, formata(v.kw, casas(agora.texto)))
    if (hoje) escreve(hoje, formata(v.kwh, casas(hoje.texto)))
  }

  function vivo() {
    const t0 = performance.now()
    const kwh0 = v.kwh
    let soma = 0
    let antes = t0
    setInterval(() => {
      const t = performance.now()
      const s = (t - t0) / 1000
      v.min = alvo.min + s / 60
      // oscilação de ~3% em volta da geração da cena
      v.kw = alvo.kw * (1 + (0.06 * Math.sin(s / 17) + 0.05 * Math.sin(s / 5.3)) / 4.1)
      soma += (v.kw * (t - antes)) / 3600000
      antes = t
      v.kwh = kwh0 + soma
      escrever()
    }, 1000)
  }

  return {
    // movimento reduzido: sem contagem, já com os valores
    pronto() {
      escrever()
      vivo()
    },
    zerar() {
      Object.assign(v, inicio)
      escrever()
    },
    contar(duracao = 1.8) {
      gsap.fromTo(v, { ...inicio }, { ...alvo, duration: duracao, ease: 'power2.out', onUpdate: escrever, onComplete: () => (escrever(), vivo()) })
    },
  }
}
