// 전역 API Client — BASE_URL, JWT 부착, 공통 fetch
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function getAccessToken() {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const {
    auth = true,
    accessToken,
    parseJson = true,
    ...fetchOptions
  } = options

  const headers = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    const token = accessToken ?? getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const response = await fetch(url, { ...fetchOptions, headers })

  if (!response.ok) {
    let message = `API ${response.status} ${response.statusText}`;
    try {
      const err = await response.json();
      message = err.detail ?? err.message ?? message;
    } catch { }
    throw new Error(message);
  }

  if (!parseJson || response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

