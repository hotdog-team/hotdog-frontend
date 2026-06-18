const STORAGE_KEY = 'recently-viewed-products'
const MAX_ITEMS = 20

export function getRecentlyViewedProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const items = JSON.parse(raw)
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function addRecentlyViewedProduct(product) {
  if (!product?.id) {
    return
  }

  const nextItem = {
    id: String(product.id),
    name: product.name ?? '이름 없는 상품',
    image: product.image ?? product.imageUrl ?? '',
    salePrice: product.salePrice ?? product.price ?? 0,
    originPrice: product.originPrice ?? product.price ?? 0,
    discountRate: product.discountRate ?? 0,
    viewedAt: Date.now(),
  }

  const items = getRecentlyViewedProducts().filter((item) => String(item.id) !== nextItem.id)
  items.unshift(nextItem)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
}

export function removeRecentlyViewedProduct(productId) {
  const items = getRecentlyViewedProducts().filter((item) => String(item.id) !== String(productId))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function clearRecentlyViewedProducts() {
  localStorage.removeItem(STORAGE_KEY)
}
