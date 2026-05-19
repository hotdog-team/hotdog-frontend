import { apiFetch } from './apiClient.js'

export async function fetchPopularSearchKeywords() {
  const responseBody = await apiFetch('/api/search/popular')

  return Array.isArray(responseBody)
    ? responseBody
        .filter((keyword) => typeof keyword === 'string' && keyword.trim())
        .map((keyword) => keyword.trim())
        .slice(0, 10)
    : []
}
