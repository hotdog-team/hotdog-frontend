import axiosInstance from './axiosInstance'
import { removeHiddenIds } from '../utils/dislikeHiddenStorage.js'

export const createOrder = async (orderData) => {
    const response = await axiosInstance.post('/api/orders', orderData)
    const productIds = orderData?.orderItems
        ?.map((item) => item.productId)
        .filter((id) => id != null)

    removeHiddenIds(productIds)

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
    )

    return response.data
}

export const requestOrderReturn = async (orderId, returnData) => {
    const response = await axiosInstance.post(
        `/api/orders/${orderId}/return-request`,
        returnData
    )

    return response.data
}

export const requestReturnItems = async (
    orderId,
    returnData,
) => {
    const response = await axiosInstance.post(
        `/api/orders/${orderId}/return-items`,
        returnData,
    )

    return response.data
}