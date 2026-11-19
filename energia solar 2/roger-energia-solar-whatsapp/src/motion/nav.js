// Nav some ao descer e volta ao subir (e sempre aparece no topo da página e ao receber foco pelo teclado).
// Assim ela nunca fica por cima da ilha enquanto as camadas se separam na saída. Sem o hero na página, a barra já
// nasce tinta cheia (a versão para fundo claro).
export function criarNav(nav) {
  if (!nav) return
  if (!document.querySelector('.hero')) nav.classList.add('nav--fecho')
  let antes = scrollY
  let pedido = false

  function ler() {
    pedido = false
    const y = scrollY
    if (y < 40 || y < antes - 4) nav.classList.remove('nav--oculta')
    else if (y > antes + 4) nav.classList.add('nav--oculta')
    if (Math.abs(y - antes) > 4) antes = y
  }

  addEventListener(
    'scroll',
    () => {
      if (!pedido) {
        pedido = true
        requestAnimationFrame(ler)
      }
    },
    { passive: true }
  )

  nav.addEventListener('focusin', () => nav.classList.remove('nav--oculta'))
}
