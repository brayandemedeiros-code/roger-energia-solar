// Grão de filme: um ladrilho de ruído cinza gerado uma vez em canvas.
// O CSS (.grao) cobre a página toda com ele em soft-light e troca a posição em saltos.
export function criarGrao(tamanho = 180) {
  if (!document.querySelector(".grao")) return
  const c = document.createElement('canvas')
  c.width = c.height = tamanho
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(tamanho, tamanho)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    // soma de dois sorteios: grão mais concentrado no cinza médio, como filme
    const v = 128 + (Math.random() + Math.random() - 1) * 120
    d[i] = d[i + 1] = d[i + 2] = v
    d[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  document.documentElement.style.setProperty('--grao', `url(${c.toDataURL('image/png')})`)
}
