import { create } from 'zustand';
import { login as loginApi } from '../api/authApi';

export const useAuthStore = create((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,

    login: async ({ email, password }) => {
        const { accessToken, refreshToken, email: userEmail, name } = await loginApi({email, password});
        //localStorage에 세팅
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify({ email: userEmail, name }));

        //전역 set
        set({ accessToken, refreshToken, user: { email: userEmail, name }, isAuthenticated: true });

    },

    setUser: (userData) => set({ user: userData }),

    logout: () => {
        //localStorage에서 accessToken과 refreshToken을 제거한다
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
    },
    hydrate: () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');
        set({
            accessToken,
            refreshToken,
            isAuthenticated: !!accessToken,
            user: storedUser ? JSON.parse(storedUser) : null,
        });
    },
}));