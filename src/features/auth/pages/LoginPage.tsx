import { useState } from 'react'
import { Eye, MessageSquare, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'
import React from 'react'

const inputClass =
  'h-[61px] w-full rounded border border-[#c7ccd6] bg-white px-5 text-[21px] text-[#071431] outline-none placeholder:text-[#697283] focus:border-[#ff4b11] focus:ring-3 focus:ring-[#ff4b11]/15 max-sm:h-[54px] max-sm:text-[17px]'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value) {
  return emailPattern.test(value)
}

function ClearButton({ label, onClick }) {
  return (
    <button
      className="absolute top-1/2 right-[17px] inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-[#4b515d] hover:bg-[#f3f4f6]"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <X size={18} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}

function NaverLoginButton() {
  return (
    <button
      className="inline-flex h-14 w-full items-center justify-center gap-4 rounded-lg bg-[#03A94D] px-4 text-base font-bold text-white hover:bg-[#029744]"
      type="button"
    >
      <strong className="flex size-6 items-center justify-center text-[24px] leading-none font-extrabold" aria-hidden="true">
        N
      </strong>
      네이버 로그인
    </button>
  )
}

function KakaoLoginButton() {
  return (
    <button
      className="inline-flex h-14 w-full items-center justify-center gap-4 rounded-lg bg-[#FEE500] px-4 text-base font-bold text-[#191600] hover:bg-[#f4dc00]"
      type="button"
    >
      <MessageSquare className="size-6" fill="currentColor" strokeWidth={0} aria-hidden="true" />
      카카오 로그인
    </button>
  )
}

function GoogleLoginButton() {
  return (
    <button
      className="inline-flex h-14 min-w-11 w-full items-center justify-center gap-4 rounded-xl border border-[#F7F7F7] bg-white px-4 py-3.5 text-sm leading-[17px] font-semibold text-[#121212] shadow-[0_5px_35px_rgba(18,18,18,0.05)] hover:bg-[#fafafa]"
      type="button"
    >
      <svg className="size-5 shrink-0" viewBox="0 0 20 20" aria-hidden="true">
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
      구글로 로그인
    </button>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

  return (
    <main className="flex min-h-svh flex-col bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,250,247,0.94)_100%)] text-[#222633]">
      <header className="flex h-[82px] items-center border-b border-[#dfe3ea] px-[30px] max-sm:h-[68px] max-sm:px-[18px]">
        <AuthLogo className="h-9 max-sm:h-8" linkClassName="inline-flex items-center w-fit" to="/" />
      </header>

      <section
        className="mx-auto w-full max-w-[560px] flex-1 px-5 pt-12 pb-16 text-center max-sm:px-4 max-sm:pt-10 max-sm:pb-10"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="mt-0.5 mb-2 text-[42px] leading-[1.1] font-extrabold text-[#071431] max-sm:text-[34px]"
        >
          다시 오신 것을 환영합니다
        </h1>
        <p className="mb-[54px] text-[23px] leading-snug text-[#252938] max-sm:mb-8 max-sm:text-lg">
          임직원 전용 혜택을 확인하세요.
        </p>

        <form
          className="min-h-[820px] w-full border border-[#c7ccd6] bg-white px-[51px] py-[47px] text-left shadow-[0_1px_2px_rgba(7,20,49,0.04)] max-sm:min-h-0 max-sm:px-[22px] max-sm:pt-[30px] max-sm:pb-4"
          aria-describedby="login-form-description"
          onSubmit={(event) => event.preventDefault()}
        >
          <p id="login-form-description" className="sr-only">
            회사 이메일과 비밀번호는 필수 입력 항목입니다.
          </p>

          <div className="grid gap-2.5">
            <label className="text-[15px] font-extrabold text-[#071431] uppercase" htmlFor="login-email">
              회사 이메일
            </label>
            <span className="block relative">
              <input
                id="login-email"
                type="email"
                placeholder="이름@회사.com"
                autoComplete="email"
                className={`${inputClass} ${email ? 'pr-[58px]' : ''}`}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                aria-required="true"
                aria-invalid={isEmailInvalid}
                aria-describedby={isEmailInvalid ? 'login-form-description login-email-error' : 'login-form-description'}
              />
              {email && <ClearButton label="회사 이메일 지우기" onClick={() => setEmail('')} />}
            </span>
            {isEmailInvalid && (
              <p id="login-email-error" className="text-sm font-semibold text-[#bc210e]" role="alert">
                회사 이메일 형식이 올바르지 않습니다.
              </p>
            )}
          </div>

          <div className="mt-7 grid gap-2.5">
            <div className="flex gap-4 justify-between items-center">
              <label className="text-[15px] font-extrabold text-[#071431] uppercase" htmlFor="login-password">
                비밀번호
              </label>
              <Link className="text-[15px] font-extrabold text-[#bc210e] normal-case" to="/reset-password">
                비밀번호 찾기
              </Link>
            </div>
            <span className="block relative">
              <input
                id="login-password"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${inputClass} pr-[58px]`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                aria-required="true"
                aria-describedby="login-form-description"
              />
              <button
                className="absolute top-1/2 right-[17px] inline-flex -translate-y-1/2 items-center justify-center bg-transparent text-[#4b515d]"
                type="button"
                aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          </div>

          <label className="mt-8 flex items-center gap-[11px] text-lg leading-snug text-[#232733] max-sm:text-[15px]" htmlFor="login-remember">
            <input
              id="login-remember"
              className="m-0 size-[21px] accent-[#ff4b11]"
              type="checkbox"
              aria-describedby="login-remember-description"
            />
            <span>이 기기에서 로그인 상태 유지</span>
          </label>
          <p id="login-remember-description" className="sr-only">
            선택하면 현재 기기에서 로그인 상태를 유지합니다.
          </p>

          <button
            className="mt-[42px] inline-flex h-[60px] w-full items-center justify-center rounded bg-[#ff4b11] text-xl font-medium text-white hover:bg-[#e83f09] max-sm:h-[54px] max-sm:text-[17px]"
            type="submit"
          >
            로그인
          </button>

          <div className="my-10 grid grid-cols-[1fr_auto_1fr] items-center gap-[30px] max-sm:my-8 max-sm:gap-[15px]">
            <span className="h-px bg-[#c7ccd6]" aria-hidden="true"></span>
            <p className="m-0 text-[15px] font-extrabold text-[#071431] uppercase max-sm:whitespace-nowrap max-sm:text-xs">
              다른 계정으로 계속하기
            </p>
            <span className="h-px bg-[#c7ccd6]" aria-hidden="true"></span>
          </div>

          <div className="grid gap-5 justify-items-center">
            <NaverLoginButton />
            <KakaoLoginButton />
            <GoogleLoginButton />
          </div>

          <p className="mt-10 text-center text-lg text-[#2d3038] max-sm:mt-8 max-sm:text-[15px]">
            계정이 없으신가요?{' '}
            <Link className="font-extrabold text-[#071431]" to="/signup">
              회원가입
            </Link>
          </p>
        </form>

        <p className="mt-[50px] text-center text-[15px] font-bold text-[#8b9099]">
          인증된 임직원 전용 비공개 스토어
        </p>
      </section>

      <footer className="flex min-h-[166px] items-end justify-between gap-8 border-t border-[#dfe3ea] bg-[#f3f6fa] px-[30px] pt-[33px] pb-[31px] max-[900px]:flex-col max-[900px]:items-start max-sm:px-[18px] max-sm:py-7">
        <div>
          <AuthLogo className="mb-[13px] h-10 max-sm:h-8" />
          <p className="m-0 text-lg text-[#536984] max-sm:text-[15px]">
            © 2024 임직원 전용 스토어. 모든 권리 보유.
          </p>
        </div>
        <nav
          className="flex items-center gap-10 whitespace-nowrap text-[17px] text-[#405777] max-[900px]:flex-wrap max-[900px]:gap-x-6 max-[900px]:gap-y-4 max-[900px]:whitespace-normal"
          aria-label="푸터 링크"
        >
          <a href="#privacy">개인정보 처리방침</a>
          <a href="#terms">서비스 이용약관</a>
          <a href="#handbook">임직원 안내서</a>
          <a href="#security">보안 정책</a>
          <a href="#status">시스템 상태</a>
          <a href="#help">고객센터</a>
        </nav>
      </footer>
    </main>
  )
}

export default LoginPage
