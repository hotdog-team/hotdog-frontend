import { useState, useEffect } from 'react'
import { Circle, CircleAlert, CircleCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, InputField, Input, Checkbox, PasswordToggleButton, RadioChipGroup, CheckboxChipGroup } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'
import { useNavigate } from 'react-router-dom'
import {
  AGE_OPTIONS,
  JOB_OPTIONS,
  META_TAGS,
  PURPOSE_RADIO_OPTIONS,
  buildProfileTagIds,
  splitProfileTagIds,
} from '../../../constants/profileMetaTags.js'

// 비밀번호 유효성 검사 규칙
const passwordRules = [
  { label: '8자 이상 16자 이하', validate: (value) => value.length >= 8 && value.length <= 16 },
  { label: '영문 소문자 포함', validate: (value) => /[a-z]/.test(value) },
  { label: '영문 대문자 포함', validate: (value) => /[A-Z]/.test(value) },
  { label: '숫자 포함', validate: (value) => /\d/.test(value) },
  { label: '특수문자 포함', validate: (value) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
]

// 유효성 UI 컴포넌트
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

function MyPageProfile() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  // 프로필 상태
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [baseAddress, setBaseAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [isJobRecommendEnabled, setIsJobRecommendEnabled] = useState(true)
  const [ageRange, setAgeRange] = useState('')
  const [jobType, setJobType] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [selectedPurposeId, setSelectedPurposeId] = useState(-1)
  const [selectedMerchandisingIds, setSelectedMerchandisingIds] = useState([])

  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 비밀번호 노출 토글 상태
  const [isCurrentVisible, setIsCurrentVisible] = useState(false)
  const [isNewVisible, setIsNewVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  // 비밀번호 입력 여부 및 유효성 상태 계산
  const hasNewPassword = newPassword.length > 0
  const isConfirmValid = confirmPassword.length > 0 && newPassword === confirmPassword

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get('/api/members/me')
        const data = response.data

        setName(data.name)
        setEmail(data.email)
        setPhone(data.phone || '')
        setZipcode(data.zipCode || '')
        setBaseAddress(data.baseAddress || '')
        setDetailAddress(data.detailAddress || '')
        setIsJobRecommendEnabled(data.isJobRecommendEnabled)
        setAgeRange(data.ageRange || '')
        setJobType(data.jobType || '')

        const { categoryIds, purposeId, merchandisingIds } = splitProfileTagIds(data.profileTagIds || [])
        setSelectedCategoryIds(categoryIds)
        setSelectedPurposeId(purposeId ?? -1)
        setSelectedMerchandisingIds(merchandisingIds)

        setIsLoading(false)
      } catch (err) {
        toast.error('회원 정보를 불러오는 데 실패했습니다.')
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleOpenPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setZipcode(data.zonecode)
          setBaseAddress(data.roadAddress || data.jibunAddress)
          toast.info('우편번호가 입력되었습니다.')
        },
      }).open()
    }
  }

  // 통합 저장 핸들러 (프로필 + 비밀번호)
  const handleUpdateAll = async (e) => {
    e.preventDefault()

    const isPasswordChangeIntent = currentPassword || newPassword || confirmPassword

    if (isPasswordChangeIntent) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return toast.warn('비밀번호를 변경하시려면 현재, 새 비밀번호, 확인란을 모두 입력해 주세요.')
      }
      if (newPassword !== confirmPassword) {
        return toast.error('새 비밀번호가 일치하지 않습니다.')
      }
      const passedRules = passwordRules.filter((rule) => rule.validate(newPassword)).length
      if (passedRules !== passwordRules.length) {
        return toast.error('새 비밀번호가 보안 요구사항을 충족하지 않습니다.')
      }
    }

    const updateData = {
      name,
      phone,
      zipCode: zipcode,
      baseAddress,
      detailAddress,
      ageRange,
      jobType,
      profileTagIds: buildProfileTagIds(
        selectedCategoryIds.filter((id) => id !== null && id !== -1),
        selectedPurposeId !== -1 ? selectedPurposeId : null,
        selectedMerchandisingIds.filter((id) => id !== null && id !== -1),
      ),
      isJobRecommendEnabled: isJobRecommendEnabled,
    }

    try {
      // 1. 프로필 업데이트 요청
      await axiosInstance.patch('/api/members/me', updateData)

      // 2. 비밀번호 업데이트 요청 (입력된 경우만)
      if (isPasswordChangeIntent) {
        await axiosInstance.patch('/api/members/me/password', {
          currentPassword,
          newPassword,
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }

      toast.success(isPasswordChangeIntent ? '프로필과 비밀번호가 성공적으로 변경되었습니다.' : '프로필 정보가 성공적으로 저장되었습니다.')
    } catch (err) {
      toast.error('정보 수정 중 오류가 발생했습니다.')
    }
  }

  const handleWithdraw = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 탈퇴 처리 즉시 세션이 만료되며 강제 로그아웃됩니다.')) {
      try {
        await axiosInstance.delete('/api/members/me')
        toast.warn('회원 탈퇴가 완료되었습니다. 로그인 페이지로 이동합니다.')
        localStorage.clear()
        window.location.href = '/'
      } catch (err) {
        toast.error('탈퇴 처리 중 오류가 발생했습니다.')
      }
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center font-bold text-ink">로딩 중...</div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-ink tracking-tight">내 정보 수정</h2>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => navigate('/mypage/orders')}
          className="font-bold shrink-0"
        >
          주문 내역 보기
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-10 shadow-sm">
        <h3 className="mb-8 text-xl font-bold text-ink border-b border-border-soft pb-4">프로필 및 보안 정보</h3>

        <form className="space-y-6" onSubmit={handleUpdateAll}>
          <div className="grid gap-6">
            <InputField
              id="profile-name"
              label="성함 (변경 불가)"
              size="xl"
              value={name}
              readOnly
              disabled
              inputVariant="muted"
            />
            <InputField
              id="profile-email"
              label="회사 이메일 주소 (변경 불가)"
              size="xl"
              type="email"
              value={email}
              readOnly
              disabled
              inputVariant="muted"
            />
          </div>

          <div className="rounded-lg bg-surface-muted p-6 border border-border-soft space-y-6">
            <h4 className="text-sm font-bold text-ink">비밀번호 변경 (선택사항)</h4>
            <div className="grid gap-6">
              <InputField id="current-password" label="현재 비밀번호" size="xl" type={isCurrentVisible ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="현재 비밀번호" trailing={<PasswordToggleButton visible={isCurrentVisible} onToggle={() => setIsCurrentVisible(!isCurrentVisible)} />} />
              <InputField id="new-password" label="새 비밀번호" size="xl" type={isNewVisible ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새 비밀번호" trailing={<PasswordToggleButton visible={isNewVisible} onToggle={() => setIsNewVisible(!isNewVisible)} labelPrefix="새 비밀번호" />} />
              <InputField id="confirm-password" label="새 비밀번호 확인" size="xl" type={isConfirmVisible ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="새 비밀번호 다시 입력" trailing={<PasswordToggleButton visible={isConfirmVisible} onToggle={() => setIsConfirmVisible(!isConfirmVisible)} labelPrefix="비밀번호 확인" />} />
            </div>
            <ul className="grid gap-2 text-sm pt-2" aria-hidden="true">
              {passwordRules.map((rule) => <PasswordRequirementItem key={rule.label} isActive={hasNewPassword} isValid={rule.validate(newPassword)} label={rule.label} />)}
              <PasswordRequirementItem isActive={confirmPassword.length > 0} isValid={isConfirmValid} label="비밀번호 확인 일치" />
            </ul>
          </div>

          <div className="grid gap-6">
            <InputField id="profile-phone" label="연락처" size="xl" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <div className="grid gap-2.5">
              <label className="text-sm font-extrabold tracking-label text-ink uppercase">우편번호</label>
              <div className="flex gap-3">
                <Input id="profile-zipcode" type="text" placeholder="우편번호" value={zipcode} size="xl" variant="muted" readOnly />
                <Button type="button" variant="secondary" size="md" onClick={handleOpenPostcode} className="shrink-0 font-bold">주소 찾기</Button>
              </div>
            </div>
            <InputField id="profile-base-address" label="기본 주소" size="xl" value={baseAddress} readOnly inputVariant="muted" />
            <InputField id="profile-detail-address" label="상세 주소" size="xl" placeholder="상세 주소를 입력해 주세요." value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} />
          </div>

          <div className="rounded-lg bg-surface-muted p-6 border border-border-soft space-y-6">
            <h4 className="text-sm font-bold text-ink">취향 및 직종 설정</h4>
            <RadioChipGroup
              id="profile-age"
              name="ageRange"
              label="연령대"
              options={AGE_OPTIONS}
              value={ageRange}
              onValueChange={setAgeRange}
              optional
            />
            <RadioChipGroup
              id="profile-job"
              name="jobType"
              label="직종"
              options={JOB_OPTIONS}
              value={jobType}
              onValueChange={setJobType}
            />
            <CheckboxChipGroup
              id="profile-categories"
              label="관심 카테고리 (중복 선택 가능)"
              optional
              options={META_TAGS.CATEGORIES.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              values={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />
            <RadioChipGroup
              id="profile-purpose"
              name="purposeId"
              label="주 이용 목적"
              optional
              options={PURPOSE_RADIO_OPTIONS}
              value={selectedPurposeId ?? ''}
              onValueChange={setSelectedPurposeId}
            />
            <CheckboxChipGroup
              id="profile-merchandising"
              label="선호 상품 성향 (중복 선택 가능)"
              optional
              options={META_TAGS.MERCHANDISING.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              values={selectedMerchandisingIds}
              onChange={setSelectedMerchandisingIds}
            />
          </div>

          <div className="border-t border-border-soft pt-6">
            <Checkbox id="profile-recommend" variant="brand" size="md" checked={isJobRecommendEnabled} onChange={(e) => setIsJobRecommendEnabled(e.target.checked)} label={<><span className="font-bold text-brand">직종 맞춤 상품 추천</span>을 받습니다.</>} />
          </div>

          <div className="mt-8 flex flex-row items-center justify-between border-t border-border-soft pt-8">
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleWithdraw}
              className="underline hover:bg-transparent"
            >
            D-TO 서비스 탈퇴
            </Button>
            <Button type="submit" variant="primary" size="lg" className="w-48 font-bold">프로필 저장</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default MyPageProfile;