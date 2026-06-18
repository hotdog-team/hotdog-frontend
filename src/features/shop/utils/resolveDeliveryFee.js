export function resolveDeliveryFee(items = []) {
  return items.reduce((sum, item) => sum + Number(item.deliveryFee ?? 0), 0)
}
