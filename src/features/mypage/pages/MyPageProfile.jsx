import { useState, useEffect } from 'react'
import { User, Lock, Edit2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js';
import { useAuthStore } from '../../../store/useAuthStore.js';

const fieldClass =
  'h-input-lg w-full border border-border bg-surface px-8 text-xl text-ink outline-none placeholder:text-muted focus:border-brand focus:ring-3 focus:ring-brand/15 max-sm:h-14 max-sm:px-4 max-sm:text-body'
const labelClass = 'grid gap-2.5 text-sm font-extrabold tracking-label text-ink uppercase'
const disabledStyle = 'bg-surface-muted text-muted cursor-not-allowed border-border-soft'

function MyPageProfile() {
  const [isLoading, setIsLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [baseAddress, setBaseAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [isJobRecommendEnabled, setIsJobRecommendEnabled] = useState(true)

const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
          const response = await axiosInstance.get('/api/members/me');
          console.log("=== 서버 응답 전체 확인 ===", response);
          console.log("=== response.data 내용 ===", response.data);
        const data = response.data;

        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || '');
        setZipcode(data.zipCode || '');
        setBaseAddress(data.baseAddress || '');
        setDetailAddress(data.detailAddress || '');
        setIsJobRecommendEnabled(data.isJobRecommendEnabled);

        setUser({ email: data.email, name: data.name });

        setIsLoading(false);
      } catch (err) {
          console.error("API 호출 에러:", err);
        toast.error('회원 정보를 불러오는 데 실패했습니다.')
        setIsLoading(false)
      }
    };
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    const updateData = {
      name: name,
      phone: phone,
      zipCode: zipcode,
      baseAddress: baseAddress,
      detailAddress: detailAddress,
      isJobRecommendEnabled: isJobRecommendEnabled ? 1 : 0
    }

    try {
      await axiosInstance.patch('/api/members/me', updateData)
      toast.success('변경사항이 성공적으로 저장되었습니다.')
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
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">내 정보 관리</h2>
        <p className="mt-2 text-md text-muted">인증된 회원 프로필 정보와 보안 설정을 제어하세요.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-10 shadow-sm">
        <h3 className="mb-8 text-xl font-bold text-ink border-b border-border-soft pb-4">프로필 정보</h3>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* 좌측 아바타 폼 */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-surface-muted border border-border">
              <div className="flex h-full w-full items-center justify-center text-muted">
                <User size={48} />
              </div>
              <button type="button" className="absolute bottom-1.5 right-1.5 rounded-full bg-brand p-2 text-white shadow hover:bg-brand-dark transition-colors">
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 우측 입력 필드 그룹 */}
          <form className="flex-1 space-y-6" onSubmit={handleUpdateProfile}>
            <div className={labelClass}>
                <label htmlFor="profile-name">성함 (변경 불가)</label>
              <input type="text" value={name} className={`${fieldClass} ${disabledStyle}`} readOnly aria-disabled="true" />
            </div>

            <div className={labelClass}>
                <label htmlFor="profile-email">회사 이메일 주소 (변경 불가)</label>
              <input type="email" value={email} className={`${fieldClass} ${disabledStyle}`} readOnly aria-disabled="true" />
            </div>

            <div className={labelClass}>
              <label htmlFor="profile-phone">연락처</label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
                required
              />
            </div>

            <div className={labelClass}>
              <label htmlFor="profile-zipcode">우편번호</label>
              <div className="flex gap-3">
                <input
                  id="profile-zipcode"
                  type="text"
                  placeholder="우편번호"
                  value={zipcode}
                  className={`${fieldClass} bg-surface-muted`}
                  readOnly
                />
                <Button type="button" variant="secondary" size="md" onClick={handleOpenPostcode} className="shrink-0 font-bold">
                  주소 찾기
                </Button>
              </div>
            </div>

            <div className={labelClass}>
              <label htmlFor="profile-base-address">기본 주소</label>
              <input
                id="profile-base-address"
                type="text"
                placeholder="우편번호 검색 시 자동으로 입력됩니다"
                value={baseAddress}
                className={`${fieldClass} ${disabledStyle}`}
                readOnly
              />
            </div>

            <div className={labelClass}>
              <label htmlFor="profile-detail-address">상세 주소</label>
              <input
                id="profile-detail-address"
                type="text"
                placeholder="상세 주소(아파트, 동, 호수 등)를 명확히 입력해 주세요."
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="flex items-start gap-4 border-t border-border-soft pt-6">
              <input
                id="profile-recommend"
                className="mt-1 size-6 shrink-0 accent-brand cursor-pointer"
                type="checkbox"
                checked={isJobRecommendEnabled}
                onChange={(e) => setIsJobRecommendEnabled(e.target.checked)}
              />
              <label htmlFor="profile-recommend" className="text-sm font-medium text-ink cursor-pointer select-none">
                나의 <span className="font-bold text-brand">직종 맞춤형</span> 상품 최적화 추천 메커니즘을 상시 유지하겠습니다.
              </label>
            </div>

            <div className="mt-8 flex flex-col items-end gap-4 border-t border-border-soft pt-8">
              <Button type="button" variant="secondary" size="lg" className="w-48 gap-2 font-bold">
                <Lock className="h-4 w-4" />
                비밀번호 변경
              </Button>
              <Button type="submit" variant="primary" size="lg" className="w-48 font-bold">
                변경사항 저장
              </Button>
              <button
                type="button"
                onClick={handleWithdraw}
                className="w-48 py-3 text-center text-sm font-extrabold text-error hover:bg-error/5 rounded border border-error/20 transition-all"
              >
                D-TO 서비스 탈퇴
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MyPageProfile