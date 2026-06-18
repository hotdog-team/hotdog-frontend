import { useId } from 'react'
import Input from './Input.jsx'

const labelVariants = {
  auth: 'text-sm font-extrabold tracking-label text-ink uppercase',
  default: 'text-body font-semibold text-ink',
}

export default function InputField({
  id: idProp,
  label,
  labelVariant = 'default',
  labelVisuallyHidden = false,
  hint,
  error,
  required = false,
  invalid = false,
  trailing = null,
  size = 'md',
  inputVariant = 'default',
  inputClassName = '',
  className = '',
  type = 'text',
  disabled = false,
  describedBy: describedByProp,
  ...inputProps
}) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy =
    describedByProp ?? ([hintId, errorId].filter(Boolean).join(' ') || undefined)
  const hasError = invalid || Boolean(error)
  const hasTrailing = Boolean(trailing)

  const labelClass = labelVisuallyHidden
    ? 'sr-only'
    : (labelVariants[labelVariant] ?? labelVariants.default)

  return (
    <div className={`grid gap-2.5 ${className}`.trim()}>
      {label && (
        <label className={labelClass} htmlFor={inputId}>
          {label}
          {required && (
            <span className="text-error" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}

      <span className="relative block">
        <Input
          id={inputId}
          type={type}
          variant={inputVariant}
          size={size}
          invalid={hasError}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={[hasTrailing && 'pr-14', inputClassName].filter(Boolean).join(' ')}
          {...inputProps}
        />
        {hasTrailing && (
          <span className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1">
            {trailing}
          </span>
        )}
      </span>

      {hint && !error && (
        <p id={hintId} className="text-body-sm text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm font-semibold tracking-normal text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
