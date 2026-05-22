import { Check } from 'lucide-react'

//선택 칩 UI(radio / checkbox 지원)
// RadioChipGroup 및 CheckboxChipGroup에서 사용합니다.

export default function ChoiceChip({
  id,
  type,
  name,
  value,
  checked = false,
  disabled = false,
  label,
  showSelectedIcon = true,
  required = false,
  onChange,
}) {
  return (
    <label
      htmlFor={id}
      className={[
        'a11y-choice-chip',
        checked ? 'a11y-choice-chip--selected' : '',
        disabled ? 'a11y-choice-chip--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        id={id}
        className="a11y-choice-chip-input"
        type={type}
        name={type === 'radio' ? name : undefined}
        value={value}
        checked={checked}
        disabled={disabled}
        required={required || undefined}
        onChange={onChange}
      />
      {showSelectedIcon && checked && (
        <Check className="a11y-choice-chip-icon" strokeWidth={2.5} aria-hidden="true" />
      )}
      <span className="a11y-choice-chip-text">{label}</span>
    </label>
  )
}
