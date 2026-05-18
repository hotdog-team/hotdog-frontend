function NaverIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="white">
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z" />
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg className="size-7 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor">
      <path d="M12 3C7.03 3 3 6.58 3 11c0 2.39 1.18 4.52 3.02 5.95L5 21l4.45-2.22c.82.12 1.66.18 2.55.18 4.97 0 9-3.58 9-8s-4.03-8-9-8z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="size-6 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.71-.06-1.4-.18-2.05H10v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.97-.9 6.62-2.42l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H1.05v2.59A10 10 0 0 0 10 20Z"
      />
      <path
        fill="#FBBC05"
        d="M4.4 11.91a6.01 6.01 0 0 1 0-3.82V5.5H1.05a10 10 0 0 0 0 9l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M10 3.97c1.47 0 2.8.5 3.84 1.5l2.86-2.87A9.61 9.61 0 0 0 10 0a10 10 0 0 0-8.95 5.5L4.4 8.09C5.19 5.73 7.4 3.97 10 3.97Z"
      />
    </svg>
  )
}

export const socialLoginConfig = {
  naver: {
    label: '네이버 로그인',
    ariaLabel: '네이버로 로그인',
  },
  kakao: {
    label: '카카오 로그인',
    ariaLabel: '카카오로 로그인',
  },
  google: {
    label: '구글로 로그인',
    ariaLabel: '구글로 로그인',
  },
}

export const socialLoginIcons = {
  naver: NaverIcon,
  kakao: KakaoIcon,
  google: GoogleIcon,
}

export const socialLoginStyles = {
  naver: 'rounded-lg bg-[#03A94D] text-white hover:bg-[#029744]',
  kakao: 'rounded-lg bg-[#FFCD00] text-[#191600] hover:bg-[#FFC100]',
  google: 'rounded-xl bg-white text-[#121212] hover:bg-[#fafafa] shadow-social',
}
