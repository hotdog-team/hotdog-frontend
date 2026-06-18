import { useId } from 'react'
import ChoiceChip from './ChoiceChip.jsx'
import {
  choiceChipFieldClass,
  choiceChipGroupClass,
  choiceChipGroupLabelClass,
  choiceChipGroupLabelHintClass,
  normalizeChipOptions,
  valuesMatch,
} from './choiceChipUtils.js'

export default function RadioChipGroup({
  id: idProp,
  name: nameProp,
  label,
  labelDescription,
  options = [],
  value,
  onChange,
  onValueChange,
  required = false,
  optional = false,
  disabled = false,
  className = '',
  labelClassName = '',
  describedBy,
}) {
  const generatedId = useId()
  const groupId = idProp ?? generatedId
  const name = nameProp ?? `${groupId}-radio`
  const normalizedOptions = normalizeChipOptions(options)

  const emitChange = (nextValue) => {
    onChange?.(nextValue)
    onValueChange?.(nextValue)
  }

  const handleSelect = (optionValue) => {
    if (disabled) {
      return
    }
    const numeric = Number(optionValue)
    const next = Number.isNaN(numeric) || String(numeric) !== optionValue ? optionValue : numeric
    emitChange(next)
  }

  return (
    <fieldset
      className={[choiceChipFieldClass, className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    >
      {label && (
        <legend
          id={`${groupId}-legend`}
          className={[choiceChipGroupLabelClass, labelClassName].filter(Boolean).join(' ')}
        >
          {label}
          {labelDescription && (
            <span className={choiceChipGroupLabelHintClass}> {labelDescription}</span>
          )}
          {required && (
            <span className="text-error" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </legend>
      )}

      <div className={choiceChipGroupClass} role="presentation">
        {normalizedOptions.map((option, index) => {
          const optionId = `${groupId}-${option.value}`
          const checked = valuesMatch(value, option.value)
          const isFirst = index === 0

          return (
            <ChoiceChip
              key={option.value}
              id={optionId}
              type="radio"
              name={name}
              value={option.value}
              label={option.label}
              checked={checked}
              disabled={disabled || option.disabled}
              required={required && isFirst && !disabled && !option.disabled}
              onChange={() => handleSelect(option.value)}
            />
          )
        })}
      </div>
    </fieldset>
  )
}
