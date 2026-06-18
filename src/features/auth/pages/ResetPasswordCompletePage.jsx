import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/index.js'

function ResetPasswordCompletePage() {
  const navigate = useNavigate()
  const [remainingSeconds, setRemainingSeconds] = useState(5)

  useEffect(() => {
    document.title = '비밀번호 변경 완료 | D-TO'
  }, [])

  useEffect(() => {
    if (remainingSeconds === 0) {
      navigate('/login', { replace: true })
      return undefined
    }

    const countdownTimer = window.setInterval(() => {
      setRemainingSeconds((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(countdownTimer)
  }, [navigate, remainingSeconds])

  const handleLoginClick = () => {
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth flex flex-1 flex-col justify-center py-10 max-sm:py-8"
        aria-labelledby="reset-complete-title"
      >

        <div className="mx-auto w-full max-w-md rounded-lg bg-surface px-6 py-8 text-center shadow-card max-sm:px-5 max-sm:py-6">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand text-white">
            <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
          </div>

          <h1
            id="reset-complete-title"
            className="mb-2 text-3xl font-light text-ink max-sm:text-xl"
          >
            비밀번호가 변경되었습니다
          </h1>
          <p className="mb-6 text-body-sm leading-relaxed tracking-tight text-muted">
            새로운 비밀번호로 변경되었습니다.
            <br />
            로그인 후 서비스를 이용해 주세요.
          </p>

          <p className="mb-6 text-body-sm font-medium text-muted" role="status" aria-live="polite">
            {remainingSeconds}초 후 로그인 페이지로 이동합니다.
          </p>

          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={handleLoginClick}
          >
            로그인 페이지로 이동
          </Button>

          <div className="mt-6 text-center">
            <Link
              className="text-body-sm font-medium text-muted hover:text-ink hover:underline focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
              to="/login"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ResetPasswordCompletePage
