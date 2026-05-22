import { useId, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'

const selectVariants = {
  variant: {
    default:
      'rounded border border-border bg-surface text-ink outline-none focus:border-brand focus:ring-3 focus:ring-brand/15',
    muted:
      'rounded-sm border border-transparent bg-surface-muted text-ink outline-none focus:border-brand focus:bg-surface focus:ring-3 focus:ring-brand/15',
  },
  size: {
    sm: 'min-h-9 px-4 py-2 text-sm font-medium',
    md: 'min-h-11 px-4 py-2 text-body',
    lg: 'min-h-14 px-5 py-3 text-body-lg max-sm:text-base',
  },
}

const base =
  'a11y-select w-full max-w-full appearance-none pr-10 transition-colors disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70'

export function normalizeSelectOptions(options = []) {
  return options.map((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      const value = String(item)
      return { value, label: value, disabled: false }
    }

    return {
      value: String(item.value),
      label: item.label ?? String(item.value),
      disabled: Boolean(item.disabled),
    }
  })
}

export function getSelectClassName({
  variant = 'default',
  size = 'md',
  invalid = false,
  className = '',
}) {
  const v = selectVariants.variant[variant] ?? selectVariants.variant.default
  const s = selectVariants.size[size] ?? selectVariants.size.md
  const state = invalid ? 'border-error focus:border-error focus:ring-error/15' : ''

  return [base, v, s, state, className].filter(Boolean).join(' ')
}

export default function Select({
  id: idProp,
  label,
  labelVisuallyHidden = false,
  hint,
  error,
  options = [],
  placeholder,
  placeholderDisabled = true,
  layout = 'stack',
  variant = 'default',
  size = 'md',
  invalid = false,
  required = false,
  disabled = false,
  className = '',
  selectClassName = '',
  value,
  defaultValue,
  onChange,
  onValueChange,
  name,
  ...rest
}) {
  const generatedId = useId()
  const selectId = idProp ?? generatedId
  const hintId = hint ? `${selectId}-hint` : undefined
  const errorId = error ? `${selectId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const normalizedOptions = useMemo(() => normalizeSelectOptions(options), [options])
  const hasError = invalid || Boolean(error)

  const fieldClass =
    layout === 'inline' ? 'a11y-select-field a11y-select-field--inline' : 'a11y-select-field'

  const labelClass = labelVisuallyHidden
    ? 'sr-only'
    : 'text-body-sm font-medium text-ink'

  const handleChange = (event) => {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <div className={[fieldClass, className].filter(Boolean).join(' ')}>
      {label && (
        <label className={labelClass} htmlFor={selectId}>
          {label}
          {required && (
            <span className="text-error" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}

      <div className="a11y-select-control relative min-w-0">
        <select
          id={selectId}
          name={name}
          className={getSelectClassName({ variant, size, invalid: hasError, className: selectClassName })}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          {...rest}
        >
          {placeholder != null && placeholder !== '' && (
            <option value="" disabled={placeholderDisabled}>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="a11y-select-chevron pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="text-body-sm text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-body-sm font-semibold text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
