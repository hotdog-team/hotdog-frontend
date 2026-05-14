const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function fetchPopularSearchKeywords() {
  const response = await fetch(`${BASE_URL}/api/search/popular`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API ${response.status} ${response.statusText}`)
  }

  const responseBody = await response.json()

  return Array.isArray(responseBody)
    ? responseBody
        .filter((keyword) => typeof keyword === 'string' && keyword.trim())
        .map((keyword) => keyword.trim())
        .slice(0, 10)
    : []
}
