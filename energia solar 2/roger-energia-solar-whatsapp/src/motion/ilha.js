// A ilha: a camada de perspectiva aérea (.ilha__ar) usa a própria imagem como máscara, e a caixa toma a proporção do
// arquivo (width/height do <img>). Trocar a ilha é trocar só o <img> do hero.html (e o preload do index.html).
export function ilha(palco) {
  const img = palco.querySelector('.ilha__img')
  const caixa = palco.querySelector('.ilha')
  if (!img || !caixa) return null
  const w = Number(img.getAttribute('width'))
  const h = Number(img.getAttribute('height'))
  if (w && h) caixa.style.aspectRatio = `${w} / ${h}`
  caixa.style.setProperty('--ilha-mascara', `url("${img.currentSrc || img.src}")`)
  return img
}
