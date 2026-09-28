import type { Category } from '@/types'

/** Palabras con las que la gente describe cada problema, sin tildes */
const KEYWORDS: Record<string, string[]> = {
  plomeria: ['agua', 'cano', 'caneria', 'perdida', 'gotea', 'inodoro', 'bano', 'canilla', 'grifo', 'griferia', 'desague', 'destapar', 'termo', 'pileta', 'plomero'],
  electricidad: ['luz', 'enchufe', 'toma', 'corto', 'cable', 'ventilador', 'tablero', 'lampara', 'foco', 'electricista', 'llave termica'],
  aire: ['aire', 'split', 'frio', 'calor', 'acondicionado', 'climatizacion', 'gas'],
  pintura: ['pintar', 'pintura', 'pintor', 'pared', 'humedad', 'mancha', 'fachada', 'techo'],
  carpinteria: ['mueble', 'madera', 'puerta', 'placard', 'ropero', 'cajon', 'carpintero', 'mesa', 'estante'],
  cerrajeria: ['llave', 'cerradura', 'candado', 'trabada', 'cerrajero', 'cerre', 'olvide'],
  limpieza: ['limpiar', 'limpieza', 'sucio', 'alfombra', 'sillon', 'tapizado', 'vidrio', 'mudanza'],
  jardineria: ['pasto', 'cesped', 'jardin', 'poda', 'podar', 'arbol', 'planta', 'yuyo', 'jardinero'],
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

/** Devuelve la categoría que mejor coincide con la descripción, o null */
export function matchCategory(query: string, categories: Category[]): Category | null {
  const q = normalize(query)
  if (!q) return null

  let best: { category: Category; score: number } | null = null
  for (const category of categories) {
    const terms = [category.name, ...category.services, ...(KEYWORDS[category.id] ?? [])].map(normalize)
    const score = terms.reduce((sum, term) => sum + (q.includes(term) ? term.length : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { category, score }
  }
  return best?.category ?? null
}
