import { useState, useEffect } from 'react'
import { Check, MapPin, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, InputField, Input, Checkbox, ModalShell } from '../../../components/index.js'
import { MyPageHeader, MyPageEmptyState } from '../../../components/mypage/MyPageUi.jsx'
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../../api/addressApi.js'

export default function AddressManagement() {
  const [addresses, setAddresses] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    addressName: '',
    recipientName: '',
    phoneNumber: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    isDefault: false,
  })

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses()
      setAddresses(Array.isArray(data) ? data : [])
    } catch {
      toast.error('배송지 목록을 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchAddresses()

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openModal = (address = null) => {
    if (address) {
      setEditMode(true)
      setFormData({
        id: address.addressId ?? address.id,
        addressName: address.addressName || '',
        recipientName: address.receiverName || '',
        phoneNumber: address.receiverPhone || '',
        zipcode: address.zipCode || '',
        address: address.baseAddress || '',
        detailAddress: address.detailAddress || '',
        isDefault: address.isDefault || false,
      })
    } else {
      setEditMode(false)
      setFormData({
        id: null,
        addressName: '',
        recipientName: '',
        phoneNumber: '',
        zipcode: '',
        address: '',
        detailAddress: '',
        isDefault: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleOpenPostcode = () => {
    if (window.daum?.Postcode) {
      new window.daum.Postcode({
        oncomplete(data) {
          setFormData((prev) => ({
            ...prev,
            zipcode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
          }))
          toast.info('우편번호가 입력되었습니다.')
        },
      }).open()
    }
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()

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
      if (editMode) {
        await updateAddress(formData.id, requestData)
        toast.success('배송지가 수정되었습니다.')
      } else {
        await addAddress(requestData)
        toast.success('새 배송지가 등록되었습니다.')
      }
      setIsModalOpen(false)
      fetchAddresses()
    } catch {
      toast.error(editMode ? '배송지 수정에 실패했습니다.' : '배송지 등록에 실패했습니다.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('이 배송지를 삭제하시겠습니까?')) return
    try {
      await deleteAddress(id)
      toast.success('배송지가 삭제되었습니다.')
      fetchAddresses()
    } catch {
      toast.error('배송지 삭제에 실패했습니다.')
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id)
      toast.success('기본 배송지로 변경되었습니다.')
      fetchAddresses()
    } catch {
      toast.error('기본 배송지 변경에 실패했습니다.')
    }
  }

  return (
    <>
      <MyPageHeader
        title="내 배송지 관리"
        description="자주 사용하는 배송지를 등록하고 관리합니다."
        actions={(
          <Button variant="primary" size="md" className="inline-flex items-center gap-2" onClick={() => openModal()}>
            <Plus size={18} aria-hidden="true" />
            새 배송지 추가
          </Button>
        )}
      />

      {addresses.length === 0 ? (
        <MyPageEmptyState
          icon={MapPin}
          title="등록된 배송지가 없습니다."
          description="새 배송지를 추가해 주세요."
        />
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => {
            const addressId = addr.addressId ?? addr.id
            const label = addr.addressName || addr.receiverName || '등록된 배송지'

            return (
              <article
                key={addressId}
                className={`rounded-md border bg-surface p-5 shadow-card ${
                  addr.isDefault ? 'border-brand' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h3 className="text-body-lg font-bold text-ink">{label}</h3>
                    {addr.isDefault && (
                      <span className="rounded bg-brand px-1.5 py-1 text-xs font-bold leading-none text-white">
                        기본배송지
                      </span>
                    )}
                  </div>

                  {addr.isDefault ? (
                    <span className="flex shrink-0 items-center gap-1 text-body-sm font-semibold text-brand">
                      <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                      선택됨
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addressId)}
                      className="shrink-0 rounded px-3 py-1 text-body-sm font-medium text-ink bg-brand/10 hover:bg-brand/15"
                    >
                      선택
                    </button>
                  )}
                </div>

                <p className="mt-3 text-body-sm leading-relaxed text-ink">
                  {addr.baseAddress || '주소 정보가 없습니다.'}
                  {addr.detailAddress ? ` ${addr.detailAddress}` : ''}
                </p>
                {addr.zipCode && (
                  <p className="mt-1 text-body-sm text-muted">({addr.zipCode})</p>
                )}

                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-body-sm text-muted">
                    {addr.receiverName || '받는 사람 정보 없음'}
                    {addr.receiverPhone ? ` ${addr.receiverPhone}` : ''}
                  </p>

                  <div className="flex shrink-0 items-center gap-2 text-body-sm text-muted">
                    <button type="button" onClick={() => openModal(addr)} className="hover:text-ink">
                      수정
                    </button>
                    {!addr.isDefault && (
                      <>
                        <span className="text-border" aria-hidden="true">|</span>
                        <button type="button" onClick={() => handleDelete(addressId)} className="hover:text-ink">
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {isModalOpen && (
        <ModalShell
          title={editMode ? '배송지 수정' : '새 배송지 등록'}
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-md"
          bodyClassName="p-6"
        >
          <form onSubmit={handleSaveAddress} className="space-y-5">
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
                <label className="text-sm font-bold text-ink" htmlFor="zipcode">
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
                  <Button type="button" variant="outline" size="md" onClick={handleOpenPostcode}>
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

              <Checkbox
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                variant="brand"
                size="md"
                label="이 주소를 기본 배송지로 설정합니다."
              />

            <div className="flex justify-end gap-2 border-t border-border-soft pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button type="submit" variant="primary">
                저장하기
              </Button>
            </div>
          </form>
        </ModalShell>
      )}
    </>
  )
}
