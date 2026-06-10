import axiosInstance from './axiosInstance'

export const getAddresses = async () => {
    const response = await axiosInstance.get('/api/members/addresses')
    return response.data
}