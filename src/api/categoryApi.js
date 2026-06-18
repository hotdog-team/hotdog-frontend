import { apiFetch } from './apiClient.js'

export async function fetchCategories() {
  return apiFetch('/api/categories')
}
