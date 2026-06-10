import { useEffect, useState } from 'react'
import { XCircle } from 'lucide-react'
import { Button, InputField, Input, Checkbox } from '../../../components/index.js'
import { addAddress } from '../../../api/addressApi'

export default function AddressModal({ onClose, onSuccess }) {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

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

    const handleSubmit = async (e) => {
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
            await addAddress(requestData)
            alert('배송지가 추가되었습니다.')
            onSuccess()
        } catch (error) {
            console.error(error)
            alert('배송지 추가에 실패했습니다.')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-border-soft bg-surface p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-ink">새 배송지 등록</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted hover:text-error"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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

                    <div className="mt-6 flex justify-end gap-2 border-t border-border-soft pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            취소
                        </Button>

                        <Button type="submit" variant="primary">
                            저장하기
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}