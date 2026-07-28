import { test, expect } from '@playwright/test';
import { generateOrderNumber } from '../support/helpers';
import { OrderLockupPage } from '../support/pages/OrderLockupPage';
import { approvedOrder, orderDetailsSnapshot, orders } from '../support/data/orders';

test.describe('Consulta de pedido', () => {

  let orderLockupPage: OrderLockupPage;

  test.beforeEach(async ({ page }) => {
    orderLockupPage = new OrderLockupPage(page);

    await orderLockupPage.openFromLanding();
    await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible();
  });

  for (const order of orders) {

    test(`Deve consultar um pedido ${order.scenario}`, async ({ page }) => {

      // Act
      await orderLockupPage.searchOrder(order.code);

      // Assert
      await expect(page.locator('#root')).toMatchAriaSnapshot(orderDetailsSnapshot(order));

      await expect(orderLockupPage.statusBadge).toHaveText(order.status);

      for (const badgeClass of order.badge.classes) {
        await expect(orderLockupPage.statusBadge).toHaveClass(new RegExp(`\\b${badgeClass}\\b`));
      }

      await expect(orderLockupPage.statusIcon).toHaveClass(new RegExp(`\\b${order.badge.icon}\\b`));
    });

  }

  test('Deve consultar um pedido ignorando espaços e caixa do código', async () => {

    // Test Data
    const code = `  ${approvedOrder.code.toLowerCase()}  `;

    // Act
    await orderLockupPage.searchOrder(code);

    // Assert
    await expect(orderLockupPage.orderCode).toHaveText(approvedOrder.code);
    await expect(orderLockupPage.statusBadge).toHaveText(approvedOrder.status);
  });

  test('Deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    // Test Data
    const code = generateOrderNumber();

    // Act
    await orderLockupPage.searchOrder(code);

    // Assert
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
    `);

    await expect(orderLockupPage.statusBadge).toBeHidden();
  });

  test('Deve limpar o resultado anterior ao consultar um pedido inexistente', async () => {

    // Arrange
    await orderLockupPage.searchOrder(approvedOrder.code);
    await expect(orderLockupPage.orderCode).toHaveText(approvedOrder.code);

    // Act
    await orderLockupPage.searchOrder(generateOrderNumber());

    // Assert
    await expect(orderLockupPage.notFoundMessage).toBeVisible();
    await expect(orderLockupPage.orderCode).toBeHidden();
  });

  test('Deve manter o botão de busca desabilitado enquanto o código não é informado', async () => {

    // Assert
    await expect(orderLockupPage.searchButton).toBeDisabled();

    // Act
    await orderLockupPage.orderCodeInput.fill('   ');

    // Assert
    await expect(orderLockupPage.searchButton).toBeDisabled();

    // Act
    await orderLockupPage.orderCodeInput.fill(approvedOrder.code);

    // Assert
    await expect(orderLockupPage.searchButton).toBeEnabled();
  });

});
