import { socialLoginConfig, socialLoginIcons, socialLoginStyles } from './socialLoginIcons.jsx'

const baseClassName =
  'inline-flex h-11 w-full min-w-11 items-center justify-center gap-2.5 rounded-md px-4 text-body font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

export default function SocialLoginButton({ provider, onClick, className = '' }) {
  const config = socialLoginConfig[provider]
  const Icon = socialLoginIcons[provider]
  const variantClassName = socialLoginStyles[provider]

  if (!config || !Icon || !variantClassName) {
    return null;
  }

  return (
    <button
      type="button"
      className={[baseClassName, variantClassName, className].filter(Boolean).join(' ')}
      aria-label={config.ariaLabel}
      onClick={() => onClick(provider)}
    >
      <Icon />
      {config.label}
    </button>
  )
}
