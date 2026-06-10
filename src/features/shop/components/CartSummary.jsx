import Button from '../../../components/ui/Button.jsx'

export default function CartSummary({
  totalPrice,
  discountPrice,
  deliveryFee,
  finalPrice,
  disabled,
  onOrder,
}) {
  return (
    <aside className="h-fit rounded-md border border-border bg-surface p-6 shadow-card">
      <h2 className="text-xl font-bold text-ink">주문 요약</h2>

      <div className="mt-6 space-y-4 text-body-sm">
        <div className="flex justify-between text-muted">
          <span>상품 금액</span>
          <strong className="text-ink">₩{totalPrice.toLocaleString()}</strong>
        </div>

        <div className="flex justify-between text-muted">
          <span>임직원 할인</span>
          <strong className="text-danger">
            -₩{discountPrice.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between text-muted">
          <span>배송비</span>
          <strong className="text-ink">
            {deliveryFee === 0 ? '무료' : `₩${deliveryFee.toLocaleString()}`}
          </strong>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-center justify-between">
          <span className="text-body-lg font-bold text-ink">최종 결제 금액</span>
          <strong className="text-2xl font-bold text-ink">
            ₩{finalPrice.toLocaleString()}
          </strong>
        </div>
        <p className="mt-1 text-right text-caption text-muted">부가세 포함</p>
      </div>

      <Button
        className="mt-6"
        size="lg"
        fullWidth
        disabled={disabled}
        onClick={onOrder}
      >
        주문하기
      </Button>
    </aside>
  )
}