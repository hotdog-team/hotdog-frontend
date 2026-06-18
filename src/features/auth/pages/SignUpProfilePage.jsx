import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLogo from '../components/AuthLogo.jsx'
import axiosInstance from '../../../api/axiosInstance.js'
import {
  Button,
  Checkbox,
  CheckboxChipGroup,
  RadioChipGroup,
} from '../../../components/index.js'
import {
  AGE_OPTIONS,
  JOB_OPTIONS,
  META_TAGS,
  PURPOSE_RADIO_OPTIONS,
  buildProfileTagIds,
} from '../../../constants/profileMetaTags.js'

function SignUpProfilePage() {
  const navigate = useNavigate()

  const [ageRange, setAgeRange] = useState('')
  const [jobType, setJobType] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [isCategoryUnknown, setIsCategoryUnknown] = useState(false)
  const [selectedPurposeId, setSelectedPurposeId] = useState(null)
  const [selectedMerchandisingIds, setSelectedMerchandisingIds] = useState([])
  const [isMerchandisingUnknown, setIsMerchandisingUnknown] = useState(false)
  const [isJobRecommendEnabled, setIsJobRecommendEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const validCategoryIds = selectedCategoryIds.filter((id) => id !== null && id !== -1)
    const validMerchandisingIds = selectedMerchandisingIds.filter((id) => id !== null && id !== -1)
    const purposeId = selectedPurposeId !== -1 ? selectedPurposeId : null

    try {
      await axiosInstance.patch('/api/members/me', {
        ageRange: ageRange || null,
        jobType: jobType || null,
        profileTagIds: buildProfileTagIds(validCategoryIds, purposeId, validMerchandisingIds),
        isJobRecommendEnabled,
      })
      toast.success('맞춤 추천 정보가 저장되었습니다.')
      navigate('/home', { replace: true })
    } catch {
      toast.error('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    navigate('/home', { replace: true })
  }

  return (
    <main className="flex min-h-svh flex-col bg-page text-foreground">
      <section
        className="layout-container-auth layout-container-auth--lg flex flex-1 flex-col justify-center py-10 max-sm:py-8"
        aria-labelledby="signup-profile-title"
      >
        <AuthLogo className="mx-auto mb-0 h-12 max-sm:mb-6" />

        <div className="mx-auto w-full max-w-2xl rounded-lg bg-surface px-6 py-8 shadow-card max-sm:px-5 max-sm:py-6">
          <h1
            id="signup-profile-title"
            className="text-center text-3xl font-light tracking-wide text-ink max-sm:text-xl"
          >
            맞춤 추천 정보
          </h1>
          <p className="mt-2 mb-8 text-center text-body-sm leading-relaxed text-muted">
            입력하시면 더 정확한 상품 추천을 받을 수 있습니다.
          </p>

          <form className="grid gap-6 [&>fieldset]:mt-2 [&>fieldset:first-of-type]:mt-0" onSubmit={handleSubmit}>
            <RadioChipGroup
              id="signup-profile-age"
              name="ageRange"
              label="연령대"
              options={AGE_OPTIONS}
              value={ageRange}
              onValueChange={setAgeRange}
            />

            <RadioChipGroup
              id="signup-profile-job"
              name="jobType"
              label="직종"
              options={JOB_OPTIONS}
              value={jobType}
              onValueChange={setJobType}
            />

            <CheckboxChipGroup
              id="signup-profile-categories"
              label="관심 카테고리"
              labelDescription="중복 선택 가능"
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
              id="signup-profile-purpose"
              name="purposeId"
              label="주로 사용하는 목적"
              options={PURPOSE_RADIO_OPTIONS}
              value={selectedPurposeId ?? ''}
              onValueChange={setSelectedPurposeId}
            />

            <CheckboxChipGroup
              id="signup-profile-merchandising"
              label="선호하는 상품 유형"
              labelDescription="중복 선택 가능"
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

            <Checkbox
              id="signup-profile-recommend-agree"
              variant="brand"
              size="md"
              checked={isJobRecommendEnabled}
              onChange={(event) => setIsJobRecommendEnabled(event.target.checked)}
              label="직종에 맞는 맞춤 상품 추천을 받겠습니다."
            />

            <div className="grid gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" fullWidth loading={isSubmitting}>
                쇼핑을 시작하기
              </Button>
              <Button type="button" variant="ghost" size="md" fullWidth onClick={handleSkip}>
                나중에 하기
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default SignUpProfilePage
