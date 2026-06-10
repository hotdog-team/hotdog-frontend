import { useState, useEffect } from 'react'
import { MapPin, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, InputField, Input, Checkbox } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

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
    isDefault: false
  })

  // 배송지 목록 조회
  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/api/members/addresses')
      const data = response.data.data || response.data
      setAddresses(Array.isArray(data) ? data : [])
    } catch (err) {
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
        id: address.id,
        addressName: address.addressName || '',
        recipientName: address.receiverName || '',
        phoneNumber: address.receiverPhone || '',
        zipcode: address.zipCode || '',
        address: address.baseAddress || '',
        detailAddress: address.detailAddress || '',
        isDefault: address.isDefault || false
      })
    } else {
      setEditMode(false)
      setFormData({
        id: null, addressName: '', recipientName: '', phoneNumber: '',
        zipcode: '', address: '', detailAddress: '', isDefault: false
      })
    }
    setIsModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleOpenPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setFormData(prev => ({
            ...prev,
            zipcode: data.zonecode,
            address: data.roadAddress || data.jibunAddress
          }))
          toast.info('우편번호가 입력되었습니다.')
        },
      }).open()
    }
  }

  // 배송지 저장
  const handleSaveAddress = async (e) => {
    e.preventDefault()

    const requestData = {
      addressName: formData.addressName,
      receiverName: formData.recipientName,
      receiverPhone: formData.phoneNumber,
      zipCode: formData.zipcode,
      baseAddress: formData.address,
      detailAddress: formData.detailAddress,
      isDefault: formData.isDefault
    }

    try {
      if (editMode) {
        await axiosInstance.patch(`/api/members/addresses/${formData.id}`, requestData)
        toast.success('배송지가 수정되었습니다.')
      } else {
        await axiosInstance.post('/api/members/addresses', requestData)
        toast.success('새 배송지가 등록되었습니다.')
      }
      setIsModalOpen(false)
      fetchAddresses()
    } catch (err) {
      toast.error(editMode ? '배송지 수정에 실패했습니다.' : '배송지 등록에 실패했습니다.')
    }
  }

  // 배송지 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('이 배송지를 삭제하시겠습니까?')) return
    try {
      await axiosInstance.delete(`/api/members/addresses/${id}`)
      toast.success('배송지가 삭제되었습니다.')
      fetchAddresses()
    } catch (err) {
      toast.error('배송지 삭제에 실패했습니다.')
    }
  }

  // 기본 배송지 설정
  const handleSetDefault = async (id) => {
    try {
      await axiosInstance.patch(`/api/members/addresses/${id}/default`)
      toast.success('기본 배송지로 변경되었습니다.')
      fetchAddresses()
    } catch (err) {
      toast.error('기본 배송지 변경에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border-soft pb-4">
        <h2 className="text-xl font-bold text-ink flex items-center gap-2">
          <MapPin className="text-brand" size={24} /> 내 배송지 관리
        </h2>
        <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => openModal()}>
          <Plus size={18} /> 새 배송지 추가
        </Button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center p-12 bg-surface-muted/30 border border-border-soft rounded-lg text-muted">
            등록된 배송지가 없습니다. 새로운 배송지를 추가해주세요.
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id || addr.addressId} className={`p-5 border rounded-lg flex justify-between items-start transition-colors ${addr.isDefault ? 'border-brand bg-brand/5' : 'border-border-soft bg-surface'}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-ink">
                    {addr.addressName || (addr.receiverName ? `${addr.receiverName}님의 배송지` : '등록된 배송지')}
                  </span>
                  {addr.isDefault && (
                    <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">기본 배송지</span>
                  )}
                </div>
                <div className="text-body-sm text-ink">
                  <span className="font-medium mr-2">{addr.receiverName || '받는 사람 정보 없음'}</span>
                  <span className="text-muted">{addr.receiverPhone || ''}</span>
                </div>
                <div className="text-body-sm text-muted">
                  {addr.zipCode ? `[${addr.zipCode}] ` : ''}
                  {addr.baseAddress || '주소 정보가 없습니다.'} {addr.detailAddress || ''}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex gap-2">
                  <button onClick={() => openModal(addr)} className="p-2 text-muted hover:text-ink transition-colors border border-border-soft rounded-md bg-white">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(addr.id || addr.addressId)} className="p-2 text-error hover:bg-error/10 transition-colors border border-border-soft rounded-md bg-white">
                    <Trash2 size={16} />
                  </button>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id || addr.addressId)} className="text-xs font-medium text-brand hover:underline flex items-center gap-1">
                    <CheckCircle size={14} /> 기본 배송지로 설정
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-md border border-border-soft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">{editMode ? '배송지 수정' : '새 배송지 등록'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-muted hover:text-error">
                <XCircle size={24} />
              </button>
            </div>

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
                <label className="text-sm font-bold text-ink">우편번호 *</label>
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
                  <Button type="button" variant="secondary" size="md" onClick={handleOpenPostcode}>
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

              <div className="pt-4 mt-6 border-t border-border-soft flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">저장하기</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}