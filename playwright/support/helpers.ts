/**
 * Gera um número de pedido aleatório no mesmo formato usado pela aplicação.
 * Exemplo: VLO-LNFEYE
 */
export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'VLO-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
