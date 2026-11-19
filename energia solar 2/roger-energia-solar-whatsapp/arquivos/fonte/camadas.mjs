// Converte as camadas recortadas de fonte/ (PNG com fundo transparente) para os WebP de public/img/. Rode da raiz do
// projeto:   node arquivos/fonte/camadas.mjs [nome...]
// O nome do arquivo diz o que é:
//   ilha (ou ilha-<nome>)   o objeto do hero: tira os pedacinhos soltos do recorte (alfa sujo em volta)
//   nuvem-<n>               uma nuvem: tira os pedacinhos soltos e desfaz a base (o alfa cai suave seguindo o contorno de
//                           baixo, para nenhuma base terminar em linha reta quando as camadas sobem)
// A largura máxima é 1600 px (a ilha da demo tem 1446). No fim, o script mostra o width e o height de cada arquivo: são
// os números do <img> no src/sections/hero.html. Precisa do sharp: npm install -D -E sharp@0.35.5
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const carrega = (dir) => { try { return createRequire(join(dir, 'package.json'))('sharp'); } catch { return null; } };
const raizGit = () => { try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
const sharp = carrega(process.cwd()) ?? carrega(raizGit() ?? process.cwd());
if (!sharp) throw new Error('falta o sharp: npm install -D -E sharp@0.35.5');

const pedidos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const arquivos = existsSync('fonte') ? readdirSync('fonte').filter((f) => /^(ilha|nuvem)[\w-]*\.png$/i.test(f)) : [];
if (!arquivos.length) throw new Error('nada em fonte/: salve as camadas como fonte/ilha.png ou fonte/nuvem-<n>.png, na raiz do projeto');
mkdirSync('public/img', { recursive: true });

// zera os grupos de pixels visíveis (alfa > 8) menores que `minimo`: os pedacinhos soltos do recorte
function semPedacinhos(a, w, h, minimo) {
  const rotulo = new Int32Array(w * h).fill(-1);
  const pilha = new Int32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (a[i] <= 8 || rotulo[i] !== -1) continue;
    let topo = 0;
    const grupo = [];
    pilha[topo++] = i;
    rotulo[i] = i;
    while (topo) {
      const p = pilha[--topo];
      grupo.push(p);
      const x = p % w;
      for (const q of [p - w, p + w, x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1]) {
        if (q < 0 || q >= w * h || a[q] <= 8 || rotulo[q] !== -1) continue;
        rotulo[q] = i;
        pilha[topo++] = q;
      }
    }
    if (grupo.length < minimo) for (const p of grupo) a[p] = 0;
  }
}

// desfaz a base da nuvem: em cada coluna, o alfa cai até zero nos últimos `frac` da altura acima do contorno de baixo
function desfazBase(a, w, h, frac) {
  const f = Math.max(8, Math.round(h * frac));
  const base = new Float64Array(w).fill(-1);
  for (let x = 0; x < w; x++) for (let y = h - 1; y >= 0; y--) if (a[y * w + x] > 96) { base[x] = y; break; }
  // contorno suavizado entre as colunas (sem degraus): média gaussiana de raio ~3 × 18 px
  const s = 18;
  const peso = Array.from({ length: 3 * s * 2 + 1 }, (_, k) => Math.exp(-((k - 3 * s) ** 2) / (2 * s * s)));
  const suave = new Float64Array(w);
  for (let x = 0; x < w; x++) {
    let soma = 0, tot = 0;
    for (let k = -3 * s; k <= 3 * s; k++) {
      const c = x + k;
      if (c < 0 || c >= w || base[c] < 0) continue;
      soma += base[c] * peso[k + 3 * s];
      tot += peso[k + 3 * s];
    }
    suave[x] = tot ? soma / tot : -1;
  }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const t = Math.min(1, Math.max(0, (suave[x] - y) / f));
      a[y * w + x] = Math.round(a[y * w + x] * t * t * (3 - 2 * t));
    }
}

for (const arq of arquivos) {
  const nome = arq.replace(/\.png$/i, '');
  if (pedidos.length && !pedidos.includes(nome)) continue;
  const { data, info } = await sharp(`fonte/${arq}`).ensureAlpha().resize({ width: 1600, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const a = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = data[i * 4 + 3];
  const nuvem = nome.startsWith('nuvem');
  semPedacinhos(a, w, h, nuvem ? 400 : 120);
  if (nuvem) {
    desfazBase(a, w, h, 0.3);
    semPedacinhos(a, w, h, 400);
  }
  for (let i = 0; i < w * h; i++) data[i * 4 + 3] = a[i];
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 86, alphaQuality: 90, effort: 6 }).toFile(`public/img/${nome}.webp`);
  console.log(`public/img/${nome}.webp  width="${w}" height="${h}"`);
}
