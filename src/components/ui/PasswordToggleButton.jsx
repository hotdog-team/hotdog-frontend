import { Eye, EyeOff } from 'lucide-react'

const buttonClass =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-transparent text-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/20'

export default function PasswordToggleButton({ visible, onToggle, labelPrefix = '비밀번호' }) {
  return (
    <button
      className={buttonClass}
      type="button"
      aria-label={visible ? `${labelPrefix} 숨기기` : `${labelPrefix} 보기`}
      aria-pressed={visible}
      onClick={onToggle}
    >
      {visible ? (
        <EyeOff size={20} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <Eye size={20} strokeWidth={2.5} aria-hidden="true" />
      )}
    </button>
  )
}
