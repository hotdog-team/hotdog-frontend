import { useEffect, useMemo, useRef, useState } from 'react'
import { Circle, CircleAlert, CircleCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLogo from '../components/AuthLogo.jsx'
import { signup } from '../../../api/authApi.js'
import { useAuthStore } from '../../../store/useAuthStore.js'
import {
  Button,
  Checkbox,
  InputClearButton,
  InputField,
  PasswordToggleButton,
  getButtonClassName,
} from '../../../components/index.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value) {
  return emailPattern.test(value)
}

const passwordRules = [
  { label: '8자 이상 16자 이하', validate: (value) => value.length >= 8 && value.length <= 16 },
  { label: '영문 소문자 포함', validate: (value) => /[a-z]/.test(value) },
  { label: '영문 대문자 포함', validate: (value) => /[A-Z]/.test(value) },
  { label: '숫자 포함', validate: (value) => /\d/.test(value) },
  { label: '특수문자 포함', validate: (value) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
]

function PasswordRequirementItem({ isActive, isValid, label }) {
  const Icon = !isActive ? Circle : isValid ? CircleCheck : CircleAlert
  const statusClass = !isActive ? 'text-muted' : isValid ? 'text-success' : 'text-error'

  return (
    <li className={`flex items-center gap-2 text-body-sm ${statusClass}`}>
      <Icon className="size-3.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
      <span>{label}</span>
    </li>
  )
}

function buildPasswordStatusSummary(password, passwordConfirm, hasPassword, hasPasswordConfirm) {
  const parts = []

  if (hasPassword) {
    const passed = passwordRules.filter((rule) => rule.validate(password)).length
    parts.push(`비밀번호 요구사항 ${passed}개 중 ${passwordRules.length}개 충족`)
  }

  if (hasPasswordConfirm) {
    parts.push(password === passwordConfirm ? '비밀번호 확인이 일치합니다.' : '비밀번호 확인이 일치하지 않습니다.')
  }

  return parts.join(' ')
}

function SignUpPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitErrorRef = useRef(null)

  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)
  const isPasswordValid = passwordRules.every((rule) => rule.validate(password))

  const passwordStatusSummary = useMemo(
    () => buildPasswordStatusSummary(password, passwordConfirm, hasPassword, hasPasswordConfirm),
    [password, passwordConfirm, hasPassword, hasPasswordConfirm],
  )

  useEffect(() => {
    if (submitError && submitErrorRef.current) {
      submitErrorRef.current.focus()
    }
  }, [submitError])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (isEmailInvalid || !isPasswordValid || !isPasswordConfirmValid) {
      return
    }

    const tempSocialUser = useAuthStore.getState().tempSocialUser

    const signupData = {
      email,
      password,
      name,
      profileTagIds: [],
      isJobRecommendEnabled: false,
      provider: tempSocialUser?.provider || null,
      providerId: tempSocialUser?.providerId || null,
    }

    setIsSubmitting(true)

    try {
      await signup(signupData)
      useAuthStore.setState({ tempSocialUser: null })
      await login({ email, password })
      toast.success('회원가입이 완료되었습니다.')
      navigate('/signup/profile')
    } catch (err) {
      setSubmitError(err.message ?? '회원가입 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth flex flex-1 flex-col justify-center py-10 max-sm:py-8"
        aria-labelledby="signup-title"
      >
        <AuthLogo className="mx-auto h-12 max-sm:mb-6" />

        <div className="mx-auto w-full max-w-md rounded-lg bg-surface px-6 py-8 shadow-card max-sm:px-5 max-sm:py-6">
          <h1
            id="signup-title"
            className="mb-6 text-center text-3xl font-light text-ink max-sm:text-xl"
          >
            회원가입
          </h1>

          <form className="grid gap-5 text-left" onSubmit={handleSubmit} noValidate>
            <p id="signup-required-fields" className="sr-only">
              이름, 이메일, 비밀번호, 비밀번호 확인, 이용약관 동의는 필수입니다.
            </p>

            {submitError && (
              <div
                ref={submitErrorRef}
                role="alert"
                tabIndex={-1}
                className="rounded border border-error-border bg-error/5 px-4 py-3 text-body-sm font-medium text-error outline-none focus-visible:ring-2 focus-visible:ring-error/25"
              >
                {submitError}
              </div>
            )}

            <InputField
              id="signup-name"
              label="이름"
              size="md"
              placeholder="이름을 입력하세요"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              trailing={name ? <InputClearButton label="이름 지우기" onClick={() => setName('')} /> : null}
            />

            <InputField
              id="signup-email"
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
              trailing={email ? <InputClearButton label="이메일 지우기" onClick={() => setEmail('')} /> : null}
            />

            <InputField
              id="signup-password"
              label="비밀번호"
              size="md"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={16}
              required
              describedBy="password-requirement-summary"
              trailing={
                <PasswordToggleButton
                  visible={isPasswordVisible}
                  onToggle={() => setIsPasswordVisible((current) => !current)}
                />
              }
            />

            <InputField
              id="signup-password-confirm"
              label="비밀번호 확인"
              size="md"
              type={isPasswordConfirmVisible ? 'text' : 'password'}
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={16}
              required
              invalid={hasPasswordConfirm && !isPasswordConfirmValid}
              error={hasPasswordConfirm && !isPasswordConfirmValid ? '비밀번호가 일치하지 않습니다.' : undefined}
              describedBy="password-requirement-summary"
              trailing={
                <PasswordToggleButton
                  visible={isPasswordConfirmVisible}
                  labelPrefix="비밀번호 확인"
                  onToggle={() => setIsPasswordConfirmVisible((current) => !current)}
                />
              }
            />

            <p id="password-requirement-summary" className="sr-only" aria-live="polite" aria-atomic="true">
              {passwordStatusSummary}
            </p>

            <ul id="password-requirement-list" className="grid gap-1.5" aria-hidden="true">
              {passwordRules.map((rule) => (
                <PasswordRequirementItem
                  key={rule.label}
                  isActive={hasPassword}
                  isValid={rule.validate(password)}
                  label={rule.label}
                />
              ))}
              <PasswordRequirementItem
                isActive={hasPasswordConfirm}
                isValid={isPasswordConfirmValid}
                label="비밀번호 확인 일치"
              />
            </ul>

            <div className="mt-1">
              <Checkbox
                id="signup-terms"
                variant="brand"
                size="md"
                required
                aria-required="true"
                label={
                  <>
                    <a className="font-semibold underline underline-offset-2" href="#terms">
                      서비스 이용약관
                    </a>
                    {' 및 '}
                    <a className="font-semibold underline underline-offset-2" href="#privacy">
                      개인정보 처리방침
                    </a>
                    에 동의합니다.
                  </>
                }
              />
            </div>

            <div className="grid gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={isSubmitting}
                disabled={!name || !email || !password || !passwordConfirm || isEmailInvalid || !isPasswordValid || !isPasswordConfirmValid}
              >
                회원가입
              </Button>

              <Link
                to="/login"
                className={getButtonClassName({ variant: 'outline', size: 'md', fullWidth: true })}
              >
                로그인
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default SignUpPage
