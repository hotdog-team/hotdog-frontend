import { socialLoginConfig, socialLoginIcons, socialLoginStyles } from './socialLoginIcons.jsx'

const baseClassName =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full motion-safe-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

export default function SocialLoginButton({ provider, onClick, className = '' }) {
  const config = socialLoginConfig[provider]
  const Icon = socialLoginIcons[provider]
  const variantClassName = socialLoginStyles[provider]

  if (!config || !Icon || !variantClassName) {
    return null
  }

  return (
    <button
      type="button"
      className={[baseClassName, variantClassName, className].filter(Boolean).join(' ')}
      aria-label={config.ariaLabel}
      title={config.label}
      onClick={() => onClick(provider)}
    >
      <Icon />
    </button>
  )
}
