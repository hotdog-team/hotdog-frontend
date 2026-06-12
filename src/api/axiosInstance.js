import axios from 'axios';
import { BASE_URL } from './apiClient';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      toast.error('로그인이 만료되었습니다. 다시 로그인해 주세요.');

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;