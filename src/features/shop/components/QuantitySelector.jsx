import { Minus, Plus } from 'lucide-react'

const stepperButtonClass =
  'inline-flex h-9 w-9 items-center justify-center focus-ring focus-ring-inset focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink disabled:cursor-not-allowed disabled:opacity-40'

const stepperValueClass =
  'inline-flex h-9 w-9 items-center justify-center border-x border-border bg-surface text-body-sm font-medium tabular-nums text-ink'

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max,
  ariaLabel = '수량 조절',
  valueLabel = '수량',
  className = '',
}) {
  const isDecreaseDisabled = quantity <= min
  const isIncreaseDisabled = max != null && quantity >= max

  return (
    <div
      className={`inline-flex h-9 overflow-hidden rounded border border-border bg-surface ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={isDecreaseDisabled}
        className={stepperButtonClass}
        aria-label={`${valueLabel} 감소`}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>

      <span
        className={stepperValueClass}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">{valueLabel} </span>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={isIncreaseDisabled}
        className={stepperButtonClass}
        aria-label={`${valueLabel} 증가`}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
