const buttonVariants = {
  variant: {
    primary:
      'bg-brand text-white hover:bg-brand-hover disabled:bg-brand-disabled disabled:opacity-100',
    secondary:
      'bg-navy text-white hover:bg-navy-hover',
    outline:
      'border border-border bg-surface text-ink hover:border-ink',
    ghost:
      'bg-transparent text-ink hover:bg-surface-muted',
    danger:
      'bg-transparent font-bold text-danger hover:bg-danger-soft',
  },
  size: {
    sm: 'h-9 gap-1.5 rounded-md px-4 text-body-sm font-bold',
    md: 'h-11 gap-2 rounded-md px-6 text-body font-medium',
    lg: 'h-12 gap-2 rounded-md px-6 text-body-lg font-bold',
    icon: 'size-10 shrink-0 rounded-md p-0',
  },
}

const base =
  'inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-60'

export function getButtonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) {
  const v = buttonVariants.variant[variant] ?? buttonVariants.variant.primary
  const s = buttonVariants.size[size] ?? buttonVariants.size.md
  return [base, v, s, fullWidth && 'w-full', className].filter(Boolean).join(' ')
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  type = 'button',
  disabled = false,
  children,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={getButtonClassName({ variant, size, fullWidth, className })}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
    </button>
  )
}
