import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {useAuthStore} from "../../../store/useAuthStore.js";

export default function SocialSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      useAuthStore.setState({ accessToken, refreshToken, isAuthenticated: true, });

      navigate('/', { replace: true });
    } else {
      alert('인증 토큰을 찾을 수 없습니다. 다시 로그인해 주세요.');
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-page">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ink">로그인 처리 중</h2>
        <p className="mt-2 text-body">잠시만 기다려 주세요...</p>
      </div>
    </div>
  );
}