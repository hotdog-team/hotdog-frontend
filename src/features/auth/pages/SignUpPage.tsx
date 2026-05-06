import { useState } from 'react'
import { ArrowRight, Circle, CircleAlert, CircleCheck, Eye, Info, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'

const fieldClass =
  'h-[60px] w-full border border-[#c7ccd6] bg-white px-[30px] text-[21px] text-[#071431] outline-none placeholder:text-[#b0b1b8] focus:border-[#ff4b11] focus:ring-3 focus:ring-[#ff4b11]/15 max-sm:h-[54px] max-sm:px-4 max-sm:text-[17px]'

const labelClass = 'grid gap-2.5 text-[15px] font-extrabold tracking-[0.08em] text-[#071431] uppercase'

const passwordPattern =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>/?]{8,16}'

const passwordRequirement =
  '영문 대문자와 소문자, 숫자, 특수문자를 포함해 8자 이상 16자 이하로 입력해 주세요.'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value) {
  return emailPattern.test(value)
}

function ClearButton({ label, onClick }) {
  return (
    <button
      className="absolute top-1/2 right-[22px] inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-[#4b515d] hover:bg-[#f3f4f6] max-sm:right-3"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <X size={18} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}

const passwordRules = [
  {
    label: '8자 이상 16자 이하',
    validate: (value) => value.length >= 8 && value.length <= 16,
  },
  {
    label: '영문 소문자 포함',
    validate: (value) => /[a-z]/.test(value),
  },
  {
    label: '영문 대문자 포함',
    validate: (value) => /[A-Z]/.test(value),
  },
  {
    label: '숫자 포함',
    validate: (value) => /\d/.test(value),
  },
  {
    label: '특수문자 포함',
    validate: (value) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  },
]

function PasswordRequirementItem({ isActive, isValid, label }) {
  const Icon = !isActive ? Circle : isValid ? CircleCheck : CircleAlert
  const statusClass = !isActive ? 'text-[#8b9099]' : isValid ? 'text-[#1f8a4c]' : 'text-[#bc210e]'

  return (
    <li className={`flex items-center gap-2.5 ${statusClass}`}>
      <Icon className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
      <span>{label}</span>
    </li>
  )
}

function SignUpPage() {
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)
  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

  return (
    <main className="flex min-h-svh flex-col bg-[#fbfafa] text-[#222633]">
      <section
        className="mx-auto w-full max-w-[620px] flex-1 px-5 pt-[94px] pb-16 max-sm:px-4 max-sm:pt-14 max-sm:pb-10"
        aria-labelledby="signup-title"
      >
        <AuthLogo className="h-12 max-sm:h-10" linkClassName="mx-auto mb-[64px] flex w-fit items-center" to="/" />

        <div className="mb-[52px]">
          <h1 id="signup-title" className="mb-4 text-[42px] leading-tight font-extrabold text-[#071431] max-sm:text-3xl">
            계정 만들기
          </h1>
          <p className="text-[23px] leading-snug text-[#252938] max-sm:text-lg">
            인증을 시작하려면 정보를 입력해 주세요.
          </p>
        </div>

        <form className="grid gap-7" aria-describedby="signup-required-fields" onSubmit={(event) => event.preventDefault()}>
          <p id="signup-required-fields" className="sr-only">
            이름, 임직원 아이디, 회사 이메일, 비밀번호, 비밀번호 확인, 서비스 이용약관 동의는 필수 입력 항목입니다.
          </p>

          <div className={labelClass}>
            <label htmlFor="signup-name">이름</label>
            <span className="relative block">
              <input
                id="signup-name"
                className={`${fieldClass} ${name ? 'pr-[58px]' : ''}`}
                type="text"
                placeholder="홍길동"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                aria-required="true"
                aria-describedby="signup-required-fields"
              />
              {name && <ClearButton label="이름 지우기" onClick={() => setName('')} />}
            </span>
          </div>

          <div className={labelClass}>
            <label htmlFor="signup-employee-id">임직원 아이디</label>
            <span className="relative block">
              <input
                id="signup-employee-id"
                className={`${fieldClass} ${employeeId ? 'pr-24' : 'pr-14'}`}
                type="text"
                placeholder="예: 사번-123456"
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                required
                aria-required="true"
                aria-describedby="signup-employee-id-description signup-required-fields"
              />
              <Info
                className={`absolute top-1/2 -translate-y-1/2 text-[#727782] ${
                  employeeId ? 'right-[70px] max-sm:right-14' : 'right-[30px] max-sm:right-4'
                }`}
                size={21}
                strokeWidth={2}
                aria-hidden="true"
              />
              {employeeId && <ClearButton label="임직원 아이디 지우기" onClick={() => setEmployeeId('')} />}
            </span>
            <p id="signup-employee-id-description" className="sr-only">
              회사에서 발급한 사번 또는 임직원 아이디를 입력하세요.
            </p>
          </div>

          <div className={labelClass}>
            <label htmlFor="signup-email">회사 이메일</label>
            <span className="relative block">
              <input
                id="signup-email"
                className={`${fieldClass} ${email ? 'pr-[58px]' : ''}`}
                type="email"
                placeholder="이름@회사.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                aria-required="true"
                aria-invalid={isEmailInvalid}
                aria-describedby={isEmailInvalid ? 'signup-required-fields signup-email-error' : 'signup-required-fields'}
              />
              {email && <ClearButton label="회사 이메일 지우기" onClick={() => setEmail('')} />}
            </span>
            {isEmailInvalid && (
              <p id="signup-email-error" className="text-sm font-semibold tracking-normal text-[#bc210e]" role="alert">
                회사 이메일 형식이 올바르지 않습니다.
              </p>
            )}
          </div>

          <div className="grid gap-7">
            <div className={labelClass}>
              <label htmlFor="signup-password">비밀번호</label>
              <span className="relative block">
                <input
                  id="signup-password"
                  className={`${fieldClass} pr-[58px]`}
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={16}
                  pattern={passwordPattern}
                  required
                  aria-required="true"
                  aria-describedby="password-requirement"
                  title={passwordRequirement}
                />
                <button
                  className="absolute top-1/2 right-[22px] inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-[#4b515d] hover:bg-[#f3f4f6] max-sm:right-3"
                  type="button"
                  aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                  aria-pressed={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((current) => !current)}
                >
                  <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </span>
            </div>
            <div className={labelClass}>
              <label htmlFor="signup-password-confirm">비밀번호 확인</label>
              <span className="relative block">
                <input
                  id="signup-password-confirm"
                  className={`${fieldClass} pr-[58px]`}
                  type={isPasswordConfirmVisible ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={16}
                  pattern={passwordPattern}
                  required
                  aria-required="true"
                  aria-describedby="password-requirement"
                  title={passwordRequirement}
                />
                <button
                  className="absolute top-1/2 right-[22px] inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-[#4b515d] hover:bg-[#f3f4f6] max-sm:right-3"
                  type="button"
                  aria-label={isPasswordConfirmVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                  aria-pressed={isPasswordConfirmVisible}
                  onClick={() => setIsPasswordConfirmVisible((current) => !current)}
                >
                  <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </span>
            </div>
          </div>
          <ul
            id="password-requirement"
            className="-mt-3 grid gap-2 text-[14px] leading-relaxed max-sm:text-[13px]"
            aria-live="polite"
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

          <div className="mt-5 grid gap-5 text-[17px] leading-snug text-[#121722] max-sm:text-[15px]">
            <div className="flex items-start gap-5">
              <input
                id="signup-terms"
                className="mt-0.5 size-[26px] shrink-0 accent-[#ff4b11]"
                type="checkbox"
                required
                aria-required="true"
                aria-describedby="signup-required-fields"
              />
              <label htmlFor="signup-terms">
                <a className="font-semibold underline underline-offset-2" href="#privacy">
                  서비스 이용약관
                </a>
                및{' '}
                <a className="font-semibold underline underline-offset-2" href="#terms">
                  개인정보 처리방침
                </a>
                에 동의합니다.
              </label>
            </div>

            <div className="flex items-start gap-5">
              <input
                id="signup-marketing"
                className="mt-0.5 size-[26px] shrink-0 accent-[#ff4b11]"
                type="checkbox"
                aria-describedby="signup-marketing-description"
              />
              <label htmlFor="signup-marketing">임직원 전용 혜택 알림과 스토어 업데이트를 받겠습니다.</label>
              <p id="signup-marketing-description" className="sr-only">
                선택 입력 항목입니다.
              </p>
            </div>
          </div>

          <button
            className="mt-2 inline-flex h-[70px] w-full items-center justify-center gap-6 bg-[#ff4b11] text-[27px] font-bold text-white hover:bg-[#e83f09] max-sm:h-[60px] max-sm:text-xl"
            type="submit"
          >
            계정 만들기
            <ArrowRight size={30} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </form>

        <p className="mt-[83px] text-center text-[18px] text-[#2d3038] max-sm:mt-12 max-sm:text-[15px]">
          이미 계정이 있으신가요?{' '}
          <Link className="font-extrabold text-[#071431]" to="/">
            로그인하기
          </Link>
        </p>
      </section>

      <footer className="flex min-h-[88px] items-center justify-between gap-8 border-t border-[#dfe3ea] bg-[#f3f6fa] px-20 text-[18px] max-[900px]:flex-col max-[900px]:items-start max-[900px]:px-8 max-[900px]:py-7 max-sm:px-5 max-sm:text-[15px]">
        <p className="m-0 text-[#536984]">© 2024 임직원 전용 스토어. 모든 권리 보유.</p>
        <nav
          className="flex items-center gap-10 whitespace-nowrap text-[#405777] max-[900px]:flex-wrap max-[900px]:gap-x-6 max-[900px]:gap-y-4 max-[900px]:whitespace-normal"
          aria-label="푸터 링크"
        >
          <a href="#privacy">개인정보 처리방침</a>
          <a href="#terms">서비스 이용약관</a>
          <a href="#help">고객센터</a>
        </nav>
      </footer>
    </main>
  )
}

export default SignUpPage
