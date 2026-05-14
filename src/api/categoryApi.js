const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/api/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API ${response.status} ${response.statusText}`)
  }

  return response.json()
}
