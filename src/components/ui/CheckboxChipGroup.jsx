import { useId } from 'react'
import ChoiceChip from './ChoiceChip.jsx'
import {
  choiceChipFieldClass,
  choiceChipGroupClass,
  choiceChipGroupLabelClass,
  choiceChipGroupLabelHintClass,
  normalizeChipOptions,
} from './choiceChipUtils.js'

export default function CheckboxChipGroup({
  id: idProp,
  label,
  labelDescription,
  options = [],
  values = [],
  onChange,
  unknownLabel,
  unknownChecked = false,
  onUnknownChange,
  optional = false,
  disabled = false,
  className = '',
  labelClassName = '',
  describedBy,
}) {
  const generatedId = useId()
  const groupId = idProp ?? generatedId
  const normalizedOptions = normalizeChipOptions(options)
  const valueSet = new Set(values.map((item) => String(item)))

  const setValues = (nextValues) => {
    onChange?.(nextValues)
  }

  const toggleValue = (rawValue) => {
    if (disabled) {
      return
    }

    if (unknownChecked) {
      onUnknownChange?.(false)
    }

    const valueKey = String(rawValue)
    const numeric = Number(rawValue)
    const value = Number.isNaN(numeric) || String(numeric) !== valueKey ? rawValue : numeric

    const next = valueSet.has(valueKey)
      ? values.filter((item) => String(item) !== valueKey)
      : [...values, value]
    setValues(next)
  }

  const handleUnknownChange = (checked) => {
    if (disabled) {
      return
    }
    onUnknownChange?.(checked)
    if (checked) {
      setValues([])
    }
  }

  return (
    <fieldset
      className={[choiceChipFieldClass, className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-describedby={describedBy}
    >
      {label && (
        <legend className={[choiceChipGroupLabelClass, labelClassName].filter(Boolean).join(' ')}>
          {label}
          {labelDescription && (
            <span className={choiceChipGroupLabelHintClass}> {labelDescription}</span>
          )}
        </legend>
      )}

      <div className={choiceChipGroupClass} role="presentation">
        {normalizedOptions.map((option) => {
          const optionId = `${groupId}-${option.value}`
          const selected = valueSet.has(option.value)

          return (
            <ChoiceChip
              key={option.value}
              id={optionId}
              type="checkbox"
              value={option.value}
              label={option.label}
              checked={selected}
              disabled={disabled || option.disabled}
              onChange={() => toggleValue(option.value)}
            />
          )
        })}

        {unknownLabel && (
          <ChoiceChip
            id={`${groupId}-unknown`}
            type="checkbox"
            value="unknown"
            label={unknownLabel}
            checked={unknownChecked}
            disabled={disabled}
            onChange={(event) => handleUnknownChange(event.target.checked)}
          />
        )}
      </div>
    </fieldset>
  )
}
