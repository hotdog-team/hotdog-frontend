import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'

function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-[#fbfafa] text-[#222633]">
      <div
        className="absolute top-0 right-[-36px] bottom-[-1px] z-0 w-[34%] bg-[#f0eeee] [clip-path:polygon(54%_0,100%_0,100%_100%,0_100%)] max-[900px]:opacity-45"
        aria-hidden="true"
      ></div>

      <section
        className="relative z-10 mx-auto w-full max-w-[590px] flex-1 px-5 pt-[212px] pb-14 max-sm:px-4 max-sm:pt-[98px] max-sm:pb-10"
        aria-labelledby="reset-title"
      >
        <div className="mb-[79px] grid justify-items-center gap-2.5 max-sm:mb-[50px]">
          <AuthLogo className="h-14 max-sm:h-12" linkClassName="inline-flex w-fit items-center" to="/" />
          <p className="m-0 text-base font-extrabold text-[#202634] uppercase max-sm:text-[13px]">
            임직원 전용 플랫폼
          </p>
        </div>

        <form
          className="w-full border border-[#c7ccd6] bg-white px-[51px] pt-[55px] pb-[53px] shadow-[0_1px_2px_rgba(7,20,49,0.04)] max-sm:px-[22px] max-sm:py-[30px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1 id="reset-title" className="mb-3 text-[34px] leading-tight font-extrabold text-[#071431] max-sm:text-3xl">
            비밀번호를 잊으셨나요?
          </h1>
          <p className="mb-[33px] text-[21px] leading-[1.54] text-[#2d3039] max-sm:text-lg">
            임직원 계정에 등록된 이메일 주소를 입력하시면 비밀번호 재설정을 위한 보안 링크를 보내드립니다.
          </p>

          <label className="grid gap-2.5 text-[15px] font-extrabold text-[#071431]">
            <span>회사 이메일 주소</span>
            <span className="relative block">
              <Mail
                className="absolute top-1/2 left-5 -translate-y-1/2 text-[#434955]"
                size={22}
                fill="currentColor"
                strokeWidth={1.5}
              />
              <input
                type="email"
                placeholder="이름@회사.com"
                autoComplete="email"
                className="h-[61px] w-full rounded border border-[#c7ccd6] bg-white pr-5 pl-14 text-[21px] text-[#071431] outline-none placeholder:text-[#697283] focus:border-[#ff4b11] focus:ring-3 focus:ring-[#ff4b11]/15 max-sm:h-[54px] max-sm:text-[17px]"
              />
            </span>
          </label>

          <button
            className="mt-[31px] inline-flex h-[60px] w-full items-center justify-center bg-[#ff4b11] text-xl font-extrabold text-white hover:bg-[#e83f09] max-sm:h-[54px] max-sm:text-[17px]"
            type="submit"
          >
            재설정 링크 보내기
          </button>

          <div className="mt-[52px] border-t border-[#c7ccd6] pt-[31px] text-center text-[17px] text-[#20232b] max-sm:text-[15px] max-sm:leading-normal">
            문제가 있으신가요?{' '}
            <a className="font-extrabold text-[#071431]" href="#help-desk">
              임직원 헬프데스크
            </a>
            에 문의하세요.
          </div>
        </form>

        <Link className="mx-auto mt-[31px] flex w-fit items-center gap-[11px] text-[22px] text-[#071431] max-sm:text-lg" to="/">
          <ArrowLeft size={22} />
          로그인으로 돌아가기
        </Link>
      </section>

      <footer className="relative z-10 flex min-h-[82px] items-end justify-between gap-8 border-t border-[#dfe3ea] bg-white/70 px-[30px] pt-[33px] pb-[31px] max-[900px]:flex-col max-[900px]:items-start max-sm:px-[18px] max-sm:py-7">
        <p className="m-0 text-base font-semibold text-[#171c28]">
          © 2024 임직원 전용 스토어. 모든 권리 보유.
        </p>
        <nav
          className="flex items-center gap-10 whitespace-nowrap text-base font-semibold text-[#171c28] max-[900px]:flex-wrap max-[900px]:gap-x-6 max-[900px]:gap-y-4 max-[900px]:whitespace-normal"
          aria-label="푸터 링크"
        >
          <a href="#privacy">개인정보 처리방침</a>
          <a href="#terms">서비스 이용약관</a>
          <a href="#help">고객센터</a>
        </nav>
      </footer>
    </main>
  )
}

export default ResetPasswordPage
