import { useState } from 'react'
import { ArrowRight, Circle, CircleAlert, CircleCheck, Eye, Info, X, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLogo from '../components/AuthLogo.jsx'
import { signup } from '../../../api/authApi.js'
import { Button } from '../../../common/components'

const fieldClass =
  'h-15 w-full border border-border bg-surface px-8 text-xl text-ink outline-none placeholder:text-muted focus:border-brand focus:ring-3 focus:ring-brand/15 max-sm:h-14 max-sm:px-4 max-sm:text-body'

const labelClass = 'grid gap-2.5 text-sm font-extrabold tracking-[0.08em] text-ink uppercase'

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
      className="absolute top-1/2 right-5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-muted hover:bg-surface-muted max-sm:right-3"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <X size={18} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
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
  const statusLabel = !isActive ? '' : isValid ? '충족' : '미충족'

  return (
    <li
      className={`flex items-center gap-2.5 ${statusClass}`}
      aria-label={`${label}${statusLabel ? ` — ${statusLabel}` : ''}`}
    >
      <Icon className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
      <span aria-hidden="true">{label}</span>
    </li>
  )
}

const AGE_OPTIONS = ['20대', '30대', '40대', '50대', '60대 이상']
const JOB_OPTIONS = ['사무', '영업', '현장', '의료', '교육', '기타']

const META_TAGS = {
  CATEGORIES: [
    { id: 1, name: '건강' }, { id: 2, name: '교육' }, { id: 3, name: '여행' }, { id: 4, name: '선물' }, { id: 5, name: '가전' },
  ],
  PURPOSES: [
    { id: 6, name: '나를 위한 구매' }, { id: 7, name: '선물용' }, { id: 8, name: '가족/아이' }, { id: 9, name: '업무/직장' }, { id: 10, name: '취미/여가' },
  ],
  MERCHANDISING: [
    { id: 11, name: '가성비' }, { id: 12, name: '고품질' }, { id: 13, name: '실용적' }, { id: 14, name: '트렌디' }, { id: 15, name: '친환경' },
  ],
}

function SignUpPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)

  const [ageRange, setAgeRange] = useState('')
  const [jobType, setJobType] = useState('')

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [isCategoryUnknown, setIsCategoryUnknown] = useState(false)
  const [selectedPurposeId, setSelectedPurposeId] = useState(null)

  const [selectedMerchandisingIds, setSelectedMerchandisingIds] = useState([])
  const [isMerchandisingUnknown, setIsMerchandisingUnknown] = useState(false)

  const [isJobRecommendEnabled, setIsJobRecommendEnabled] = useState(false)

  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

  const toggleCategory = (id) => {
    if (id === 'UNKNOWN') {
      setIsCategoryUnknown(true)
      setSelectedCategoryIds([])
    } else {
      setIsCategoryUnknown(false)
      setSelectedCategoryIds((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
      )
    }
  }

  const handlePurpose = (id) => {
    setSelectedPurposeId(id === 'UNKNOWN' ? -1 : id)
  }

  const toggleMerchandising = (id) => {
    if (id === 'UNKNOWN') {
      setIsMerchandisingUnknown(true)
      setSelectedMerchandisingIds([])
    } else {
      setIsMerchandisingUnknown(false)
      setSelectedMerchandisingIds((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validCategoryIds = selectedCategoryIds.filter((id) => id !== null && id !== -1)
    const validMerchandisingIds = selectedMerchandisingIds.filter((id) => id !== null && id !== -1)

    const signupData = {
      email,
      password,
      name,
      ageRange,
      jobType,
      purposeId: selectedPurposeId !== -1 ? selectedPurposeId : null,
      categoryTagIds: validCategoryIds,
      merchandisingTagIds: validMerchandisingIds,
      isJobRecommendEnabled,
    }

    try {
      await signup(signupData)
      toast.success('회원가입이 완료되었습니다!')
      navigate('/')
    } catch (err) {
      toast.error(err.message ?? '서버 연결 중 오류가 발생했습니다.')
    }
  }

  const tagButtonClass = (selected) =>
    `flex items-center gap-2 px-4 py-2 rounded-full border text-body font-semibold transition-all ${
      selected ? 'bg-brand/10 text-brand border-brand' : 'bg-surface text-muted border-border'
    }`

  const plainTagButtonClass = (selected) =>
    `px-4 py-2 rounded-full border text-body font-semibold transition-all ${
      selected ? 'bg-brand/10 text-brand border-brand' : 'bg-surface text-muted border-border'
    }`

  return (
    <main className="flex min-h-svh flex-col bg-page text-body">
      <section
        className="mx-auto w-full max-w-155 flex-1 px-5 pt-24 pb-16 max-sm:px-4 max-sm:pt-14 max-sm:pb-10"
        aria-labelledby="signup-title"
      >
        <AuthLogo className="mx-auto mb-16 h-12 max-sm:mb-12 max-sm:h-10" />

        <div className="mb-13">
          <h1 id="signup-title" className="mb-4 text-4xl leading-tight font-extrabold text-ink max-sm:text-3xl">
            계정 만들기
          </h1>
          <p className="text-2xl leading-snug text-body max-sm:text-lg">
            인증을 시작하려면 정보를 입력해 주세요.
          </p>
        </div>

        <form className="grid gap-7" onSubmit={handleSubmit}>
          <p id="signup-required-fields" className="sr-only">
            이름, 임직원 아이디, 회사 이메일, 비밀번호, 비밀번호 확인, 직종, 서비스 이용약관 동의는 필수 입력 항목입니다.
          </p>

          <div className={labelClass}>
            <label htmlFor="signup-name">이름</label>
            <span className="relative block">
              <input
                id="signup-name"
                className={`${fieldClass} ${name ? 'pr-14' : ''}`}
                type="text"
                placeholder="홍길동"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                aria-required="true"
                aria-describedby="signup-name-description"
              />
              {name && <ClearButton label="이름 지우기" onClick={() => setName('')} />}
            </span>
            <p id="signup-name-description" className="sr-only">이름은 필수 입력 항목입니다.</p>
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
                aria-describedby="signup-employee-id-description"
              />
              <Info
                className={`absolute top-1/2 -translate-y-1/2 text-muted ${
                  employeeId ? 'right-18 max-sm:right-14' : 'right-8 max-sm:right-4'
                }`}
                size={21}
                strokeWidth={2}
                aria-hidden="true"
              />
              {employeeId && <ClearButton label="임직원 아이디 지우기" onClick={() => setEmployeeId('')} />}
            </span>
            <p id="signup-employee-id-description" className="sr-only">회사에서 발급한 사번 또는 임직원 아이디를 입력하세요.</p>
          </div>

          <div className={labelClass}>
            <label htmlFor="signup-email">회사 이메일</label>
            <span className="relative block">
              <input
                id="signup-email"
                className={`${fieldClass} ${email ? 'pr-14' : ''}`}
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
            <p id="signup-email-description" className="sr-only">회사 이메일은 필수 입력 항목입니다.</p>
            {isEmailInvalid && (
              <p id="signup-email-error" className="text-sm font-semibold tracking-normal text-error" role="alert">
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
                  className={`${fieldClass} pr-14`}
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={16}
                  required
                  aria-required="true"
                  aria-describedby="signup-password-description password-requirement-list"
                />
                <button
                  className="absolute top-1/2 right-5 -translate-y-1/2"
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                  aria-pressed={isPasswordVisible}
                >
                  <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </span>
              <p id="signup-password-description" className="sr-only">비밀번호는 필수 입력 항목입니다. {passwordRequirement}</p>
            </div>

            <div className={labelClass}>
              <label htmlFor="signup-password-confirm">비밀번호 확인</label>
              <span className="relative block">
                <input
                  id="signup-password-confirm"
                  className={`${fieldClass} pr-14`}
                  type={isPasswordConfirmVisible ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={16}
                  required
                  aria-required="true"
                  aria-describedby="signup-password-confirm-description"
                />
                <button
                  className="absolute top-1/2 right-5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-muted hover:bg-surface-muted max-sm:right-3"
                  type="button"
                  onClick={() => setIsPasswordConfirmVisible(!isPasswordConfirmVisible)}
                  aria-label={isPasswordConfirmVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                  aria-pressed={isPasswordConfirmVisible}
                >
                  <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </span>
              <p id="signup-password-confirm-description" className="sr-only">위에서 입력한 비밀번호와 동일하게 입력해 주세요.</p>
            </div>
          </div>

          <ul
            id="password-requirement-list"
            className="-mt-3 grid gap-2 text-sm leading-relaxed max-sm:text-xs"
            aria-label="비밀번호 요구사항"
            aria-live="polite"
            aria-atomic="false"
            aria-relevant="text"
          >
            {passwordRules.map((rule) => (
              <PasswordRequirementItem key={rule.label} isActive={hasPassword} isValid={rule.validate(password)} label={rule.label} />
            ))}
            <PasswordRequirementItem isActive={hasPasswordConfirm} isValid={isPasswordConfirmValid} label="비밀번호 확인 일치" />
          </ul>

          <div className="mt-6 border-t border-border-soft pt-10">
            <h2 className="mb-8 text-3xl font-bold text-ink">맞춤 추천 정보</h2>
            <div className="grid gap-10">
              <div className={labelClass}>
                <label id="label-age">연령대</label>
                <div className="flex flex-wrap gap-3" role="group" aria-labelledby="label-age">
                  {AGE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAgeRange(opt)}
                      className={`h-12 px-6 text-body font-bold border transition-all ${ageRange === opt ? 'bg-brand text-white border-brand' : 'bg-surface text-muted border-border'}`}
                      aria-pressed={ageRange === opt}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className={labelClass}>
                <label htmlFor="signup-job">직종</label>
                <select id="signup-job" className={fieldClass} value={jobType} onChange={(e) => setJobType(e.target.value)} required aria-required="true">
                  <option value="">직종을 선택해 주세요</option>
                  {JOB_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className={labelClass}>
                <label id="label-category">제일 관심 있는 카테고리는 무엇인가요? (중복 선택 가능)</label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="label-category">
                  {META_TAGS.CATEGORIES.map((tag) => (
                    <button key={tag.id} type="button" onClick={() => toggleCategory(tag.id)} className={tagButtonClass(selectedCategoryIds.includes(tag.id))} aria-pressed={selectedCategoryIds.includes(tag.id)}>
                      {selectedCategoryIds.includes(tag.id) && <Check size={16} aria-hidden="true" />}
                      {tag.name}
                    </button>
                  ))}
                  <button type="button" onClick={() => toggleCategory('UNKNOWN')} className={plainTagButtonClass(isCategoryUnknown)} aria-pressed={isCategoryUnknown}>모르겠어요</button>
                </div>
              </div>

              <div className={labelClass}>
                <label id="label-purpose">무슨 상황에서 주로 사용하실 예정인가요?</label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="label-purpose">
                  {META_TAGS.PURPOSES.map((tag) => (
                    <button key={tag.id} type="button" onClick={() => handlePurpose(tag.id)} className={tagButtonClass(selectedPurposeId === tag.id)} aria-pressed={selectedPurposeId === tag.id}>
                      {selectedPurposeId === tag.id && <Check size={16} aria-hidden="true" />}
                      {tag.name}
                    </button>
                  ))}
                  <button type="button" onClick={() => handlePurpose('UNKNOWN')} className={plainTagButtonClass(selectedPurposeId === -1)} aria-pressed={selectedPurposeId === -1}>모르겠어요</button>
                </div>
              </div>

              <div className={labelClass}>
                <label id="label-preference">어떤 상품을 주로 선호하시나요? (중복 선택 가능)</label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="label-preference">
                  {META_TAGS.MERCHANDISING.map((tag) => (
                    <button key={tag.id} type="button" onClick={() => toggleMerchandising(tag.id)} className={tagButtonClass(selectedMerchandisingIds.includes(tag.id))} aria-pressed={selectedMerchandisingIds.includes(tag.id)}>
                      {selectedMerchandisingIds.includes(tag.id) && <Check size={16} aria-hidden="true" />}
                      {tag.name}
                    </button>
                  ))}
                  <button type="button" onClick={() => toggleMerchandising('UNKNOWN')} className={plainTagButtonClass(isMerchandisingUnknown)} aria-pressed={isMerchandisingUnknown}>모르겠어요</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 text-body leading-snug text-ink max-sm:text-sm">
            <div>
              <div className="flex items-start gap-5">
                <input id="signup-terms" className="mt-0.5 size-6 shrink-0 accent-brand" type="checkbox" required aria-required="true" aria-describedby="signup-terms-desc" />
                <label htmlFor="signup-terms">
                  <a className="font-semibold underline underline-offset-2" href="#privacy">서비스 이용약관</a> 및{' '}
                  <a className="font-semibold underline underline-offset-2" href="#terms">개인정보 처리방침</a>에 동의합니다.
                </label>
              </div>
              <p id="signup-terms-desc" className="sr-only">필수 이용약관 동의 항목입니다.</p>
            </div>

            <div className="flex items-start gap-5">
              <input
                id="signup-recommend-agree"
                className="mt-0.5 size-6 shrink-0 accent-brand"
                type="checkbox"
                checked={isJobRecommendEnabled}
                onChange={(e) => setIsJobRecommendEnabled(e.target.checked)}
              />
              <label htmlFor="signup-recommend-agree">
                <span className="font-bold text-brand"></span>{' '}
                나의 직종에 맞는 맞춤 상품 추천 서비스를 이용하겠습니다.
              </label>
            </div>

            <div className="flex items-start gap-5">
              <input id="signup-marketing" className="mt-0.5 size-6 shrink-0 accent-brand" type="checkbox" />
              <label htmlFor="signup-marketing">임직원 전용 혜택 알림과 스토어 업데이트를 받겠습니다.</label>
            </div>
          </div>

          <Button className="mt-2 gap-3" type="submit" variant="primary" size="lg" fullWidth>
            계정 만들기
            <ArrowRight size={24} strokeWidth={2.2} aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-21 text-center text-body-lg text-body max-sm:mt-12 max-sm:text-sm">
          이미 계정이 있으신가요?{' '}
          <Link className="font-extrabold text-ink" to="/">로그인하기</Link>
        </p>
      </section>
    </main>
  )
}

export default SignUpPage
