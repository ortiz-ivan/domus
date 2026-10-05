import { expect, test } from '@playwright/test'

/** PNG de 4×4 px (dorado Domus): alcanza para probar la carga y compresión de fotos en un navegador real */
const PHOTO = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGPY0eUBRwzEcQCHkhihLBFBwwAAAABJRU5ErkJggg==',
  'base64',
)

/**
 * El criterio de finalización de la demo (docs/domus.md): del pedido del servicio al pago,
 * con el cliente y el profesional en pestañas distintas que se avisan en tiempo real.
 * María (cliente) le pide un trabajo a Carlos Benítez, el plomero con el que entra el rol profesional.
 */
test('el cliente contrata, el profesional trabaja y el cliente califica y paga', async ({ context }) => {
  const descripcion = 'Gotea la cañería debajo de la pileta de la cocina desde ayer.'

  // Cada pestaña con su rol: la sesión vive en sessionStorage y los datos se comparten por localStorage
  const pro = await context.newPage()
  await pro.goto('/ingresar?como=profesional')
  await pro.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: /^Solicitudes/ }).click()
  await expect(pro.getByRole('heading', { name: 'Solicitudes nuevas' })).toBeVisible()
  // La pestaña dice qué rol es y cuántos pendientes tiene (las solicitudes precargadas)
  await expect(pro).toHaveTitle(/^\(\d+\) Solicitudes nuevas · Profesional · Domus$/)

  const cliente = await context.newPage()
  await cliente.goto('/ingresar')
  await cliente.getByRole('button', { name: /Cliente/ }).click()
  await expect(cliente).toHaveURL('/cliente')

  // 1-2. Categoría y profesional
  await cliente.goto('/cliente/categorias')
  await cliente.getByRole('link', { name: /Plomería/ }).click()
  await cliente.getByRole('link', { name: /Carlos Benítez/ }).first().click()
  // Perfil: tiempo de respuesta y precios estimados por trabajo
  await expect(cliente.getByText('Responde en', { exact: true })).toBeVisible()
  await expect(cliente.getByRole('heading', { name: 'Precios estimados' })).toBeVisible()
  await cliente.getByRole('link', { name: 'Solicitar servicio' }).first().click()

  // 3. Solicitud en cinco pasos
  const continuar = cliente.getByRole('button', { name: 'Continuar' })
  const servicio = cliente.getByRole('radio').first()
  const titulo = (await servicio.locator('xpath=..').locator('span.font-semibold').textContent())!.trim()
  await servicio.check()
  await continuar.click()
  await cliente.getByLabel('Describí el problema').fill(descripcion)
  await continuar.click()
  // "Lo necesito ya": es para ahora, así que no se elige fecha ni franja horaria
  await cliente.getByRole('radio', { name: /Lo necesito ya/ }).check()
  await expect(cliente.getByRole('radio', { name: /Tarde/ })).toHaveCount(0)
  await continuar.click()
  // La dirección guardada de María ya viene precargada
  await expect(cliente.getByLabel('Dirección')).toHaveValue('Av. España 1234, casi Brasil')
  // La ciudad se elige en el selector propio, nombrado por la etiqueta visible del campo
  await cliente.getByRole('combobox', { name: 'Ciudad' }).click()
  await cliente.getByRole('option', { name: 'Luque' }).click()
  await continuar.click()
  await expect(cliente.getByText(descripcion)).toBeVisible()
  await expect(cliente.getByText('Av. España 1234, casi Brasil, Luque')).toBeVisible()
  await expect(cliente.getByText('Presupuesto estimado')).toBeVisible()
  await expect(cliente.getByText('Ahora, lo antes posible')).toBeVisible()
  await cliente.getByRole('button', { name: 'Enviar solicitud' }).click()

  await expect(cliente).toHaveURL(/\/cliente\/solicitudes\/r-/)
  await expect(cliente.getByRole('heading', { name: titulo, level: 1 })).toBeVisible()
  const requestId = cliente.url().split('/').pop()!

  // 4. Recepción: la solicitud aparece sola en la pestaña del profesional, sin recargar
  // (la demo ya trae otras pendientes: se busca la recién creada por su id)
  const nueva = pro.getByRole('link', { name: 'Ver detalle' }).and(pro.locator(`[href="/profesional/solicitudes/${requestId}"]`))
  await expect(nueva).toBeVisible()
  await nueva.click()
  await expect(pro.getByText(descripcion)).toBeVisible()
  await expect(pro.getByText(/el cliente vio un presupuesto estimado/)).toBeVisible()
  // Es urgente: al aceptar, el profesional sale en ese momento hacia el domicilio
  await expect(pro.getByText('Urgente: lo necesita ya')).toBeVisible()
  await pro.getByRole('button', { name: 'Aceptar y salir ahora' }).click()

  // 5-6. Seguimiento y finalización
  // El cliente lo ve en camino, en el mapa, con los minutos que faltan
  await expect(cliente.getByRole('heading', { name: 'Carlos está en camino' })).toBeVisible()
  await expect(cliente.getByRole('img', { name: /Mapa con el recorrido de Carlos Benítez/ })).toBeVisible()
  await pro.getByRole('button', { name: 'Avisar que llegué' }).click()
  await expect(cliente.getByRole('heading', { name: 'Carlos llegó a tu domicilio' })).toBeVisible()

  // El profesional inicia con el código que el cliente ve en su seguimiento
  const codigo = (await cliente.getByTestId('start-code').textContent())!.trim()
  await pro.getByRole('button', { name: 'Iniciar trabajo' }).click()
  await pro.getByLabel('Código de inicio').fill(codigo)
  await pro.getByRole('dialog').getByRole('button', { name: 'Iniciar' }).click()
  await pro.getByRole('button', { name: 'Marcar como terminado' }).click()
  await pro.getByRole('dialog').getByRole('button', { name: 'Sí, terminé' }).click()
  await expect(pro.getByRole('heading', { name: 'Esperando confirmación' })).toBeVisible()

  // 7. Confirmación: el seguimiento del cliente se actualiza solo y ofrece continuar
  await cliente.getByRole('main').getByRole('link', { name: 'Confirmar trabajo' }).click()
  await expect(cliente.getByRole('heading', { name: 'Trabajo terminado' })).toBeVisible()
  await cliente.getByRole('button', { name: 'Sí, quedó bien' }).click()

  // 8. Calificación
  await cliente.getByRole('radio', { name: /5 estrellas/ }).check({ force: true })
  await cliente.getByLabel('Comentario (opcional)').fill('Muy prolijo y puntual.')
  await cliente.getByLabel('Agregar fotos del trabajo').setInputFiles({ name: 'trabajo.png', mimeType: 'image/png', buffer: PHOTO })
  await expect(cliente.getByRole('img', { name: 'Foto 1 que vas a subir' })).toHaveAttribute('src', /^data:image\/(webp|jpeg)/)
  await cliente.getByRole('button', { name: 'Enviar calificación' }).click()

  // 9. Pago simulado
  await expect(cliente.getByRole('heading', { name: 'Resumen y pago' })).toBeVisible()
  await cliente.getByRole('button', { name: /^Pagar/ }).click()
  await expect(cliente.getByRole('heading', { name: '¡Pago realizado!' })).toBeVisible()

  // El profesional ve el trabajo cobrado
  await expect(pro.getByRole('heading', { name: 'Cobrado' })).toBeVisible()

  // La reseña con su foto aparece primera en el perfil público de Carlos
  await cliente.goto('/profesionales/p-1')
  await expect(cliente.getByText('Muy prolijo y puntual.', { exact: true })).toBeVisible()
  await cliente.getByRole('button', { name: 'Foto 1 del trabajo, ampliar' }).first().click()
  await expect(cliente.getByRole('dialog')).toBeVisible()
})

