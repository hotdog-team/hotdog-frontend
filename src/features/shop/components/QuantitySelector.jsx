export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-border bg-surface">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-9 w-9 items-center justify-center border-r border-border text-body-sm text-ink hover:bg-surface-muted"
        aria-label="수량 감소"
      >
        -
      </button>

      <span className="flex h-9 w-9 items-center justify-center text-body-sm font-medium text-ink">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="flex h-9 w-9 items-center justify-center border-l border-border text-body-sm text-ink hover:bg-surface-muted"
        aria-label="수량 증가"
      >
        +
      </button>
    </div>
  )
}