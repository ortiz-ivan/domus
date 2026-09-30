import { expect, test } from '@playwright/test'

/**
 * El criterio de finalización de la demo (docs/domus.md): del pedido del servicio al pago,
 * con el cliente y el profesional en pestañas distintas que se avisan en tiempo real.
 * Ana (cliente) le pide un trabajo a Carlos Benítez, el plomero con el que entra el rol profesional.
 */
test('el cliente contrata, el profesional trabaja y el cliente califica y paga', async ({ context }) => {
  const descripcion = 'Gotea la cañería debajo de la pileta de la cocina desde ayer.'

  // Cada pestaña con su rol: la sesión vive en sessionStorage y los datos se comparten por localStorage
  const pro = await context.newPage()
  await pro.goto('/ingresar?como=profesional')
  await pro.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: /^Solicitudes/ }).click()
  await expect(pro.getByRole('heading', { name: 'Solicitudes nuevas' })).toBeVisible()

  const cliente = await context.newPage()
  await cliente.goto('/ingresar')
  await cliente.getByRole('button', { name: /Cliente/ }).click()
  await expect(cliente).toHaveURL('/cliente')

  // 1-2. Categoría y profesional
  await cliente.goto('/cliente/categorias')
  await cliente.getByRole('link', { name: /Plomería/ }).click()
  await cliente.getByRole('link', { name: /Carlos Benítez/ }).first().click()
  await cliente.getByRole('link', { name: 'Solicitar servicio' }).first().click()

  // 3. Solicitud en cinco pasos
  const continuar = cliente.getByRole('button', { name: 'Continuar' })
  const servicio = cliente.getByRole('radio').first()
  const titulo = (await servicio.locator('xpath=..').locator('span.font-semibold').textContent())!.trim()
  await servicio.check()
  await continuar.click()
  await cliente.getByLabel('Describí el problema').fill(descripcion)
  await continuar.click()
  await cliente.getByRole('radio', { name: /Esta semana/ }).check()
  await cliente.getByRole('radio', { name: /Tarde/ }).check()
  await continuar.click()
  await cliente.getByLabel('Dirección').fill('Av. España 1234, casi Brasil')
  await continuar.click()
  await expect(cliente.getByText(descripcion)).toBeVisible()
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
  await pro.getByRole('button', { name: 'Aceptar trabajo' }).click()

  // 5-6. Seguimiento y finalización
  await pro.getByRole('button', { name: 'Iniciar trabajo' }).click()
  await pro.getByRole('button', { name: 'Marcar como terminado' }).click()
  await pro.getByRole('dialog').getByRole('button', { name: 'Sí, terminé' }).click()
  await expect(pro.getByRole('heading', { name: 'Esperando confirmación' })).toBeVisible()

  // 7. Confirmación: el seguimiento del cliente se actualiza solo y ofrece continuar
  await cliente.getByRole('main').getByRole('link', { name: 'Continuar' }).click()
  await expect(cliente.getByRole('heading', { name: 'Trabajo terminado' })).toBeVisible()
  await cliente.getByRole('button', { name: 'Sí, quedó bien' }).click()

  // 8. Calificación
  await cliente.getByRole('radio', { name: /5 estrellas/ }).check({ force: true })
  await cliente.getByLabel('Comentario (opcional)').fill('Muy prolijo y puntual.')
  await cliente.getByRole('button', { name: 'Enviar calificación' }).click()

  // 9. Pago simulado
  await expect(cliente.getByRole('heading', { name: 'Resumen y pago' })).toBeVisible()
  await cliente.getByRole('button', { name: /^Pagar/ }).click()
  await expect(cliente.getByRole('heading', { name: '¡Pago realizado!' })).toBeVisible()

  // El profesional ve el trabajo cobrado
  await expect(pro.getByRole('heading', { name: 'Cobrado' })).toBeVisible()
})
