import { test, expect } from '@playwright/test';
import { generateOrderNumber } from '../support/helpers';

test('Deve consultar um pedido com sucesso', async ({ page }) => {

  // Test Data
  const order = 'VLO-LNFEYE';

  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert

  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..'); //Sobe para o elemento pai (a div que agrupa ambos)

  await expect(containerPedido).toContainText(order, { timeout: 10_000 });

  await expect(page.getByText('APROVADO')).toBeVisible();

});

test('Deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

  // Test Data
  const order = generateOrderNumber();

  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
  `);

});
