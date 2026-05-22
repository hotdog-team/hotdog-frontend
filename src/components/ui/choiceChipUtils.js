export function normalizeChipOptions(options = []) {
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

export function valuesMatch(a, b) {
  if (a === '' || a === null || a === undefined) {
    return b === '' || b === null || b === undefined
  }
  return String(a) === String(b)
}

export const choiceChipGroupLabelClass =
  'a11y-choice-chip-legend text-sm font-extrabold tracking-label text-ink uppercase'

export const choiceChipFieldClass = 'a11y-choice-chip-field'

export const choiceChipGroupClass = 'a11y-choice-chip-group'
