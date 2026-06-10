import axiosInstance from './axiosInstance'

export const getCartItems = async () => {
    const response = await axiosInstance.get('/api/carts')
    return response.data
}

export const updateCartQuantity = async (cartId, quantity) => {
    const response = await axiosInstance.patch(`/api/carts/${cartId}`, {
        quantity,
    })
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
        data: {
            cartIds,
        },
    })

    return response.data
}