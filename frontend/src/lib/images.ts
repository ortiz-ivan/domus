/** Fotos por reseña: la demo guarda todo en localStorage, que tiene unos 5 MB */
export const MAX_REVIEW_PHOTOS = 3

/** Lado mayor en píxeles: suficiente para verla ampliada en el perfil, liviana para guardarla */
const MAX_SIDE = 800
const QUALITY = 0.7

/**
 * Achica y recomprime una foto en el navegador y la devuelve como data URL (WebP, o JPEG si
 * el navegador no codifica WebP). Una foto de celular de 3–5 MB queda en unos 50–100 KB.
 */
export async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen')
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('El navegador no puede procesar imágenes')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const webp = canvas.toDataURL('image/webp', QUALITY)
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', QUALITY)
}
