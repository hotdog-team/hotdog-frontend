import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo.jsx'
import { Button, Input, InputClearButton } from '../../../components/index.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value) {
  return emailPattern.test(value)
}

const SUPPORT_EMAIL = 'service@d-to.com'

function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || isEmailInvalid) return

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('registered')
      }

      setStatus('success')
      setMessage('입력하신 이메일로 비밀번호 재설정 링크가 발송되었습니다.')
    } catch (error) {
      setStatus('error')
      if (error.message === 'registered') {
        setMessage('등록되지 않은 이메일이거나 요청에 실패했습니다.')
      } else {
        setMessage('요청 처리 중 문제가 발생했습니다.')
      }
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth flex flex-1 flex-col justify-center py-10 max-sm:py-8"
        aria-labelledby="reset-title"
      >
        <AuthLogo className="mx-auto h-12 max-sm:mb-6" />

        <div className="mx-auto w-full max-w-md rounded-lg bg-surface px-6 py-8 shadow-card max-sm:px-5 max-sm:py-6">
          <h1
            id="reset-title"
            className="mb-2 text-center text-3xl font-light text-ink max-sm:text-xl"
          >
            비밀번호 재설정
          </h1>
          <p className="mb-6 text-center text-body-sm leading-relaxed text-muted tracking-tight">
            가입 시 사용한 이메일 주소를 입력하시면
            <br className="max-sm:hidden" />
            {' '}비밀번호 재설정 링크를 보내드립니다.
          </p>

          <form
            className="text-left"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="reset-form-description"
          >
            <p id="reset-form-description" className="sr-only">
              이메일 주소를 입력한 뒤 재설정 링크를 요청할 수 있습니다.
            </p>

            <div className="grid gap-2">
              <label className="text-body font-semibold text-ink" htmlFor="reset-email">
                이메일
              </label>
              <span className="relative block">
                <Input
                  id="reset-email"
                  type="email"
                  size="md"
                  placeholder="이메일을 입력하세요"
                  autoComplete="email"
                  inputMode="email"
                  className={email ? 'pr-12' : undefined}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  aria-required="true"
                  invalid={isEmailInvalid}
                  disabled={status === 'loading'}
                  aria-describedby={
                    isEmailInvalid
                      ? 'reset-form-description reset-email-error'
                      : message
                        ? 'reset-form-description reset-message'
                        : 'reset-form-description reset-help'
                  }
                />
                {email && status !== 'loading' && (
                  <span className="absolute top-1/2 right-3 flex -translate-y-1/2">
                    <InputClearButton label="이메일 지우기" onClick={() => setEmail('')} />
                  </span>
                )}
              </span>
              {isEmailInvalid && (
                <p id="reset-email-error" className="text-body-sm font-medium text-error" role="alert">
                  올바른 이메일 형식을 입력해 주세요.
                </p>
              )}
            </div>

            {message && (
              <p
                id="reset-message"
                className={`mt-3 text-body-sm font-medium ${status === 'success' ? 'text-success' : 'text-error'}`}
                role={status === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <Button
              className="mt-6"
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={status === 'loading'}
              disabled={!email || isEmailInvalid}
            >
              {status === 'loading' ? '발송 중...' : '재설정 링크 보내기'}
            </Button>

            <p id="reset-help" className="mt-6 text-center text-body-sm leading-relaxed text-muted tracking-tight">
              가입 정보를 확인할 수 없는 경우
              <br />
              <span className="inline-block whitespace-nowrap">
                <a
                  className="font-semibold text-ink underline-offset-2 hover:underline focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
                  href={`mailto:${SUPPORT_EMAIL}`}
                >
                  {SUPPORT_EMAIL}
                </a>
                으로 문의해 주세요.
              </span>
            </p>
          </form>

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

export default ResetPasswordPage
