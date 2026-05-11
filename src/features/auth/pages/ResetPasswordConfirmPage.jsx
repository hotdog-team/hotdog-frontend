import { useEffect, useState } from 'react'
import { ArrowLeft, Circle, CircleAlert, CircleCheck, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'

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
  'h-[70px] w-full bg-[#eef2f7] px-8 pr-[72px] text-[20px] text-[#071431] outline-none placeholder:text-[#7d8796] focus:bg-white focus:ring-3 focus:ring-[#ff4b11]/20 max-sm:h-[58px] max-sm:px-5 max-sm:pr-[58px] max-sm:text-base'

function PasswordRequirementItem({ isActive, isValid, label }) {
  const Icon = !isActive ? Circle : isValid ? CircleCheck : CircleAlert
  const statusClass = !isActive ? 'text-[#6f819a]' : isValid ? 'text-[#1f8a4c]' : 'text-[#bc210e]'

  return (
    <li className={`flex items-center gap-3 ${statusClass}`}>
      <Icon className="size-[18px] shrink-0" strokeWidth={2.2} aria-hidden="true" />
      <span>{label}</span>
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
    <div className="grid gap-3 text-[16px] font-bold text-[#071431] max-sm:text-sm">
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
          className="absolute top-1/2 right-5 inline-flex -translate-y-1/2 items-center justify-center text-[#61718a] hover:text-[#071431] max-sm:right-4"
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
  const passwordDescriptionIds = 'reset-confirm-description reset-password-requirements'
  const passwordConfirmDescriptionIds = 'reset-confirm-description reset-password-requirements reset-password-match-error'

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!canSubmit) {
      setStatusMessage('비밀번호 요구사항과 비밀번호 확인 일치 여부를 다시 확인해 주세요.')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: password
        }),
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
    <main className="flex min-h-svh items-center justify-center bg-[#fbfafa] px-5 py-16 text-[#071431] max-sm:px-4 max-sm:py-8">
      <a className="skip-link" href="#reset-confirm-content">
        본문으로 건너뛰기
      </a>
      <section id="reset-confirm-content" className="w-full max-w-[610px]" aria-labelledby="reset-confirm-title">
        <div className="mb-11 grid justify-items-center gap-2 max-sm:mb-7">
          <AuthLogo className="h-[58px] max-sm:h-12" linkClassName="inline-flex w-fit items-center" to="/" />
          <p className="m-0 text-[15px] font-extrabold tracking-[0.1em] text-[#4b515d] max-sm:text-xs">
            임직원 전용 플랫폼
          </p>
        </div>

        <form
          className="border border-[#c7ccd6] bg-white px-[55px] pt-[58px] pb-[61px] shadow-[0_1px_2px_rgba(7,20,49,0.08)] max-sm:px-6 max-sm:py-9"
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
          <div className="mb-[57px] text-center max-sm:mb-9">
            <h1 id="reset-confirm-title" className="mb-8 text-[38px] leading-tight font-medium text-[#071431] max-sm:mb-5 max-sm:text-3xl">
              비밀번호 재설정
            </h1>
            <p id="reset-confirm-description" className="mx-auto max-w-[420px] text-[20px] leading-[1.55] text-[#6b7c96] max-sm:text-base">
              계정 보안을 위해 새로운 비밀번호를 설정해 주세요.
            </p>
          </div>

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
            className="mt-6 rounded border border-[#dde3ec] bg-[#fffafa] px-5 py-5 text-[18px] leading-relaxed text-[#6f819a] max-sm:text-sm"
            aria-live="polite"
          >
            <p className="mb-2 font-extrabold text-[#071431]">비밀번호 요구사항:</p>
            <ul className="grid gap-1.5">
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

          <button
            className="mt-[55px] inline-flex h-[78px] w-full items-center justify-center bg-[#ff4b11] text-[27px] font-medium text-white transition hover:bg-[#e83f09] disabled:cursor-not-allowed disabled:bg-[#ffb199] max-sm:mt-9 max-sm:h-[60px] max-sm:text-xl"
            type="submit"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
          >
            비밀번호 변경하기
          </button>
          <p className="sr-only" role="status" aria-live="polite">
            {statusMessage}
          </p>

          <Link
            className="mx-auto mt-[48px] flex w-fit items-center gap-2 text-[17px] font-semibold text-[#071431] max-sm:mt-8 max-sm:text-sm"
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