import { useEffect, useMemo, useState } from 'react'
import { Circle, CircleAlert, CircleCheck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo.jsx'
import {
  Button,
  InputField,
  PasswordToggleButton,
} from '../../../components/index.js'

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

function ResetPasswordConfirmPage() {
  const { token = '' } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.title = '비밀번호 재설정 | D-TO'
  }, [])

  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordValid = passwordRules.every((rule) => rule.validate(password))
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm
  const canSubmit = isPasswordValid && isPasswordConfirmValid

  const passwordStatusSummary = useMemo(
    () => buildPasswordStatusSummary(password, passwordConfirm, hasPassword, hasPasswordConfirm),
    [password, passwordConfirm, hasPassword, hasPasswordConfirm],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatusMessage('')

    if (!canSubmit) {
      setStatusMessage('비밀번호 요구사항과 비밀번호 확인 일치 여부를 다시 확인해 주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })

      if (!response.ok) {
        throw new Error('비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.')
      }

      navigate('/reset-password/complete')
    } catch (error) {
      console.error('에러 발생:', error)
      setStatusMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth flex flex-1 flex-col justify-center py-10 max-sm:py-8"
        aria-labelledby="reset-confirm-title"
      >
        <AuthLogo className="mx-auto h-12 max-sm:mb-6" />

        <div className="mx-auto w-full max-w-md rounded-lg bg-surface px-6 py-8 shadow-card max-sm:px-5 max-sm:py-6">
          <h1
            id="reset-confirm-title"
            className="mb-2 text-center text-3xl font-light text-ink max-sm:text-xl"
          >
            비밀번호 재설정
          </h1>
          <p className="mb-6 text-center text-body-sm leading-relaxed tracking-tight text-muted">
            계정 보안을 위해 새로운 비밀번호를 설정해 주세요.
          </p>

          <form className="grid gap-5 text-left" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="reset-username">
              계정 아이디
            </label>
            <input
              id="reset-username"
              className="sr-only"
              type="text"
              name="username"
              autoComplete="username"
              tabIndex={-1}
              aria-hidden="true"
            />

            {statusMessage && (
              <p className="text-body-sm font-medium text-error" role="alert" aria-live="polite">
                {statusMessage}
              </p>
            )}

            <InputField
              id="new-password"
              label="새 비밀번호"
              size="md"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="새 비밀번호를 입력하세요"
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
              id="new-password-confirm"
              label="새 비밀번호 확인"
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

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isSubmitting}
              disabled={!canSubmit}
            >
              비밀번호 변경하기
            </Button>
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

export default ResetPasswordConfirmPage
