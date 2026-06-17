import { useState, useEffect } from 'react'
import { Circle, CircleAlert, CircleCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Button,
  InputField,
  Input,
  Checkbox,
  PasswordToggleButton,
  RadioChipGroup,
  CheckboxChipGroup,
} from '../../../components/index.js'
import {
  MyPageHeader,
  MyPagePanel,
  MyPageSectionTitle,
  MyPageLoading,
} from '../../../components/mypage/MyPageUi.jsx'
import axiosInstance from '../../../api/axiosInstance.js'
import {
  AGE_OPTIONS,
  JOB_OPTIONS,
  META_TAGS,
  PURPOSE_RADIO_OPTIONS,
  buildProfileTagIds,
  splitProfileTagIds,
} from '../../../constants/profileMetaTags.js'

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

function MyPageProfile() {
  const [isLoading, setIsLoading] = useState(true)
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
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isCurrentVisible, setIsCurrentVisible] = useState(false)
  const [isNewVisible, setIsNewVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

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
      } catch {
        toast.error('회원 정보를 불러오는 데 실패했습니다.')
      } finally {
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
    if (window.daum?.Postcode) {
      new window.daum.Postcode({
        oncomplete(data) {
          setZipcode(data.zonecode)
          setBaseAddress(data.roadAddress || data.jibunAddress)
          toast.info('우편번호가 입력되었습니다.')
        },
      }).open()
    }
  }

  const handleUpdateAll = async (event) => {
    event.preventDefault()

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

    try {
      await axiosInstance.patch('/api/members/me', {
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
        isJobRecommendEnabled,
      })

      if (isPasswordChangeIntent) {
        await axiosInstance.patch('/api/members/me/password', {
          currentPassword,
          newPassword,
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }

      toast.success(
        isPasswordChangeIntent
          ? '프로필과 비밀번호가 저장되었습니다.'
          : '프로필 정보가 저장되었습니다.',
      )
    } catch {
      toast.error('정보 수정 중 오류가 발생했습니다.')
    }
  }

  const handleWithdraw = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 탈퇴 후에는 로그인할 수 없습니다.')) {
      return
    }

    try {
      await axiosInstance.delete('/api/members/me')
      toast.warn('회원 탈퇴가 완료되었습니다.')
      localStorage.clear()
      window.location.href = '/login'
    } catch {
      toast.error('탈퇴 처리 중 오류가 발생했습니다.')
    }
  }

  if (isLoading) {
    return <MyPageLoading label="회원 정보를 불러오는 중입니다." />
  }

  return (
    <>
      <MyPageHeader
        title="내 정보 수정"
        description="기본 정보, 비밀번호, 맞춤 추천 설정을 관리합니다."
      />

      <form className="grid gap-6" onSubmit={handleUpdateAll}>
        <MyPagePanel>
          <MyPageSectionTitle title="기본 정보" />
          <div className="grid gap-5">
            <InputField
              id="profile-name"
              label="이름"
              size="md"
              value={name}
              readOnly
              disabled
              inputVariant="muted"
            />
            <InputField
              id="profile-email"
              label="이메일"
              size="md"
              type="email"
              value={email}
              readOnly
              disabled
              inputVariant="muted"
            />
            <InputField
              id="profile-phone"
              label="연락처"
              size="md"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="연락처를 입력하세요"
            />
            <div className="grid gap-2">
              <span className="text-body font-semibold text-ink">우편번호</span>
              <div className="flex gap-2">
                <Input
                  id="profile-zipcode"
                  type="text"
                  placeholder="우편번호"
                  value={zipcode}
                  size="md"
                  variant="muted"
                  readOnly
                  aria-label="우편번호"
                />
                <Button type="button" variant="outline" size="md" onClick={handleOpenPostcode} className="shrink-0">
                  주소 찾기
                </Button>
              </div>
            </div>
            <InputField
              id="profile-base-address"
              label="기본 주소"
              size="md"
              value={baseAddress}
              readOnly
              inputVariant="muted"
            />
            <InputField
              id="profile-detail-address"
              label="상세 주소"
              size="md"
              placeholder="상세 주소를 입력해 주세요"
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
            />
          </div>
        </MyPagePanel>

        <MyPagePanel>
          <MyPageSectionTitle title="비밀번호 변경" description="변경할 때만 입력하세요." />
          <div className="grid gap-5">
            <InputField
              id="current-password"
              label="현재 비밀번호"
              size="md"
              type={isCurrentVisible ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              trailing={
                <PasswordToggleButton
                  visible={isCurrentVisible}
                  onToggle={() => setIsCurrentVisible((current) => !current)}
                />
              }
            />
            <InputField
              id="new-password"
              label="새 비밀번호"
              size="md"
              type={isNewVisible ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              trailing={
                <PasswordToggleButton
                  visible={isNewVisible}
                  onToggle={() => setIsNewVisible((current) => !current)}
                  labelPrefix="새 비밀번호"
                />
              }
            />
            <InputField
              id="confirm-password"
              label="새 비밀번호 확인"
              size="md"
              type={isConfirmVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              trailing={
                <PasswordToggleButton
                  visible={isConfirmVisible}
                  onToggle={() => setIsConfirmVisible((current) => !current)}
                  labelPrefix="비밀번호 확인"
                />
              }
            />
          </div>
          <ul className="mt-4 grid gap-1.5" aria-hidden="true">
            {passwordRules.map((rule) => (
              <PasswordRequirementItem
                key={rule.label}
                isActive={hasNewPassword}
                isValid={rule.validate(newPassword)}
                label={rule.label}
              />
            ))}
            <PasswordRequirementItem
              isActive={confirmPassword.length > 0}
              isValid={isConfirmValid}
              label="비밀번호 확인 일치"
            />
          </ul>
        </MyPagePanel>

        <MyPagePanel>
          <MyPageSectionTitle title="맞춤 추천 정보" description="취향에 맞는 상품 추천에 활용됩니다." />
          <div className="grid gap-6 [&>fieldset]:mt-2 [&>fieldset:first-of-type]:mt-0">
            <RadioChipGroup
              id="profile-age"
              name="ageRange"
              label="연령대"
              options={AGE_OPTIONS}
              value={ageRange}
              onValueChange={setAgeRange}
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
              label="관심 카테고리"
              labelDescription="중복 선택 가능"
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
              label="주로 사용하는 목적"
              options={PURPOSE_RADIO_OPTIONS}
              value={selectedPurposeId ?? ''}
              onValueChange={setSelectedPurposeId}
            />
            <CheckboxChipGroup
              id="profile-merchandising"
              label="선호하는 상품 유형"
              labelDescription="중복 선택 가능"
              options={META_TAGS.MERCHANDISING.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              values={selectedMerchandisingIds}
              onChange={setSelectedMerchandisingIds}
            />
          </div>
          <div className="mt-6 border-t border-border-soft pt-5">
            <Checkbox
              id="profile-recommend"
              variant="brand"
              size="md"
              checked={isJobRecommendEnabled}
              onChange={(event) => setIsJobRecommendEnabled(event.target.checked)}
              label="직종에 맞는 맞춤 상품 추천을 받겠습니다."
            />
          </div>
        </MyPagePanel>

        <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="danger" size="sm" onClick={handleWithdraw}>
            회원 탈퇴
          </Button>
          <Button type="submit" variant="primary" size="md" className="sm:min-w-40">
            저장하기
          </Button>
        </div>
      </form>
    </>
  )
}

export default MyPageProfile
