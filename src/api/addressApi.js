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

export const updateAddress = async (addressId, addressData) => {
    const response = await axiosInstance.patch(
        `/api/members/addresses/${addressId}`,
        addressData,
    )

    return response.data
}

export const deleteAddress = async (addressId) => {
    await axiosInstance.delete(`/api/members/addresses/${addressId}`)
}

export const setDefaultAddress = async (addressId) => {
    const response = await axiosInstance.patch(
        `/api/members/addresses/${addressId}/default`,
    )

    return response.data
}
