import axiosInstance from './axiosInstance'
import { BASE_URL } from './apiClient'

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.post('/api/images/upload', formData)

  const imageUrl = response.data?.imageUrl
  if (!imageUrl) {
    throw new Error('이미지 업로드 응답에 URL이 없습니다.')
  }

  return imageUrl
}

export function resolveImageUrl(url) {
  if (!url?.trim()) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}
