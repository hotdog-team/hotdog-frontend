const inputVariants = {
    variant: {
        default:
            'rounded border border-border bg-surface text-ink outline-none placeholder:text-muted focus:border-brand focus:ring-3 focus:ring-brand/15',
        muted:
            'rounded-sm border border-transparent bg-surface-muted text-ink outline-none placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-3 focus:ring-brand/15',
        filled:
            'rounded-none border-0 bg-surface-muted text-ink outline-none placeholder:text-muted focus:bg-surface focus:ring-3 focus:ring-brand/20',
    },
    size: {
        sm: 'h-9 px-4 text-sm font-medium',
        md: 'h-11 px-5 text-body',
        lg: 'h-14 px-5 text-body-lg max-sm:text-base',
        xl: 'h-input-lg px-5 text-xl max-sm:h-14 max-sm:text-base',
    },
}

const base =
    'transition-colors disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70'

export function getInputClassName({
                                      variant = 'default',
                                      size = 'md',
                                      fullWidth = true,
                                      invalid = false,
                                      className = '',
                                  }) {
    const v = inputVariants.variant[variant] ?? inputVariants.variant.default
    const s = inputVariants.size[size] ?? inputVariants.size.md
    const state = invalid
        ? 'border-error focus:border-error focus:ring-error/15'
        : ''

    return [base, v, s, fullWidth && 'w-full', state, className].filter(Boolean).join(' ')
}

export default function Input({
                                  variant = 'default',
                                  size = 'md',
                                  fullWidth = true,
                                  invalid = false,
                                  className = '',
                                  type = 'text',
                                  disabled = false,
                                  ...props
                              }) {
    return (
        <input
            type={type}
            className={getInputClassName({ variant, size, fullWidth, invalid, className })}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            {...props}
        />
    )
}