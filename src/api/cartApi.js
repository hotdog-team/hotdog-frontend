import axiosInstance from './axiosInstance'
import {sendBehaviorLog} from "./behaviorLogApi.js";

export const getCartItems = async () => {
    const response = await axiosInstance.get('/api/carts')
    return response.data
}

export const addCartItem = async (productId, quantity = 1) => {
    const response = await axiosInstance.post('/api/carts', {
        productId: Number(productId),
        quantity,
    })
    try {
        await sendBehaviorLog({ productId: productId, actionType: 'CART' });
    } catch {}
    return response.data
}

export const addCartItems = async (items) => {
    const response = await axiosInstance.post('/api/carts/bulk', { items })

    return response.data
}

export const updateCartQuantity = async (cartId, quantity) => {
    const response = await axiosInstance.patch(`/api/carts/${cartId}`, { quantity })
    return response.data
}

export const deleteCartItem = async (cartId, productId) => {
    const response = await axiosInstance.delete(`/api/carts/${cartId}`)
    try {
        await sendBehaviorLog({ productId: Number(productId), actionType: 'CANCEL_CART' })
    } catch {}
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
