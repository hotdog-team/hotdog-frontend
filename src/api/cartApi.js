import axiosInstance from './axiosInstance'
import { removeHiddenId, removeHiddenIds } from '../utils/dislikeHiddenStorage.js'

export const getCartItems = async () => {
    const response = await axiosInstance.get('/api/carts')
    return response.data
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
