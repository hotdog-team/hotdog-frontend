import axiosInstance from './axiosInstance';

export const getProductReviews = async (productId, page = 0, size = 5) => {
  const response = await axiosInstance.get(`/api/products/${productId}/reviews?page=${page}&size=${size}`)
  return response.data
}

export const getReviewByOrderItem = async (orderItemId) => {
  const response = await axiosInstance.get(`/api/orders/items/${orderItemId}/reviews`)
  return response.data
}

export const createReview = async (orderItemId, { rating, content, imageUrl }) => {
  const response = await axiosInstance.post(`/api/orders/items/${orderItemId}/reviews`, {
    rating,
    content,
    imageUrl: imageUrl || null,
  })
  return response.data
}

export const updateReview = async (reviewId, { rating, content, imageUrl }) => {
  const response = await axiosInstance.patch(`/api/reviews/${reviewId}`, {
    rating,
    content,
    imageUrl: imageUrl || null,
  })
  return response.data
}

export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/api/reviews/${reviewId}`)
  return response.data
}
