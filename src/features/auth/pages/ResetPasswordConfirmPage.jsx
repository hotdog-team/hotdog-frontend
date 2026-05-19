import { useEffect, useState } from 'react'
import { ArrowLeft, Circle, CircleAlert, CircleCheck, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo.jsx'
import { Button } from '../../../common/components'

const passwordPattern =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])[\\s\\S]{8,16}'

const passwordRequirement =
  '영문 대문자와 소문자, 숫자, 특수문자를 포함해 8자 이상 16자 이하로 입력해 주세요.'

const passwordRules = [
  {
    label: '최소 8자 이상',
    validate: (value) => value.length >= 8,
  },
  {
    label: '영문 대소문자 포함',
    validate: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  {
    label: '숫자 및 특수문자 포함',
    validate: (value) => /\d/.test(value) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  },
]

const inputClass =
  'h-18 w-full bg-surface-muted px-8 pr-18 text-xl text-ink outline-none placeholder:text-muted focus:bg-surface focus:ring-3 focus:ring-brand/20 max-sm:h-14 max-sm:px-5 max-sm:pr-14 max-sm:text-base'

function PasswordRequirementItem({ isActive, isValid, label }) {
  const Icon = !isActive ? Circle : isValid ? CircleCheck : CircleAlert
  const statusClass = !isActive ? 'text-muted' : isValid ? 'text-success' : 'text-error'
  const statusLabel = !isActive ? '' : isValid ? '충족' : '미충족'

  return (
    <li
      className={`flex items-center gap-3 ${statusClass}`}
      aria-label={`${label}${statusLabel ? ` — ${statusLabel}` : ''}`}
    >
      <Icon className="size-5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
      <span aria-hidden="true">{label}</span>
    </li>
  )
}

function PasswordInput({
  id,
  label,
  placeholder,
  value,
  isVisible,
  isInvalid,
  describedBy,
  onChange,
  onToggleVisibility,
}) {
  const VisibilityIcon = isVisible ? EyeOff : Eye

  return (
    <div className="grid gap-3 text-base font-bold text-ink max-sm:text-sm">
      <label htmlFor={id}>{label}</label>
      <span className="relative block">
        <input
          id={id}
          name={id}
          className={inputClass}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          minLength={8}
          maxLength={16}
          pattern={passwordPattern}
          required
          aria-required="true"
          aria-invalid={isInvalid ? 'true' : 'false'}
          aria-describedby={describedBy}
          title={passwordRequirement}
        />
        <button
          className="absolute top-1/2 right-5 inline-flex -translate-y-1/2 items-center justify-center text-muted hover:text-ink max-sm:right-4"
          type="button"
          onClick={onToggleVisibility}
          aria-label={isVisible ? `${label} 숨기기` : `${label} 보기`}
          aria-pressed={isVisible}
        >
          <VisibilityIcon size={26} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </span>
    </div>
  )
}

function ResetPasswordConfirmPage() {
  const { token = '' } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    document.title = '비밀번호 재설정 | D-TO'
  }, [])

  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordValid = passwordRules.every((rule) => rule.validate(password))
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm
  const canSubmit = isPasswordValid && isPasswordConfirmValid
  const passwordDescriptionIds = 'reset-confirm-description reset-password-hint'
  const passwordConfirmDescriptionIds = 'reset-confirm-description reset-password-match-error'

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!canSubmit) {
      setStatusMessage('비밀번호 요구사항과 비밀번호 확인 일치 여부를 다시 확인해 주세요.')
      return
    }

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
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-page px-5 py-16 text-ink max-sm:px-4 max-sm:py-8">
      <a className="skip-link" href="#reset-confirm-content">
        본문으로 건너뛰기
      </a>
      <section id="reset-confirm-content" className="w-full max-w-152" aria-labelledby="reset-confirm-title">
        <div className="mb-11 grid justify-items-center gap-2 max-sm:mb-7">
          <AuthLogo className="h-14 max-sm:h-12" />
          <p className="m-0 text-sm font-extrabold tracking-widest text-muted max-sm:text-xs">
            임직원 전용 플랫폼
          </p>
        </div>

        <form
          className="border border-border bg-surface px-14 pt-14 pb-15 shadow-card max-sm:px-6 max-sm:py-9"
          onSubmit={handleSubmit}
          data-reset-token={token}
          noValidate
        >
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

          <div className="mb-14 text-center max-sm:mb-9">
            <h1 id="reset-confirm-title" className="mb-8 text-4xl leading-tight font-medium text-ink max-sm:mb-5 max-sm:text-3xl">
              비밀번호 재설정
            </h1>
            <p id="reset-confirm-description" className="mx-auto max-w-105 text-xl leading-relaxed text-muted max-sm:text-base">
              계정 보안을 위해 새로운 비밀번호를 설정해 주세요.
            </p>
          </div>

          <p id="reset-password-hint" className="sr-only">
            영문 대문자와 소문자, 숫자, 특수문자를 포함해 8자 이상 16자 이하로 입력해 주세요.
          </p>

          <div className="grid gap-6">
            <PasswordInput
              id="new-password"
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력하세요"
              value={password}
              isVisible={isPasswordVisible}
              isInvalid={hasPassword && !isPasswordValid}
              describedBy={passwordDescriptionIds}
              onChange={setPassword}
              onToggleVisibility={() => setIsPasswordVisible((current) => !current)}
            />
            <PasswordInput
              id="new-password-confirm"
              label="새 비밀번호 확인"
              placeholder="비밀번호를 한번 더 입력하세요"
              value={passwordConfirm}
              isVisible={isPasswordConfirmVisible}
              isInvalid={hasPasswordConfirm && !isPasswordConfirmValid}
              describedBy={passwordConfirmDescriptionIds}
              onChange={setPasswordConfirm}
              onToggleVisibility={() => setIsPasswordConfirmVisible((current) => !current)}
            />
          </div>

          <p id="reset-password-match-error" className="sr-only">
            새 비밀번호 확인 입력값은 새 비밀번호와 일치해야 합니다.
          </p>

          <div
            id="reset-password-requirements"
            className="mt-6 rounded border border-border-soft bg-[#fffafa] px-5 py-5 text-body-lg leading-relaxed text-muted max-sm:text-sm"
          >
            <p className="mb-2 font-extrabold text-ink" aria-hidden="true">비밀번호 요구사항:</p>
            <ul
              className="grid gap-1.5"
              aria-label="비밀번호 요구사항"
              aria-live="polite"
              aria-atomic="false"
              aria-relevant="text"
            >
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
          </div>

          <Button
            className="mt-10 max-sm:mt-9"
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
          >
            비밀번호 변경하기
          </Button>

          <p className="sr-only" role="status" aria-live="polite">
            {statusMessage}
          </p>

          <Link
            className="mx-auto mt-12 flex w-fit items-center gap-2 text-base font-semibold text-ink max-sm:mt-8 max-sm:text-sm"
            to="/"
          >
            <ArrowLeft size={19} aria-hidden="true" />
            로그인 페이지로 돌아가기
          </Link>
        </form>
      </section>
    </main>
  )
}

export default ResetPasswordConfirmPage
