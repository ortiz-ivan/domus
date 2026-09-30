import { expect, test } from '@playwright/test'

test.describe('listas del administrador por tandas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ingresar?como=admin')
    await expect(page).toHaveURL('/admin')
  })

  test('usuarios: "Ver más" agrega una tanda y los filtros vuelven a la primera', async ({ page }) => {
    await page.goto('/admin/usuarios')
    const resumen = page.getByText(/^Mostrando \d+ de \d+ usuarios$/)
    await expect(resumen).toHaveText(/^Mostrando 15 de \d+ usuarios$/)
    const total = Number((await resumen.textContent())!.match(/de (\d+)/)![1])

    await page.getByRole('button', { name: 'Ver 15 más' }).click()
    await expect(resumen).toHaveText(`Mostrando 30 de ${total} usuarios`)
    // Tabla de escritorio: 30 filas más el encabezado
    await expect(page.getByRole('table').getByRole('row')).toHaveCount(31)

    // Con un filtro que entra en una tanda no hace falta el pie
    const filtros = page.getByRole('group', { name: 'Filtrar por rol' })
    await filtros.getByRole('button', { name: /Clientes/ }).click()
    await expect(resumen).toBeHidden()

    // Al volver a "Todos" arranca otra vez desde la primera tanda
    await filtros.getByRole('button', { name: /Todos/ }).click()
    await expect(resumen).toHaveText(`Mostrando 15 de ${total} usuarios`)
  })

  test('profesionales, solicitudes y pagos también se ven por tandas', async ({ page }) => {
    for (const [path, noun] of [
      ['/admin/profesionales', 'profesionales'],
      ['/admin/solicitudes', 'solicitudes'],
      ['/admin/finanzas', 'pagos'],
    ] as const) {
      await page.goto(path)
      await expect(page.getByText(new RegExp(`^Mostrando 15 de \\d+ ${noun}$`))).toBeVisible()
      await expect(page.getByRole('button', { name: /^Ver \d+ más$/ })).toBeVisible()
    }
  })
})
