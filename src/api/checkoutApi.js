import axiosInstance from './axiosInstance'

export const getCheckoutFromCart = async (cartItemIds) => {
    const response = await axiosInstance.post(
        '/api/orders/checkout/cart',
        {
            cartIds: cartItemIds,
        },
    )

    return response.data
}