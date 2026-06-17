const previewClass = {
  1: 'text-[100%]',
  2: 'text-[112.5%]',
  3: 'text-[125%]',
  4: 'text-[150%]',
  5: 'text-[200%]',
}

const steps = [1, 2, 3, 4, 5]

export default function FontSizeStepPicker({
  value,
  onChange,
  name = 'fontSizeStep',
  idPrefix = 'font-size-step',
  compact = false,
  className = '',
}) {
  const circleClass = compact ? 'size-8' : 'size-10'
  const labelTextClass = compact ? 'text-caption' : 'text-body'

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg bg-surface-muted p-2 ${className}`}
      role="radiogroup"
      aria-label="글자 크기 조절"
    >
      {steps.map((level) => {
        const isSelected = Number(value) === level
        const inputId = `${idPrefix}-${level}`

        return (
          <label
            key={level}
            htmlFor={inputId}
            className="focus-ring flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full p-0.5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ink"
          >
            <input
              type="radio"
              id={inputId}
              name={name}
              value={level}
              checked={isSelected}
              aria-label={`글자 크기 ${level}단계`}
              onChange={() => onChange(level)}
              className="sr-only"
            />
            <span
              className={`flex ${circleClass} items-center justify-center rounded-full ${labelTextClass} transition-colors ${
                isSelected
                  ? 'bg-brand font-semibold text-white shadow-sm'
                  : 'bg-surface text-muted hover:bg-brand hover:text-white'
              }`}
            >
              <span className={`select-none ${previewClass[level]}`} aria-hidden="true">
                가
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
