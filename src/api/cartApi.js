import axiosInstance from './axiosInstance'
import { fetchProductDetail } from './productApi.js'
import { removeHiddenId, removeHiddenIds } from '../utils/dislikeHiddenStorage.js'

function normalizeCartItem(item) {
  return {
    ...item,
    cartId: Number(item.cartId ?? item.id),
    productId: Number(item.productId),
    price: Number(item.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    discountRate: Number(item.discountRate ?? 0),
    deliveryFee: item.deliveryFee != null ? Number(item.deliveryFee) : null,
  }
}

async function enrichDeliveryFees(items) {
  if (items.length === 0) return items

  const productIds = [...new Set(items.map((item) => item.productId).filter(Boolean))]
  const feeMap = {}

  await Promise.all(
    productIds.map(async (productId) => {
      try {
        const product = await fetchProductDetail(productId)
        feeMap[productId] = Number(product.deliveryFee ?? 0)
      } catch {
        feeMap[productId] = 0
      }
    }),
  )

  return items.map((item) => ({
    ...item,
    deliveryFee: Math.max(
      Number(item.deliveryFee ?? 0),
      feeMap[item.productId] ?? 0,
    ),
  }))
}

export const getCartItems = async () => {
  const response = await axiosInstance.get('/api/carts')
  const raw = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? []

  const normalized = raw.map(normalizeCartItem)
  return enrichDeliveryFees(normalized)
}

export const addCartItem = async (productId, quantity = 1) => {
  const response = await axiosInstance.post('/api/carts', {
    productId: Number(productId),
    quantity,
  })
  removeHiddenId(productId)
  return response.data
}

export const addCartItems = async (items) => {
  const response = await axiosInstance.post('/api/carts/bulk', { items })
  removeHiddenIds(items.map((item) => item.productId))

  return response.data
}

export const updateCartQuantity = async (cartId, quantity) => {
  const response = await axiosInstance.patch(`/api/carts/${cartId}`, { quantity })
  return response.data
}

export const deleteCartItem = async (cartId) => {
  const response = await axiosInstance.delete(`/api/carts/${cartId}`)
  return response.data
}

export const clearCartItems = async () => {
  const response = await axiosInstance.delete('/api/carts')
  return response.data
}

export const deleteCartItems = async (cartIds) => {
  const response = await axiosInstance.delete('/api/carts/bulk', {
    data: { cartIds },
  })
  return response.data
}
