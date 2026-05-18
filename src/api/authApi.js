import { BASE_URL } from './apiClient.js';

export async function login({ email, password }) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    //res.ok의 경우
    if (!res.ok) {
        let message = '로그인에 실패했습니다.';
        //에러 메시지를 try-catch로 처리
        try {
            const err = await res.json();
            //에러 메시지 detail을 받아서 사용
            message = err.detail ?? err.message ?? message;
        } catch {
        }
        throw new Error(message);
    }
    return res.json();
    
}

export function startSocialLogin(provider) {
    window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`
}

export async function logout(accessToken) {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        //서버에서 실패하여도 프런트에서는 로그인 처리함
    }
}