/** Pedido con fecha: el calendario propio (no el del navegador) no deja elegir hoy y se maneja con teclado */
test('el cliente elige fecha y franja en el calendario de la demo', async ({ page }) => {
  await page.goto('/ingresar?como=cliente')
  await page.goto('/cliente/solicitudes/nueva?profesional=p-1')
  const continuar = page.getByRole('button', { name: 'Continuar' })
  await page.getByRole('radio').first().check()
  await continuar.click()
  await page.getByLabel('Describí el problema').fill('Se tapó la cañería del lavadero y no desagota.')
  await continuar.click()

  await page.getByRole('radio', { name: /Elegir una fecha/ }).check()
  // Sin fecha no avanza, y el foco va al calendario
  await page.getByRole('radio', { name: /Tarde/ }).check()
  await continuar.click()
  await expect(page.getByText('Elegí la fecha.')).toBeVisible()

  const fecha = page.getByRole('button', { name: 'Fecha' })
  await expect(fecha).toBeFocused()
  await fecha.click()
  const calendario = page.getByRole('dialog')
  await expect(calendario).toBeVisible()
  // Hoy no se puede: es para "Lo necesito ya" (el último día del mes, hoy ni aparece: abre en el mes de mañana)
  await expect(calendario.locator('[aria-current="date"]:not([disabled])')).toHaveCount(0)
  // Teclado: abre en mañana; flecha derecha = pasado mañana; Enter elige
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(calendario).toBeHidden()
  await expect(fecha).not.toHaveText(/Elegí una fecha/)

  await continuar.click()
  await continuar.click()
  await expect(page.getByRole('heading', { name: 'Revisá tu solicitud' })).toBeVisible()
  await expect(page.getByText(/· Tarde \(13 a 18 h\)/)).toBeVisible()
})
