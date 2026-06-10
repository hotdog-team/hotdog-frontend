import axiosInstance from './axiosInstance'

export const getAddresses = async () => {
    const response = await axiosInstance.get('/api/members/addresses')
    return response.data
}

export const addAddress = async (addressData) => {
    const response = await axiosInstance.post(
        '/api/members/addresses',
        addressData,
    )

    return response.data
}
