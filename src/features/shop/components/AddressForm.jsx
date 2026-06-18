import { useEffect, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { Button, InputField, Input, Checkbox } from '../../../components/index.js'
import { addAddress } from '../../../api/addressApi'

export default function AddressForm({
  onClose,
  onSuccess,
  onBack,
  showBackButton = false,
  title = '새 배송지 등록',
}) {
  const [formData, setFormData] = useState({
    addressName: '',
    recipientName: '',
    phoneNumber: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    isDefault: false,
  })

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleOpenPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setFormData((prev) => ({
            ...prev,
            zipcode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
          }))
        },
      }).open()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const requestData = {
      addressName: formData.addressName,
      receiverName: formData.recipientName,
      receiverPhone: formData.phoneNumber,
      zipCode: formData.zipcode,
      baseAddress: formData.address,
      detailAddress: formData.detailAddress,
      isDefault: formData.isDefault,
    }

    try {
      await addAddress(requestData)
      alert('배송지가 추가되었습니다.')
      onSuccess()
    } catch (error) {
      console.error(error)
      alert('배송지 추가에 실패했습니다.')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              className="text-muted hover:text-ink"
              aria-label="배송지 목록으로 돌아가기"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          ) : null}
          <h2 className="text-lg font-bold text-ink">{title}</h2>
        </div>

        {!showBackButton ? (
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink"
            aria-label="닫기"
          >
            <X className="size-5" strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex max-h-[calc(85vh-8rem)] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          <InputField
            id="addressName"
            name="addressName"
            label="배송지명 *"
            required
            value={formData.addressName}
            onChange={handleChange}
            placeholder="예: 우리집, 회사"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="recipientName"
              name="recipientName"
              label="받는 사람 *"
              required
              value={formData.recipientName}
              onChange={handleChange}
            />

            <InputField
              id="phoneNumber"
              name="phoneNumber"
              label="연락처 *"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-bold text-ink">
              우편번호 *
            </label>

            <div className="flex gap-2">
              <Input
                id="zipcode"
                name="zipcode"
                required
                value={formData.zipcode}
                readOnly
                placeholder="우편번호"
                className="flex-1 bg-surface-muted"
              />

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleOpenPostcode}
              >
                주소 검색
              </Button>
            </div>
          </div>

          <InputField
            id="address"
            name="address"
            label="기본 주소 *"
            required
            value={formData.address}
            readOnly
            inputVariant="muted"
          />

          <InputField
            id="detailAddress"
            name="detailAddress"
            label="상세 주소"
            value={formData.detailAddress}
            onChange={handleChange}
            placeholder="상세 주소를 입력해 주세요."
          />

          <div className="pt-2">
            <Checkbox
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              variant="brand"
              size="md"
              label="이 주소를 기본 배송지로 설정합니다."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="secondary" onClick={showBackButton ? onBack : onClose}>
            취소
          </Button>

          <Button type="submit" variant="primary">
            저장하기
          </Button>
        </div>
      </form>
    </>
  )
}
