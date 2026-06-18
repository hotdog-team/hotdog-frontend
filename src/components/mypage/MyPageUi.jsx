export function MyPageHeader({ title, description, actions }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border-soft pb-5">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 text-body-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function MyPagePanel({ children, className = '' }) {
  return (
    <section className={['rounded-lg border border-border bg-surface p-6 shadow-card', className].filter(Boolean).join(' ')}>
      {children}
    </section>
  )
}

export function MyPageSectionTitle({ title, description, className = '' }) {
  return (
    <div className={['mb-5 border-b border-border-soft pb-3', className].filter(Boolean).join(' ')}>
      <h2 className="text-body font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-body-sm text-muted">{description}</p>}
    </div>
  )
}

export function PageLoadingBox({ label = '불러오는 중입니다.' }) {
  return (
    <div
      className="rounded-md border border-border-soft bg-surface px-6 py-10 text-center text-body text-muted"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  )
}

export function PageEmptyBox({ title, description, action }) {
  return (
    <div className="rounded-md border border-border bg-surface px-6 py-16 text-center shadow-card">
      <p className="text-body font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm mx-auto text-body-sm text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function PageErrorBox({ title = '정보를 불러오지 못했습니다.', description }) {
  return (
    <div className="rounded-md border border-border-soft bg-surface px-6 py-10 text-center">
      <p className="text-body font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1.5 text-body-sm text-muted">{description}</p> : null}
    </div>
  )
}

export const MyPageLoading = PageLoadingBox

export function MyPageEmptyState({ icon: Icon, title, description, action }) {
  return (
    <MyPagePanel className="flex flex-col items-center justify-center py-16 text-center">
      {Icon ? <Icon className="mb-4 size-10 text-muted" strokeWidth={1.5} aria-hidden="true" /> : null}
      <p className="text-body font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1.5 max-w-sm text-body-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </MyPagePanel>
  )
}

export function MyPageToggleRow({ id, title, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-border-soft pt-5 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <h3 id={id} className="text-body font-semibold text-ink">
          {title}
        </h3>
        {description ? (
          <p id={`${id}-desc`} className="mt-1 text-body-sm text-muted">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={`focus-ring inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
          checked ? 'bg-brand' : 'bg-border'
        }`}
      >
        <span
          aria-hidden="true"
          className={`size-5 rounded-full bg-surface shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
