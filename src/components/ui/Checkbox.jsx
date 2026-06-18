import { useId } from 'react'
import { Check } from 'lucide-react'

const variantClass = {
  ink: 'a11y-checkbox--ink',
  brand: 'a11y-checkbox--brand',
}

const sizeClass = {
  sm: 'a11y-checkbox--sm',
  md: 'a11y-checkbox--md',
  lg: 'a11y-checkbox--lg',
}

export function getCheckboxClassName({
  variant = 'brand',
  size = 'md',
  className = '',
}) {
  return [
    'a11y-checkbox',
    variantClass[variant] ?? variantClass.brand,
    sizeClass[size] ?? sizeClass.md,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export default function Checkbox({
  id: idProp,
  label,
  children,
  variant = 'brand',
  size = 'md',
  disabled = false,
  hint,
  error,
  className = '',
  fieldClassName = '',
  labelClassName = '',
  describedBy: describedByProp,
  checked,
  defaultChecked,
  onChange,
  ...inputProps
}) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy =
    describedByProp ?? ([hintId, errorId].filter(Boolean).join(' ') || undefined)
  const labelContent = label ?? children
  const hasError = Boolean(error)

  return (
    <div className={['a11y-checkbox-field', fieldClassName].filter(Boolean).join(' ')}>
      <label
        htmlFor={inputId}
        className={[
          getCheckboxClassName({ variant, size }),
          disabled ? 'a11y-checkbox--disabled' : '',
          hasError ? 'a11y-checkbox--invalid' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="a11y-checkbox-control">
          <input
            id={inputId}
            type="checkbox"
            className="a11y-checkbox-input"
            disabled={disabled}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            {...inputProps}
          />
          <span className="a11y-checkbox-box" aria-hidden="true">
            <Check className="a11y-checkbox-check" strokeWidth={3} aria-hidden="true" />
          </span>
        </span>

        {labelContent && (
          <span className={['a11y-checkbox-label', labelClassName].filter(Boolean).join(' ')}>
            {labelContent}
          </span>
        )}
      </label>

      {hint && !error && (
        <p id={hintId} className="a11y-checkbox-hint text-body-sm text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="a11y-checkbox-hint text-body-sm font-semibold text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
