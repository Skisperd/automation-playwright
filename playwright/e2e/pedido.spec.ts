import { test, expect } from '@playwright/test';
import { generateOrderNumber } from '../support/helpers';

test.describe('Consulta de pedido', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  });

  test('Deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-LNFEYE',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Tiago Oliveira',
        email: 'tiago.qa@gmail.com'
      },
      payment: 'À Vista'
    };

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

  });

  test('Deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-0J7T9E',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'TIAGO DE OLIVEIRA',
        email: 'felipe.reprovado@apple.com'
      },
      payment: 'À Vista'
    };

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

  });

  test('Deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    // Test Data
    const order = generateOrderNumber();

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

});
