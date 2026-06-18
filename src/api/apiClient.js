import axios from 'axios';
import { toast } from 'react-toastify';

// Vite 빌드 시점에 .env.production 혹은 .env.development가 적용
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${BASE_URL}/auth/reissue`, {}, { withCredentials: true });
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.error('로그인이 만료되었습니다.');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getAccessToken() {
  try { return localStorage.getItem('accessToken'); } catch { return null; }
}

export async function apiFetch(path, options = {}) {
  const { auth = true, accessToken, parseJson = true, ...fetchOptions } = options;
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = accessToken ?? getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const response = await fetch(url, { ...fetchOptions, headers });

  if (!response.ok) {
    let message = `API ${response.status}`;
    try { const err = await response.json(); message = err.message ?? message; } catch {}
    throw new Error(message);
  }

  return parseJson && response.status !== 204 ? await response.json() : null;
}