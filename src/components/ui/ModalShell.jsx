import { X } from 'lucide-react'

export default function ModalShell({
  title,
  titleId,
  onClose,
  children,
  maxWidth = 'max-w-xl',
  className = '',
  bodyClassName = 'p-6',
  showHeader = true,
}) {
  const resolvedTitleId = titleId || (title ? 'modal-title' : undefined)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
    >
      <div
        className={`flex max-h-[85vh] w-full ${maxWidth} flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xl ${className}`}
      >
        {showHeader && (title || onClose) && (
          <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-6 py-4">
            {title ? (
              <h2 id={resolvedTitleId} className="text-body-lg font-bold text-ink">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-muted hover:text-ink"
                aria-label="닫기"
              >
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        )}
        <div className={`overflow-y-auto ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  )
}
