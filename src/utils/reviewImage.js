import { uploadImage } from '../api/imageApi.js'

export async function resolveReviewImageUrl({ file, imageUrl }) {
  if (file) {
    return uploadImage(file)
  }

  return imageUrl || null
}
