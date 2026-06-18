const STEPS = [
  { key: 'cart', label: '장바구니' },
  { key: 'checkout', label: '주문/결제' },
  { key: 'complete', label: '주문완료' },
]

export default function OrderProgressSteps({ currentStep = 'cart' }) {
  const currentIndex = STEPS.findIndex((step) => step.key === currentStep)

  return (
    <nav
      className="flex flex-wrap items-center justify-end gap-1 text-body-sm sm:gap-2"
      aria-label="주문 진행 단계"
    >
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex
        const isPast = index < currentIndex

        return (
          <div key={step.key} className="flex items-center gap-1 sm:gap-2">
            {index > 0 && (
              <span className="text-muted" aria-hidden="true">
                &gt;
              </span>
            )}
            <span
              className={
                isActive
                  ? 'font-bold text-brand'
                  : isPast
                    ? 'font-medium text-ink'
                    : 'text-muted'
              }
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              {' '}
              {step.label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
