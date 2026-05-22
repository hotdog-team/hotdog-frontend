import { X } from 'lucide-react'

const buttonClass =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-transparent text-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/20'

export default function InputClearButton({ label, onClick }) {
  return (
    <button className={buttonClass} type="button" aria-label={label} onClick={onClick}>
      <X size={18} strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}
