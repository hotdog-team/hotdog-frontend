import Button from '../../../components/ui/Button.jsx'

export default function OrderCheckoutFooter({
  amount,
  summaryLabel,
  actionLabel,
  onAction,
  disabled = false,
}) {
  return (
    <>
      <div className="mt-6 flex items-center justify-between gap-4 border-t-2 border-ink pt-4">
        {summaryLabel ? (
          <span className="text-body-sm font-semibold text-ink">{summaryLabel}</span>
        ) : (
          <span className="sr-only">결제 요약</span>
        )}
        <p className="flex items-baseline gap-2">
          <span className="text-body-sm text-ink">최종 결제 금액</span>
          <span className="inline-flex items-baseline gap-0.5 text-2xl font-bold text-brand">
            <span>{amount.toLocaleString()}</span>
            <span className="text-body font-medium">원</span>
          </span>
        </p>
      </div>

      <div className="mt-6">
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth
          className="h-12"
          disabled={disabled}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </div>
    </>
  )
}
