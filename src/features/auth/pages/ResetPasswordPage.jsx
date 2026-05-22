import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo.jsx'
import { Button } from '../../../components/index.js'

function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('등록되지 않은 이메일이거나 서버 오류가 발생했습니다.')
      }

      setStatus('success')
      setMessage('입력하신 이메일로 비밀번호 재설정 링크가 발송되었습니다.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-page text-foreground">
      <div
        className="absolute top-0 -right-9 -bottom-px z-0 w-auth-deco bg-auth-panel clip-auth-deco max-[width:var(--width-form)]:opacity-45"
        aria-hidden="true"
      />

      <section
        className="layout-container-auth layout-container-auth--md relative z-10 flex flex-1 flex-col pt-auth-top pb-14 max-sm:pt-24 max-sm:pb-10"
        aria-labelledby="reset-title"
      >
        <div className="mb-20 grid justify-items-center gap-2.5 max-sm:mb-12">
          <AuthLogo className="h-14 max-sm:h-12" />
          <p className="m-0 text-base font-extrabold text-ink uppercase max-sm:text-xs">
            임직원 전용 플랫폼
          </p>
        </div>

        <form
          className="w-full border border-border bg-surface px-13 pt-14 pb-13 shadow-card max-sm:px-6 max-sm:py-8"
          onSubmit={handleSubmit}
        >
          <h1 id="reset-title" className="mb-3 text-4xl leading-tight font-extrabold text-ink max-sm:text-3xl">
            비밀번호를 잊으셨나요?
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-foreground max-sm:text-lg">
            임직원 계정에 등록된 이메일 주소를 입력하시면 비밀번호 재설정을 위한 보안 링크를 보내드립니다.
          </p>

          <label className="grid gap-2.5 text-sm font-extrabold text-ink">
            <span>회사 이메일 주소</span>
            <span className="relative block">
              <Mail
                className="absolute top-1/2 left-5 -translate-y-1/2 text-muted"
                size={22}
                fill="currentColor"
                strokeWidth={1.5}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이름@회사.com"
                autoComplete="email"
                required
                disabled={status === 'loading'}
                className="h-input-lg w-full rounded border border-border bg-surface pr-5 pl-14 text-xl text-ink outline-none placeholder:text-muted focus:border-brand focus:ring-3 focus:ring-brand/15 max-sm:h-14 max-sm:text-body disabled:bg-surface-muted"
              />
            </span>
          </label>

          {message && (
            <p
              className={`mt-3 text-sm font-bold ${status === 'success' ? 'text-success' : 'text-error'}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <Button
            className="mt-8 font-extrabold"
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={status === 'loading'}
            disabled={!email}
          >
            {status === 'loading' ? '발송 중...' : '재설정 링크 보내기'}
          </Button>

          <div className="mt-13 border-t border-border pt-8 text-center text-foreground max-sm:text-sm max-sm:leading-normal">
            문제가 있으신가요?{' '}
            <a className="font-extrabold text-ink" href="#help-desk">
              임직원 헬프데스크
            </a>
            에 문의하세요.
          </div>
        </form>

        <Link className="mx-auto mt-8 flex w-fit items-center gap-3 text-2xl text-ink max-sm:text-lg" to="/">
          <ArrowLeft size={22} aria-hidden="true" />
          로그인으로 돌아가기
        </Link>
      </section>
    </main>
  )
}

export default ResetPasswordPage
