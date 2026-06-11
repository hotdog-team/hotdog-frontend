import { XCircle, Copy } from 'lucide-react'
import { Button } from '../../../components/index.js'

export default function CashPaymentModal({
onClose,
onConfirm,
totalAmount,
}) {
const bankName = '국민은행'
const accountNumber = '123456-78-901234'
const accountHolder = 'D-TO'

const handleCopy = async () => {
try {
await navigator.clipboard.writeText(accountNumber)
alert('계좌번호가 복사되었습니다.')
} catch (error) {
console.error(error)
alert('계좌번호 복사에 실패했습니다.')
}
}

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-lg border border-border-soft bg-surface p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">
                무통장 입금 안내
            </h2>

            <button type="button" onClick={onClose} className="text-muted hover:text-error">
                <XCircle size={24} />
            </button>
        </div>

        <div className="space-y-5">
            <div className="rounded-md border border-border-soft bg-surface-muted p-4">
                <p className="text-sm font-bold text-ink">입금 계좌</p>

                <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-body-sm text-muted">
                            {bankName}
                        </p>
                        <p className="mt-1 text-lg font-bold text-ink">
                            {accountNumber}
                        </p>
                    </div>

                    <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
                        <Copy size={16} />
                        복사
                    </Button>
                </div>
            </div>

            <div className="space-y-2 text-body-sm">
                <div className="flex justify-between">
                    <span className="text-muted">예금주</span>
                    <strong className="text-ink">{accountHolder}</strong>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted">입금 금액</span>
                    <strong className="text-brand">
                        {totalAmount.toLocaleString()}원
                    </strong>
                </div>
            </div>

            <p className="rounded-md bg-surface-muted p-4 text-caption text-muted">
                입금 확인 후 주문 상태가 결제 완료로 변경됩니다.
            </p>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-border-soft pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
                취소
            </Button>

            <Button type="button" variant="primary" onClick={onConfirm}>
                확인
            </Button>
        </div>
    </div>
</div>
)
}