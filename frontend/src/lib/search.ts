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

/** Palabras que no dicen nada del problema y, como prefijo, coincidirían con cualquier cosa */
const STOPWORDS = new Set(['del', 'los', 'las', 'que', 'una', 'uno', 'por', 'con', 'para', 'mas', 'muy', 'hay', 'tengo', 'necesito', 'quiero'])

/**
 * Categorías que coinciden con lo escrito, de la más a la menos parecida (filtro en vivo).
 * Como matchCategory, entiende descripciones ("gotea la canilla"), y además palabras a medio
 * escribir ("plom"), porque filtra mientras la persona tipea.
 */
export function rankCategories(query: string, categories: Category[]): Category[] {
  const q = normalize(query)
  if (!q) return categories
  const partials = q.split(/[^a-z0-9ñ]+/).filter((w) => w.length >= 3 && !STOPWORDS.has(w))

  return categories
    .map((category) => {
      const terms = [category.name, category.description, ...category.services, ...(KEYWORDS[category.id] ?? [])].map(normalize)
      const words = terms.flatMap((t) => t.split(/[^a-z0-9ñ]+/))
      const whole = terms.reduce((sum, term) => sum + (q.includes(term) ? term.length : 0), 0)
      const prefix = partials.reduce((sum, w) => sum + (words.some((word) => word.startsWith(w)) ? w.length : 0), 0)
      return { category, score: whole * 2 + prefix }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.category)
}
