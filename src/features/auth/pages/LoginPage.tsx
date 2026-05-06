import { Eye, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'

const inputClass =
  'h-[61px] w-full rounded border border-[#c7ccd6] bg-white px-5 text-[21px] text-[#071431] outline-none placeholder:text-[#697283] focus:border-[#ff4b11] focus:ring-3 focus:ring-[#ff4b11]/15 max-sm:h-[54px] max-sm:text-[17px]'

function NaverLoginButton() {
  return (
    <button
      className="inline-flex h-14 w-full max-w-[368px] items-center justify-center gap-4 rounded-lg bg-[#03A94D] px-4 text-base font-bold text-white hover:bg-[#029744]"
      type="button"
    >
      <strong className="flex size-6 items-center justify-center text-[24px] leading-none font-extrabold">
        N
      </strong>
      네이버 로그인
    </button>
  )
}

function KakaoLoginButton() {
  return (
    <button
      className="inline-flex h-14 w-full max-w-[368px] items-center justify-center gap-4 rounded-lg bg-[#FEE500] px-4 text-base font-bold text-[#191600] hover:bg-[#f4dc00]"
      type="button"
    >
      <MessageSquare className="size-6" fill="currentColor" strokeWidth={0} />
      카카오 로그인
    </button>
  )
}

function GoogleLoginButton() {
  return (
    <button
      className="inline-flex h-14 min-w-11 w-full max-w-[368px] items-center justify-center gap-4 rounded-xl border border-[#F7F7F7] bg-white px-4 py-3.5 text-sm leading-[17px] font-semibold text-[#121212] shadow-[0_5px_35px_rgba(18,18,18,0.05)] hover:bg-[#fafafa]"
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
  return (
    <main className="flex min-h-svh flex-col bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,250,247,0.94)_100%)] text-[#222633]">
      <header className="flex h-[82px] items-center justify-between border-b border-[#dfe3ea] px-[30px] max-sm:h-[68px] max-sm:px-[18px]">
        <AuthLogo className="h-9 max-sm:h-8" linkClassName="inline-flex items-center w-fit" to="/" />
        <a className="text-base text-[#405777]" href="#help">
          고객센터
        </a>
      </header>

      <section
        className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-16 text-center max-sm:px-4 max-sm:pt-6 max-sm:pb-10"
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
          className="min-h-[994px] w-full border border-[#c7ccd6] bg-white px-[51px] pt-[47px] pb-[45px] text-left shadow-[0_1px_2px_rgba(7,20,49,0.04)] max-sm:min-h-0 max-sm:px-[22px] max-sm:py-[30px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="grid gap-2.5 text-[15px] font-extrabold text-[#071431] uppercase">
            <span>회사 이메일</span>
            <input type="email" placeholder="이름@회사.com" autoComplete="email" className={inputClass} />
          </label>

          <label className="mt-7 grid gap-2.5 text-[15px] font-extrabold text-[#071431] uppercase">
            <span className="flex gap-4 justify-between items-center">
              비밀번호
              <Link className="text-[15px] font-extrabold text-[#bc210e] normal-case" to="/reset-password">
                비밀번호 찾기
              </Link>
            </span>
            <span className="block relative">
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${inputClass} pr-[58px]`}
              />
              <button
                className="absolute top-1/2 right-[17px] inline-flex -translate-y-1/2 items-center justify-center bg-transparent text-[#4b515d]"
                type="button"
                aria-label="비밀번호 보기"
              >
                <Eye size={20} strokeWidth={2.5} />
              </button>
            </span>
          </label>

          <label className="mt-8 flex items-center gap-[11px] text-lg leading-snug text-[#232733] max-sm:text-[15px]">
            <input className="m-0 size-[21px] accent-[#ff4b11]" type="checkbox" />
            <span>이 기기에서 로그인 상태 유지</span>
          </label>

          <button
            className="mt-[42px] inline-flex h-[60px] w-full items-center justify-center rounded bg-[#ff4b11] text-xl font-medium text-white hover:bg-[#e83f09] max-sm:h-[54px] max-sm:text-[17px]"
            type="submit"
          >
            로그인
          </button>

          <div className="my-[85px] grid grid-cols-[1fr_auto_1fr] items-center gap-[30px] max-sm:my-12 max-sm:gap-[15px]">
            <span className="h-px bg-[#c7ccd6]"></span>
            <p className="m-0 text-[15px] font-extrabold text-[#071431] uppercase max-sm:whitespace-nowrap max-sm:text-xs">
              다른 계정으로 계속하기
            </p>
            <span className="h-px bg-[#c7ccd6]"></span>
          </div>

          <div className="grid gap-5 justify-items-center">
            <NaverLoginButton />
            <KakaoLoginButton />
            <GoogleLoginButton />
          </div>

          <p className="mt-[88px] text-center text-lg text-[#2d3038] max-sm:mt-12 max-sm:text-[15px]">
            계정이 없으신가요?{' '}
            <Link className="font-extrabold text-[#071431]" to="/signup">
              회원가입
            </Link>
          </p>
        </form>

        <div className="mt-[50px] text-center text-[15px] font-bold text-[#8b9099]">
          <strong>인증된 임직원 전용 비공개 스토어</strong>
          <nav className="mt-1.5 flex justify-center gap-7 max-sm:gap-3.5" aria-label="보안 링크">
            <a href="#security">보안 정책</a>
            <span aria-hidden="true">•</span>
            <a href="#status">시스템 상태</a>
          </nav>
        </div>
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
          <a href="#help">고객센터</a>
        </nav>
      </footer>
    </main>
  )
}

export default LoginPage
