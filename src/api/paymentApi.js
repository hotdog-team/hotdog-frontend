import axiosInstance from './axiosInstance'

export const confirmPayment = async (paymentData) => {
    const response = await axiosInstance.post(
        '/api/payments/confirm',
        paymentData
    )

    return response.data
}