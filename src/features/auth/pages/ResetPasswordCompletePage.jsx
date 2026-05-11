import { useEffect, useState } from 'react'
import { Check, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'

function ResetPasswordCompletePage() {
  const navigate = useNavigate()
  const [remainingSeconds, setRemainingSeconds] = useState(5)

  useEffect(() => {
    document.title = '비밀번호 변경 완료 | D-TO'
  }, [])

  useEffect(() => {
    if (remainingSeconds === 0) {
      navigate('/', { replace: true })
      return undefined
    }

    const countdownTimer = window.setInterval(() => {
      setRemainingSeconds((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(countdownTimer)
  }, [navigate, remainingSeconds])

  const handleLoginClick = () => {
    navigate('/', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#fbfafa] px-5 py-16 text-[#071431] max-sm:px-4 max-sm:py-8">
      <a className="skip-link" href="#reset-complete-content">
        본문으로 건너뛰기
      </a>
      <section
        id="reset-complete-content"
        className="grid w-full max-w-[610px] justify-items-center"
        aria-labelledby="reset-complete-title"
      >
        <div className="mb-[49px] grid justify-items-center max-sm:mb-8">
          <AuthLogo className="h-[34px] max-sm:h-8" linkClassName="inline-flex w-fit items-center" to="/" />
        </div>

        <div className="w-full border border-[#d7dce4] bg-white px-[51px] pt-[52px] pb-[51px] text-center shadow-[0_1px_2px_rgba(7,20,49,0.08)] max-sm:px-6 max-sm:py-9">
          <div className="mx-auto mb-[31px] flex size-[106px] items-center justify-center rounded-[15px] bg-[#fff7ef] max-sm:size-[88px]">
            <span className="flex size-[54px] items-center justify-center rounded-full bg-[#ff5a12] text-white max-sm:size-12">
              <Check size={35} strokeWidth={4} aria-hidden="true" />
            </span>
          </div>

          <h1
            id="reset-complete-title"
            className="mb-[25px] text-[32px] leading-tight font-medium text-[#071431] max-sm:text-2xl"
          >
            비밀번호가 변경되었습니다
          </h1>
          <p className="mx-auto mb-[28px] max-w-[390px] text-[19px] leading-[1.55] font-medium text-[#65768f] max-sm:mb-6 max-sm:text-base">
            새로운 비밀번호로 안전하게 변경되었습니다. 이제 다시 로그인하여 서비스를 이용하실 수 있습니다.
          </p>

          <p className="mb-[34px] text-[16px] font-semibold text-[#8a96a8] max-sm:mb-7 max-sm:text-sm" role="status" aria-live="polite">
            {remainingSeconds}초 후 로그인 페이지로 이동합니다.
          </p>

          <button
            className="inline-flex h-[62px] w-full items-center justify-center bg-[#ff4b11] text-[16px] font-medium tracking-[0.08em] text-white transition hover:bg-[#e83f09] max-sm:h-[56px] max-sm:text-sm"
            type="button"
            onClick={handleLoginClick}
          >
            로그인 페이지로 이동
          </button>
        </div>

        <p className="mt-[52px] inline-flex items-center gap-2 text-[15px] font-bold tracking-[0.17em] text-[#b7bcc6] max-sm:mt-9 max-sm:text-xs">
          <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
          SECURE CORPORATE PORTAL
        </p>
      </section>
    </main>
  )
}

export default ResetPasswordCompletePage
