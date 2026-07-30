import { test } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { Navbar } from '../support/components/Navbar'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'

test.describe('Consulta de Pedido', () => {
  
  let orderLockupPage: OrderLockupPage
  
  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new Navbar(page).orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    orderLockupPage.validatePageLoaded
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {
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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido ignorando espaços e caixa do código', async ({ page }) => {

    const orderCode = 'VLO-LNFEYE'

    await orderLockupPage.searchOrder(`  ${orderCode.toLowerCase()}  `)

    await orderLockupPage.validateOrderNumber(orderCode)
    await orderLockupPage.validateStatusBadge('APROVADO')
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const orderCode = generateOrderCode()

    await orderLockupPage.searchOrder(orderCode)

    await orderLockupPage.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {

    const orderCode = 'XYZ-999-INVALIDO'

    await orderLockupPage.searchOrder(orderCode)

    await orderLockupPage.validateOrderNotFound()
  })

  test('deve limpar o resultado anterior ao consultar um pedido inexistente', async ({ page }) => {

    const orderCode = 'VLO-LNFEYE'

    await orderLockupPage.searchOrder(orderCode)
    await orderLockupPage.validateOrderNumber(orderCode)

    await orderLockupPage.searchOrder(generateOrderCode())

    await orderLockupPage.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado enquanto o código não é informado', async ({ page }) => {

    await orderLockupPage.validateSearchButtonDisabled()
    await orderLockupPage.fillOrderCode('   ')
    await orderLockupPage.validateSearchButtonDisabled()
    await orderLockupPage.fillOrderCode('VLO-LNFEYE')

    await orderLockupPage.validateSearchButtonEnabled()
  })

})
