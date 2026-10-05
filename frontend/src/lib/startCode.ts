/** Cantidad de dígitos del código que el cliente le dicta al profesional para iniciar el trabajo */
export const START_CODE_LENGTH = 4

const cryptoRandom = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32

/** Código numérico con ceros a la izquierda ("0427") */
export function newStartCode(random: () => number = cryptoRandom): string {
  return String(Math.floor(random() * 10 ** START_CODE_LENGTH)).padStart(START_CODE_LENGTH, '0')
}
