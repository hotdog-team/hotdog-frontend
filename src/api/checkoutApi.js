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

export const getCheckoutDirect = async (productId, quantity) => {
  const response = await axiosInstance.post(
      '/api/orders/checkout/direct',
      {
          productId:productId,
          quantity: quantity,
      }
  )
    return response.data
}