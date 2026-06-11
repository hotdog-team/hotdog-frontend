import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Circle, CircleAlert, CircleCheck, Info } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLogo from '../components/AuthLogo.jsx'
import { signup } from '../../../api/authApi.js'
import { useAuthStore } from '../../../store/useAuthStore.js'
import {
  Button,
  Checkbox,
  CheckboxChipGroup,
  InputClearButton,
  InputField,
  PasswordToggleButton,
  RadioChipGroup,
} from '../../../components/index.js'
import {
  AGE_OPTIONS,
  JOB_OPTIONS,
  META_TAGS,
  PURPOSE_RADIO_OPTIONS,
} from '../../../constants/profileMetaTags.js'

const authInputClass = 'px-8 max-sm:px-4'

const passwordRequirement =
  '영문 대문자와 소문자, 숫자, 특수문자를 포함해 8자 이상 16자 이하로 입력해 주세요.'

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
    <li className={`flex items-center gap-2.5 ${statusClass}`}>
      <Icon className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
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
    const matches = password === passwordConfirm
    parts.push(matches ? '비밀번호 확인이 일치합니다.' : '비밀번호 확인이 일치하지 않습니다.')
  }

  return parts.join(' ')
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
  const [submitError, setSubmitError] = useState('')

  const submitErrorRef = useRef(null)

  const hasPassword = password.length > 0
  const hasPasswordConfirm = passwordConfirm.length > 0
  const isPasswordConfirmValid = hasPasswordConfirm && password === passwordConfirm
  const isEmailInvalid = email.length > 0 && !isValidEmail(email)

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

    const validCategoryIds = selectedCategoryIds.filter((id) => id !== null && id !== -1)
    const validMerchandisingIds = selectedMerchandisingIds.filter((id) => id !== null && id !== -1)
    const purposeId = selectedPurposeId !== -1 ? selectedPurposeId : null

    const tempSocialUser = useAuthStore.getState().tempSocialUser;

    const signupData = {
      email,
      password,
      name,
      ageRange,
      jobType,
      profileTagIds: [
        ...validCategoryIds,
        ...(purposeId != null ? [purposeId] : []),
        ...validMerchandisingIds,
      ],
      isJobRecommendEnabled,
      provider: tempSocialUser?.provider || null,
      providerId: tempSocialUser?.providerId || null,
    }

    try {
      await signup(signupData)

      useAuthStore.setState({ tempSocialUser: null });

      toast.success('회원가입이 완료되었습니다!')
      navigate('/')
    } catch (err) {
      setSubmitError(err.message ?? '서버 연결 중 오류가 발생했습니다.')
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth layout-container-auth--lg flex flex-1 flex-col pt-24 pb-16 max-sm:pt-14 max-sm:pb-10"
        aria-labelledby="signup-title"
      >
        <AuthLogo className="mx-auto mb-16 h-12 max-sm:mb-12 max-sm:h-10" />

        <div className="mb-13">
          <h1 id="signup-title" className="mb-4 text-4xl leading-tight font-extrabold text-ink max-sm:text-3xl">
            계정 만들기
          </h1>
          <p className="text-2xl leading-snug text-foreground max-sm:text-lg">
            인증을 시작하려면 정보를 입력해 주세요.
          </p>
        </div>

        <form className="grid gap-7" aria-labelledby="signup-title" onSubmit={handleSubmit}>
          <p id="signup-required-fields" className="sr-only">
            이름, 임직원 아이디, 회사 이메일, 비밀번호, 비밀번호 확인, 직종, 서비스 이용약관 동의는 필수 입력 항목입니다.
          </p>

          {submitError && (
            <div
              ref={submitErrorRef}
              role="alert"
              tabIndex={-1}
              className="rounded border border-error bg-error/5 px-5 py-4 font-semibold text-error outline-none focus-visible:ring-3 focus-visible:ring-error/25"
            >
              {submitError}
            </div>
          )}

          <InputField
            id="signup-name"
            label="이름"
            labelVariant="auth"
            size="xl"
            inputClassName={authInputClass}
            placeholder="홍길동"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            describedBy="signup-name-description"
            trailing={name ? <InputClearButton label="이름 지우기" onClick={() => setName('')} /> : null}
          />
          <p id="signup-name-description" className="sr-only">
            이름은 필수 입력 항목입니다.
          </p>

          <InputField
            id="signup-employee-id"
            label="임직원 아이디"
            labelVariant="auth"
            size="xl"
            inputClassName={`${authInputClass} ${employeeId ? 'pr-24' : 'pr-14'}`}
            placeholder="예: 사번-123456"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            required
            describedBy="signup-employee-id-description"
            trailing={
              <>
                <Info size={21} strokeWidth={2} className="text-muted" aria-hidden="true" />
                {employeeId ? (
                  <InputClearButton label="임직원 아이디 지우기" onClick={() => setEmployeeId('')} />
                ) : null}
              </>
            }
          />
          <p id="signup-employee-id-description" className="sr-only">
            회사에서 발급한 사번 또는 임직원 아이디를 입력하세요.
          </p>

          <InputField
            id="signup-email"
            label="회사 이메일"
            labelVariant="auth"
            size="xl"
            inputClassName={authInputClass}
            type="email"
            placeholder="이름@회사.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            invalid={isEmailInvalid}
            error={isEmailInvalid ? '회사 이메일 형식이 올바르지 않습니다.' : undefined}
            describedBy={
              isEmailInvalid
                ? 'signup-required-fields signup-email-error'
                : 'signup-required-fields signup-email-description'
            }
            trailing={email ? <InputClearButton label="회사 이메일 지우기" onClick={() => setEmail('')} /> : null}
          />
          <p id="signup-email-description" className="sr-only">
            회사 이메일은 필수 입력 항목입니다.
          </p>

          <div className="grid gap-7">
            <InputField
              id="signup-password"
              label="비밀번호"
              labelVariant="auth"
              size="xl"
              inputClassName={authInputClass}
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={16}
              required
              describedBy="signup-password-description password-requirement-summary"
              trailing={
                <PasswordToggleButton
                  visible={isPasswordVisible}
                  onToggle={() => setIsPasswordVisible((current) => !current)}
                />
              }
            />
            <p id="signup-password-description" className="sr-only">
              비밀번호는 필수 입력 항목입니다. {passwordRequirement}
            </p>

            <InputField
              id="signup-password-confirm"
              label="비밀번호 확인"
              labelVariant="auth"
              size="xl"
              inputClassName={authInputClass}
              type={isPasswordConfirmVisible ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={16}
              required
              describedBy="signup-password-confirm-description password-requirement-summary"
              trailing={
                <PasswordToggleButton
                  visible={isPasswordConfirmVisible}
                  labelPrefix="비밀번호 확인"
                  onToggle={() => setIsPasswordConfirmVisible((current) => !current)}
                />
              }
            />
            <p id="signup-password-confirm-description" className="sr-only">
              위에서 입력한 비밀번호와 동일하게 입력해 주세요.
            </p>
          </div>

          <p
            id="password-requirement-summary"
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {passwordStatusSummary}
          </p>

          <ul
            id="password-requirement-list"
            className="-mt-3 grid gap-2 text-sm leading-relaxed max-sm:text-xs"
            aria-hidden="true"
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

          <div className="mt-6 border-t border-border-soft pt-10">
            <p id="signup-recommend-intro" className="mb-2 text-muted">
              직종은 필수입니다. 연령대·카테고리·사용 목적·선호 항목은 모두 선택 사항입니다.
            </p>
            <h2
              id="signup-recommend-heading"
              className="mb-8 text-3xl font-bold text-ink"
              aria-describedby="signup-recommend-intro"
            >
              맞춤 추천 정보
            </h2>
            <div className="grid gap-10">
              <RadioChipGroup
                id="signup-age"
                name="ageRange"
                label="연령대"
                options={AGE_OPTIONS}
                value={ageRange}
                onValueChange={setAgeRange}
                optional
              />

              <RadioChipGroup
                id="signup-job"
                name="jobType"
                label="직종"
                options={JOB_OPTIONS}
                value={jobType}
                onValueChange={setJobType}
                required
              />

              <CheckboxChipGroup
                id="signup-categories"
                label="제일 관심 있는 카테고리는 무엇인가요? (중복 선택 가능)"
                optional
                options={META_TAGS.CATEGORIES.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                values={selectedCategoryIds}
                onChange={setSelectedCategoryIds}
                unknownLabel="모르겠어요"
                unknownChecked={isCategoryUnknown}
                onUnknownChange={setIsCategoryUnknown}
              />

              <RadioChipGroup
                id="signup-purpose"
                name="purposeId"
                label="무슨 상황에서 주로 사용하실 예정인가요?"
                options={PURPOSE_RADIO_OPTIONS}
                value={selectedPurposeId ?? ''}
                onValueChange={setSelectedPurposeId}
                optional
              />

              <CheckboxChipGroup
                id="signup-merchandising"
                label="어떤 상품을 주로 선호하시나요? (중복 선택 가능)"
                optional
                options={META_TAGS.MERCHANDISING.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                values={selectedMerchandisingIds}
                onChange={setSelectedMerchandisingIds}
                unknownLabel="모르겠어요"
                unknownChecked={isMerchandisingUnknown}
                onUnknownChange={setIsMerchandisingUnknown}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-5 leading-snug max-sm:text-sm">
            <div>
              <Checkbox
                id="signup-terms"
                variant="brand"
                size="md"
                required
                aria-required="true"
                describedBy="signup-terms-desc"
                label={
                  <>
                    <a className="font-semibold underline underline-offset-2" href="#privacy">
                      서비스 이용약관
                    </a>{' '}
                    및{' '}
                    <a className="font-semibold underline underline-offset-2" href="#terms">
                      개인정보 처리방침
                    </a>
                    에 동의합니다.
                  </>
                }
              />
              <p id="signup-terms-desc" className="sr-only">
                필수 이용약관 동의 항목입니다.
              </p>
            </div>

            <Checkbox
              id="signup-recommend-agree"
              variant="brand"
              size="md"
              checked={isJobRecommendEnabled}
              onChange={(event) => setIsJobRecommendEnabled(event.target.checked)}
              label="나의 직종에 맞는 맞춤 상품 추천 서비스를 이용하겠습니다."
            />

            <Checkbox
              id="signup-marketing"
              variant="brand"
              size="md"
              label="임직원 전용 혜택 알림과 스토어 업데이트를 받겠습니다."
            />
          </div>

          <Button className="mt-2 gap-3" type="submit" variant="primary" size="lg" fullWidth>
            계정 만들기
            <ArrowRight size={24} strokeWidth={2.2} aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-21 text-center text-body-lg text-foreground max-sm:mt-12 max-sm:text-sm">
          이미 계정이 있으신가요?{' '}
          <Link className="font-extrabold text-ink" to="/">
            로그인하기
          </Link>
        </p>
      </section>
    </main>
  )
}

export default SignUpPage