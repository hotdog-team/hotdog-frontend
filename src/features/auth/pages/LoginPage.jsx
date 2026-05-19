import { useState } from 'react'
import { Eye, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo.jsx'
import { useAuthStore } from '../../../store/useAuthStore'
import { toast } from 'react-toastify'
import { Button, GlobalFooter, SocialLoginGroup } from '../../../common/components'
import { startSocialLogin } from '../../../api/authApi.js';

const inputClass =
  'h-15 w-full rounded border border-border bg-white px-5 text-xl text-ink outline-none placeholder:text-muted focus:border-brand focus:ring-3 focus:ring-brand/15 max-sm:h-14 max-sm:text-base'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value) {
  return emailPattern.test(value)
}

function ClearButton({ label, onClick }) {
  return (
    <button
      className="absolute top-1/2 right-4 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-muted hover:bg-surface-muted"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <X size={18} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isEmailInvalid) return
    try {
      await login({ email, password })
      navigate('/home', { replace: true })
    } catch (err) {
      toast.error(err.message ?? '로그인에 실패했습니다.')
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,250,247,0.94)_100%)] text-body">
      <header className="flex h-20 items-center border-b border-border-soft px-8 max-sm:h-17 max-sm:px-4.5">
        <AuthLogo className="h-9 max-sm:h-8" linkClassName="inline-flex items-center w-fit" to="/" />
      </header>

      <section
        className="mx-auto w-full max-w-140 flex-1 px-5 pt-12 pb-16 text-center max-sm:px-4 max-sm:pt-10 max-sm:pb-10"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="mt-0.5 mb-2 text-4xl leading-tight font-extrabold text-ink max-sm:text-3xl"
        >
          다시 오신 것을 환영합니다
        </h1>
        <p className="mb-14 text-2xl leading-snug text-[#252938] max-sm:mb-8 max-sm:text-lg">
          임직원 전용 혜택을 확인하세요.
        </p>

        <form
          className="min-h-205 w-full border border-border bg-white px-12 py-12 text-left shadow-card max-sm:min-h-0 max-sm:px-5.5 max-sm:pt-8 max-sm:pb-4"
          aria-describedby="login-form-description"
          onSubmit={handleSubmit}
        >
          <p id="login-form-description" className="sr-only">
            회사 이메일과 비밀번호는 필수 입력 항목입니다.
          </p>

          <div className="grid gap-2.5">
            <label className="text-sm font-extrabold uppercase text-ink" htmlFor="login-email">
              회사 이메일
            </label>
            <span className="block relative">
              <input
                id="login-email"
                type="email"
                placeholder="이름@회사.com"
                autoComplete="email"
                className={`${inputClass} ${email ? 'pr-14' : ''}`}
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
              <p id="login-email-error" className="text-sm font-semibold text-error" role="alert">
                회사 이메일 형식이 올바르지 않습니다.
              </p>
            )}
          </div>

          <div className="mt-7 grid gap-2.5">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-extrabold uppercase text-ink" htmlFor="login-password">
                비밀번호
              </label>
              <Link className="text-sm font-extrabold text-brand normal-case" to="/reset-password">
                비밀번호 찾기
              </Link>
            </div>
            <span className="block relative">
              <input
                id="login-password"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${inputClass} pr-14`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                aria-required="true"
                aria-describedby="login-form-description"
              />
              <button
                className="absolute top-1/2 right-4 inline-flex -translate-y-1/2 items-center justify-center bg-transparent text-muted"
                type="button"
                aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth className="mt-8">
            로그인
          </Button>

          <SocialLoginGroup />

          <p className="mt-10 text-center text-lg text-[#2d3038] max-sm:mt-8 max-sm:text-sm">
            계정이 없으신가요?{' '}
            <Link className="font-extrabold text-ink" to="/signup">
              회원가입
            </Link>
          </p>
        </form>

        <p className="mt-12.5 text-center text-sm font-bold text-[#8b9099]">
          인증된 임직원 전용 비공개 스토어
        </p>
      </section>

      <GlobalFooter />
    </main>
  )
}

export default LoginPage
