import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLookupActions'

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-LNFEYE',
      status: 'APROVADO',
      color: 'Glacier Blue',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Tiago Oliveira',
        email: 'tiago.qa@gmail.com'
      },
      payment: 'À Vista',
      total: 'R$ 40.000,00'
    }

    await app.orderLookup.searchOrder(order.number)

    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-0J7T9E',
      status: 'REPROVADO',
      color: 'Midnight Black',
      interior: 'cream',
      wheels: 'sport Wheels',
      customer: {
        name: 'TIAGO DE OLIVEIRA',
        email: 'felipe.reprovado@apple.com'
      },
      payment: 'À Vista',
      total: 'R$ 52.500,00'
    }

    await app.orderLookup.searchOrder(order.number)

    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-SGOZZO',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Nicolas James',
        email: 'james@apple.com'
      },
      payment: 'À Vista',
      total: 'R$ 40.000,00'
    }

    await app.orderLookup.searchOrder(order.number)

    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido ignorando espaços e caixa do código', async ({ app, page }) => {

    const orderCode = 'VLO-LNFEYE'

    await app.orderLookup.searchOrder(`  ${orderCode.toLowerCase()}  `)

    await expect(page.getByTestId('order-result-id')).toHaveText(orderCode)
    await app.orderLookup.validateStatusBadge('APROVADO')
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const orderCode = generateOrderCode()

    await app.orderLookup.searchOrder(orderCode)

    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {

    const orderCode = 'XYZ-999-INVALIDO'

    await app.orderLookup.searchOrder(orderCode)

    await app.orderLookup.validateOrderNotFound()
  })

  test('deve limpar o resultado anterior ao consultar um pedido inexistente', async ({ app }) => {

    await app.orderLookup.searchOrder('VLO-LNFEYE')
    await app.orderLookup.validateStatusBadge('APROVADO')

    await app.orderLookup.searchOrder(generateOrderCode())

    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('   ')
    await expect(button).toBeDisabled()
  })

})
