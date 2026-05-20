import { socialLoginConfig, socialLoginIcons, socialLoginStyles } from './socialLoginIcons.jsx'

const baseClassName =
  'inline-flex h-14 w-full min-w-11 items-center justify-center gap-4 px-4 text-base font-bold transition-colors'

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
