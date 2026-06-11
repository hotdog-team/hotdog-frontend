import axiosInstance from './axiosInstance'

export const createOrder = async (orderData) => {
    const response = await axiosInstance.post('/api/orders', orderData)

    return response.data
}

export const getOrderDetail = async (orderId) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}`)

    return response.data
}

export const cancelOrderItems = async (
    orderId,
    orderItemIds
) => {
    const response = await axiosInstance.post(
        `/api/orders/${orderId}/cancel-items`,
        {
            orderItemIds,
        }
    );

    return response.data;
};