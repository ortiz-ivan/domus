// Mensajes con los que cada navegador rechaza un import() cuyo archivo ya no existe
const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i, // Chrome, Edge
  /error loading dynamically imported module/i, // Firefox
  /Importing a module script failed/i, // Safari
  /Unable to preload CSS/i, // Vite, al precargar el CSS de la sección
]

/** Si el error viene de no poder descargar el código de una sección (típico después de un deploy) */
export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(error.message))
}
