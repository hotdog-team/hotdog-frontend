import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '../../../components/index.js'
import AddressForm from './AddressForm.jsx'

export default function CheckoutAddressPickerModal({
  addresses,
  selectedAddress,
  onClose,
  onSelect,
  onAddressesChange,
}) {
  const [view, setView] = useState('list')
  const [pendingId, setPendingId] = useState(
    selectedAddress?.addressId ?? selectedAddress?.id ?? null,
  )

  const getAddressId = (item) => item.addressId ?? item.id

  const handleConfirm = () => {
    const nextAddress = addresses.find((item) => getAddressId(item) === Number(pendingId))
    if (!nextAddress) return
    onSelect(nextAddress)
    onClose()
  }

  const handleAddressAdded = async () => {
    const addressData = await onAddressesChange()
    const newest = addressData.find((item) => item.isDefault) || addressData[addressData.length - 1]
    if (newest) {
      setPendingId(getAddressId(newest))
    }
    setView('list')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
        {view === 'list' ? (
          <>
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-ink">배송지 선택</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-ink"
                aria-label="닫기"
              >
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {addresses.length === 0 ? (
                <p className="py-8 text-center text-body-sm text-muted">
                  등록된 배송지가 없습니다. 새 배송지를 추가해주세요.
                </p>
              ) : (
                <ul className="space-y-3">
                  {addresses.map((item) => {
                    const addressId = getAddressId(item)
                    const isSelected = Number(pendingId) === Number(addressId)

                    return (
                      <li key={addressId}>
                        <button
                          type="button"
                          onClick={() => setPendingId(addressId)}
                          className={`w-full rounded-lg border p-4 text-left transition-colors ${
                            isSelected
                              ? 'border-brand bg-brand/5'
                              : 'border-border hover:border-ink/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-bold text-ink">
                                {item.receiverName}
                                {item.addressName ? (
                                  <span className="ml-1 font-medium text-muted">
                                    ({item.addressName})
                                  </span>
                                ) : null}
                                {item.isDefault ? (
                                  <span className="ml-2 text-caption font-bold text-brand">기본</span>
                                ) : null}
                              </p>
                              <p className="mt-1 text-body-sm text-muted">{item.receiverPhone}</p>
                              <p className="mt-2 text-body-sm text-ink">
                                ({item.zipCode}) {item.baseAddress} {item.detailAddress}
                              </p>
                            </div>
                            {isSelected ? (
                              <Check className="size-5 shrink-0 text-brand" aria-hidden="true" />
                            ) : null}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border px-6 py-4">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setView('add')}
              >
                새 배송지 추가
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="md" onClick={onClose}>
                  취소
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={addresses.length === 0 || pendingId == null}
                  onClick={handleConfirm}
                >
                  선택 완료
                </Button>
              </div>
            </div>
          </>
        ) : (
          <AddressForm
            showBackButton
            title="새 배송지 등록"
            onBack={() => setView('list')}
            onClose={onClose}
            onSuccess={handleAddressAdded}
          />
        )}
      </div>
    </div>
  )
}
