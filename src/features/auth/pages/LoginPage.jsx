import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo.jsx'
import { useAuthStore } from '../../../store/useAuthStore'
import { toast } from 'react-toastify'
import {
  Button,
  InputClearButton,
  InputField,
  PasswordToggleButton,
  SocialLoginGroup,
  getButtonClassName,
} from '../../../components/index.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value) {
  return emailPattern.test(value)
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isEmailInvalid) return

    try {
      await login({ email, password })

      const from = location.state?.from
      const nextPath = from?.pathname ?? '/home'
      navigate(nextPath, { replace: true, state: from?.state })
    } catch (err) {
      toast.error(err.message ?? '로그인에 실패했습니다.')
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth flex flex-1 flex-col justify-center py-10 max-sm:py-8"
        aria-labelledby="login-title"
      >
        <AuthLogo className="mx-auto h-12 max-sm:mb-6" />

        <div className="mx-auto w-full max-w-md rounded-lg bg-surface px-6 py-8 shadow-card max-sm:px-5 max-sm:py-6">
          <h1 id="login-title" className="mb-6 text-center text-3xl font-light text-ink max-sm:text-xl">
            로그인
          </h1>

          <form
            className="grid gap-5 text-left"
            aria-describedby="login-form-description"
            onSubmit={handleSubmit}
            noValidate
          >
            <p id="login-form-description" className="sr-only">
              이메일과 비밀번호를 입력한 뒤 로그인할 수 있습니다.
            </p>

            <InputField
              id="login-email"
              label="이메일"
              size="md"
              type="email"
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              invalid={isEmailInvalid}
              error={isEmailInvalid ? '올바른 이메일 형식을 입력해 주세요.' : undefined}
              describedBy={isEmailInvalid ? 'login-form-description' : 'login-form-description'}
              trailing={email ? <InputClearButton label="이메일 지우기" onClick={() => setEmail('')} /> : null}
            />

            <div>
              <InputField
                id="login-password"
                label="비밀번호"
                size="md"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                describedBy="login-form-description"
                trailing={
                  <PasswordToggleButton
                    visible={isPasswordVisible}
                    onToggle={() => setIsPasswordVisible((current) => !current)}
                  />
                }
              />
              <div className="mt-2 flex justify-end">
                <Link
                  className="text-body-sm font-medium text-muted hover:text-ink hover:underline focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                  to="/reset-password"
                >
                  비밀번호 재설정
                </Link>
              </div>
            </div>

            <div className="grid gap-2">
              <Button type="submit" variant="primary" size="md" fullWidth>
                로그인
              </Button>

              <Link
                to="/signup"
                className={getButtonClassName({ variant: 'outline', size: 'md', fullWidth: true })}
              >
                회원가입
              </Link>
            </div>

            <SocialLoginGroup className="mt-1" />
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
