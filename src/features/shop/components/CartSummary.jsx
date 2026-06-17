import OrderCheckoutFooter from './OrderCheckoutFooter.jsx'

export default function CartSummary({
  totalPrice,
  discountPrice,
  deliveryFee,
  finalPrice,
  selectedCount,
  disabled,
  isToolbarPinned = false,
  onOrder,
}) {
  const stickyTopClass = isToolbarPinned ? 'lg:top-20' : 'lg:top-8'

  return (
    <div className={`min-w-0 w-full overflow-visible lg:sticky ${stickyTopClass} lg:z-10 lg:self-start`}>
      <aside className="h-fit w-full min-w-0 overflow-visible rounded-md border border-border bg-surface p-6 shadow-card">
        <h2 className="text-xl font-bold text-ink">결제 금액</h2>

        <div className="mt-6 space-y-4 text-body-sm">
          <div className="flex justify-between gap-4">
            <span className="shrink-0">상품 금액</span>
            <span className="text-right text-ink">{totalPrice.toLocaleString()}원</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="shrink-0">총 배송비</span>
            <span className="text-right text-ink">
              {deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}
            </span>
          </div>

          {discountPrice > 0 && (
            <div className="flex justify-between gap-4">
              <span className="shrink-0">할인</span>
              <span className="text-right text-brand">-{discountPrice.toLocaleString()}원</span>
            </div>
          )}
        </div>

        <OrderCheckoutFooter
          summaryLabel={selectedCount > 0 ? `총 ${selectedCount}개` : null}
          amount={finalPrice}
          actionLabel={selectedCount > 0 ? '주문하기' : '상품을 선택해주세요'}
          onAction={onOrder}
          disabled={disabled}
        />
      </aside>
    </div>
  )
}
