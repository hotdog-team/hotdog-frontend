import { create } from 'zustand';
import { login as loginApi } from '../api/authApi';

export const useAuthStore = create((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,

    login: async ({ email, password }) => {
        const { accessToken, refreshToken } = await loginApi({email, password});
        //localStorage에 세팅
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        //전역 set
        set({ accessToken, refreshToken, isAuthenticated: true });
    },
    logout: () => {
        //localStorage에서 accessToken과 refreshToken을 제거한다
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    },
    hydrate: () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        set({
            accessToken,
            refreshToken,
            isAuthenticated: !!accessToken,
        });
    },
}));

