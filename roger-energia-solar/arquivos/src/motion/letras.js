// O nome gigante: o texto de .marca__linha vira uma letra por <span class="marca__letra"> (a entrada sobe uma a uma).
// O que já é elemento (o asterisco-sol) fica como está. Espaço vira espaço que não some.
export function letras(linha) {
  if (!linha) return []
  for (const no of [...linha.childNodes]) {
    if (no.nodeType !== Node.TEXT_NODE) continue
    const texto = no.textContent.replace(/\s+/g, ' ').trim()
    const frag = document.createDocumentFragment()
    for (const l of texto) {
      const s = document.createElement('span')
      s.className = 'marca__letra'
      s.textContent = l === ' ' ? ' ' : l
      frag.append(s)
    }
    no.replaceWith(frag)
  }
  return linha.querySelectorAll('.marca__letra')
}

// O nome cabe na largura: o tamanho padrão (--t-marca) vale enquanto o nome cabe na coluna dele; um nome mais comprido
// ("Sol do Cerrado") diminui até caber, em vez de vazar por baixo do texto da direita. Medido depois das fontes e a
// cada mudança de tamanho da tela.
export function cabeNome(marca) {
  const linha = marca?.querySelector('.marca__linha')
  if (!linha) return () => {}
  const medir = () => {
    marca.style.fontSize = ''
    const livre = linha.clientWidth
    const usado = linha.scrollWidth
    if (usado > livre + 1) marca.style.fontSize = `${(parseFloat(getComputedStyle(marca).fontSize) * livre * 0.99) / usado}px`
  }
  medir()
  let espera
  addEventListener('resize', () => {
    clearTimeout(espera)
    espera = setTimeout(medir, 120)
  })
  return medir
}
