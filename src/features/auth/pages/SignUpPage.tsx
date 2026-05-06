import { useState } from 'react'
import { ArrowRight, Circle, CircleAlert, CircleCheck, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLogo from '../components/AuthLogo'

const fieldClass =
  'h-[60px] w-full border border-[#c7ccd6] bg-white px-[30px] text-[21px] text-[#071431] outline-none placeholder:text-[#b0b1b8] focus:border-[#ff4b11] focus:ring-3 focus:ring-[#ff4b11]/15 max-sm:h-[54px] max-sm:px-4 max-sm:text-[17px]'

const labelClass = 'grid gap-2.5 text-[15px] font-extrabold tracking-[0.08em] text-[#071431] uppercase'

const passwordPattern =
  '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>/?]{8,16}'

const passwordRequirement =
  '영문 대문자와 소문자, 숫자, 특수문자를 포함해 8자 이상 16자 이하로 입력해 주세요.'

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
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm

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

        <form className="grid gap-7" onSubmit={(event) => event.preventDefault()}>
          <label className={labelClass}>
            <span>이름</span>
            <input className={fieldClass} type="text" placeholder="홍길동" autoComplete="name" />
          </label>

          <label className={labelClass}>
            <span>임직원 아이디</span>
            <span className="relative block">
              <input className={`${fieldClass} pr-14`} type="text" placeholder="예: 사번-123456" />
              <Info
                className="absolute top-1/2 right-[30px] -translate-y-1/2 text-[#727782] max-sm:right-4"
                size={21}
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>
          </label>

          <label className={labelClass}>
            <span>회사 이메일</span>
            <input className={fieldClass} type="email" placeholder="이름@회사.com" autoComplete="email" />
          </label>

          <div className="grid gap-7">
            <label className={labelClass}>
              <span>비밀번호</span>
              <input
                className={fieldClass}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={16}
                pattern={passwordPattern}
                required
                aria-describedby="password-requirement"
                title={passwordRequirement}
              />
            </label>
            <label className={labelClass}>
              <span>비밀번호 확인</span>
              <input
                className={fieldClass}
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={16}
                pattern={passwordPattern}
                required
                aria-describedby="password-requirement"
                title={passwordRequirement}
              />
            </label>
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
            <label className="flex items-start gap-5">
              <input className="mt-0.5 size-[26px] shrink-0 accent-[#ff4b11]" type="checkbox" />
              <span>
                <a className="font-semibold underline underline-offset-2" href="#privacy">
                  서비스 이용약관
                </a>
                및{' '}
                <a className="font-semibold underline underline-offset-2" href="#terms">
                  개인정보 처리방침
                </a>
                에 동의합니다.
              </span>
            </label>

            <label className="flex items-start gap-5">
              <input className="mt-0.5 size-[26px] shrink-0 accent-[#ff4b11]" type="checkbox" />
              <span>임직원 전용 혜택 알림과 스토어 업데이트를 받겠습니다.</span>
            </label>
          </div>

          <button
            className="mt-2 inline-flex h-[70px] w-full items-center justify-center gap-6 bg-[#ff4b11] text-[27px] font-bold text-white hover:bg-[#e83f09] max-sm:h-[60px] max-sm:text-xl"
            type="submit"
          >
            계정 만들기
            <ArrowRight size={30} strokeWidth={2.2} />
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
