import axiosInstance from './axiosInstance';

export const getProductReviews = async (productId, page = 0, size = 5) => {
    const response = await axiosInstance.get(`/api/products/${productId}/reviews?page=${page}&size=${size}`)
    return response.data
}

export const updateReview = async (reviewId, { rating, content }) => {
    const response = await axiosInstance.patch(`/api/reviews/${reviewId}`, { rating, content })
    return response.data
}

export const deleteReview = async (reviewId) => {
    const response = await axiosInstance.delete(`/api/reviews/${reviewId}`)
    return response.data
}
