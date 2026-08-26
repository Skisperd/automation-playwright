import { test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLockupActions'

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.landing.goto()
    await app.navbar.orderLockupLink()
    await app.orderLockup.validatePageLoaded()
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

    await app.orderLockup.searchOrder(order.number)

    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
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

    await app.orderLockup.searchOrder(order.number)

    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
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

    await app.orderLockup.searchOrder(order.number)

    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido ignorando espaços e caixa do código', async ({ app }) => {

    const orderCode = 'VLO-LNFEYE'

    await app.orderLockup.searchOrder(`  ${orderCode.toLowerCase()}  `)

    await app.orderLockup.validateOrderNumber(orderCode)
    await app.orderLockup.validateStatusBadge('APROVADO')
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const orderCode = generateOrderCode()

    await app.orderLockup.searchOrder(orderCode)

    await app.orderLockup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {

    const orderCode = 'XYZ-999-INVALIDO'

    await app.orderLockup.searchOrder(orderCode)

    await app.orderLockup.validateOrderNotFound()
  })

  test('deve limpar o resultado anterior ao consultar um pedido inexistente', async ({ app }) => {

    const orderCode = 'VLO-LNFEYE'

    await app.orderLockup.searchOrder(orderCode)
    await app.orderLockup.validateOrderNumber(orderCode)

    await app.orderLockup.searchOrder(generateOrderCode())

    await app.orderLockup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado enquanto o código não é informado', async ({ app }) => {

    await app.orderLockup.validateSearchButtonDisabled()
    await app.orderLockup.fillOrderCode('   ')
    await app.orderLockup.validateSearchButtonDisabled()
    await app.orderLockup.fillOrderCode('VLO-LNFEYE')

    await app.orderLockup.validateSearchButtonEnabled()
  })

})
