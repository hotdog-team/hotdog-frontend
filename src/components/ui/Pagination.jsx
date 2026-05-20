import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const navControlClass =
  'inline-flex size-10 shrink-0 items-center justify-center rounded border border-border bg-surface text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/20'

const navControlDisabledClass = `${navControlClass} pointer-events-none opacity-40`

const pageLinkBase =
  'inline-flex size-10 shrink-0 items-center justify-center rounded border text-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-3'

const pageLinkClass = (isActive) =>
  [
    pageLinkBase,
    isActive
      ? 'pagination-page--active text-white focus-visible:ring-ink/20'
      : 'border-border bg-surface text-ink hover:border-brand focus-visible:ring-brand/20',
  ].join(' ')

function toPositiveInt(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }
  return Math.floor(parsed)
}

/** 1-based page numbers and optional ellipsis tokens */
function buildPageItems(page, totalPages, siblingCount) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items = []
  const left = Math.max(2, page - siblingCount)
  const right = Math.min(totalPages - 1, page + siblingCount)

  items.push(1)
  if (left > 2) {
    items.push('ellipsis')
  }

  for (let current = left; current <= right; current += 1) {
    items.push(current)
  }

  if (right < totalPages - 1) {
    items.push('ellipsis')
  }

  items.push(totalPages)
  return items
}

function NavControl({ to, disabled, label, children }) {
  if (disabled) {
    return (
      <span className={navControlDisabledClass} aria-disabled="true" aria-label={label}>
        {children}
      </span>
    )
  }

  return (
    <Link className={navControlClass} to={to} aria-label={label}>
      {children}
    </Link>
  )
}

function PageItem({ pageNumber, isActive, href, ariaLabel }) {
  if (isActive) {
    return (
      <span className={pageLinkClass(true)} aria-current="page" aria-label={ariaLabel}>
        {pageNumber}
      </span>
    )
  }

  return (
    <Link className={pageLinkClass(false)} to={href} aria-label={ariaLabel}>
      {pageNumber}
    </Link>
  )
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  getPageHref,
  siblingCount = 1,
  ariaLabel = '페이지',
  className = '',
}) {
  const normalizedTotalPages = toPositiveInt(totalPages, 1)
  const currentPage = Math.min(toPositiveInt(page, 1), normalizedTotalPages)

  const pageItems = useMemo(
    () => buildPageItems(currentPage, normalizedTotalPages, siblingCount),
    [currentPage, normalizedTotalPages, siblingCount],
  )

  if (normalizedTotalPages <= 1 || typeof getPageHref !== 'function') {
    return null
  }

  const prevHref = getPageHref(currentPage - 1)
  const nextHref = getPageHref(currentPage + 1)

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <NavControl
        to={prevHref}
        disabled={currentPage <= 1}
        label="이전 페이지"
      >
        <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden="true" />
      </NavControl>

      {pageItems.map((item, index) =>
        item === 'ellipsis' ? (
          <span className="px-1 text-muted" key={`ellipsis-${index}`} aria-hidden="true">
            …
          </span>
        ) : (
          <PageItem
            key={item}
            pageNumber={item}
            isActive={item === currentPage}
            href={getPageHref(item)}
            ariaLabel={`${item} 페이지`}
          />
        ),
      )}

      <NavControl
        to={nextHref}
        disabled={currentPage >= normalizedTotalPages}
        label="다음 페이지"
      >
        <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden="true" />
      </NavControl>
    </nav>
  )
}
