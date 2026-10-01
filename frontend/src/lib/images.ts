/** Fotos por reseña: la demo guarda todo en localStorage, que tiene unos 5 MB */
export const MAX_REVIEW_PHOTOS = 3

/** Lado mayor en píxeles: suficiente para verla ampliada en el perfil, liviana para guardarla */
const MAX_SIDE = 800
/** Lado de la foto de perfil: el avatar más grande mide 80 px, con margen para pantallas densas */
const AVATAR_SIDE = 320
const QUALITY = 0.7

/**
 * Achica y recomprime una foto en el navegador y la devuelve como data URL (WebP, o JPEG si
 * el navegador no codifica WebP). Una foto de celular de 3–5 MB queda en unos 50–100 KB.
 */
export async function compressImage(file: File): Promise<string> {
  const bitmap = await readImage(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  return encode(bitmap, 0, 0, bitmap.width, bitmap.height, Math.round(bitmap.width * scale), Math.round(bitmap.height * scale))
}

/** Recorta el centro de la foto en un cuadrado y lo achica para usarlo como foto de perfil (~10–20 KB) */
export async function compressAvatar(file: File): Promise<string> {
  const bitmap = await readImage(file)
  const crop = Math.min(bitmap.width, bitmap.height)
  const side = Math.min(AVATAR_SIDE, crop)
  return encode(bitmap, (bitmap.width - crop) / 2, (bitmap.height - crop) / 2, crop, crop, side, side)
}

async function readImage(file: File): Promise<ImageBitmap> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen')
  return createImageBitmap(file)
}

/** Dibuja la región (sx, sy, sw, sh) de la imagen en un lienzo de width × height y la codifica */
function encode(bitmap: ImageBitmap, sx: number, sy: number, sw: number, sh: number, width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('El navegador no puede procesar imágenes')
  }
  context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height)
  bitmap.close()

  const webp = canvas.toDataURL('image/webp', QUALITY)
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', QUALITY)
}
