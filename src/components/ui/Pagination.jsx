import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BLOCK_SIZE = 10

const navControlClass =
  'inline-flex size-9 shrink-0 items-center justify-center rounded bg-transparent text-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink/20'

const pageLinkBase =
  'inline-flex size-9 shrink-0 items-center justify-center rounded text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3'

const pageLinkClass = (isActive) =>
  [
    pageLinkBase,
    isActive
      ? 'pagination-page--active text-white focus-visible:ring-ink/20'
      : 'bg-transparent text-ink hover:bg-surface-muted focus-visible:ring-brand/20',
  ].join(' ')

function toPositiveInt(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }
  return Math.floor(parsed)
}

function getBlockStart(page) {
  return Math.floor((page - 1) / BLOCK_SIZE) * BLOCK_SIZE + 1
}

/** 현재 10페이지 블록만 표시 (1–10, 11–20, …) */
function buildBlockPageItems(page, totalPages) {
  const blockStart = getBlockStart(page)
  const blockEnd = Math.min(blockStart + BLOCK_SIZE - 1, totalPages)
  const count = blockEnd - blockStart + 1

  return Array.from({ length: count }, (_, index) => blockStart + index)
}

function NavControl({ to, hidden, label, children }) {
  if (hidden) {
    return null
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
  ariaLabel = '페이지',
  className = '',
}) {
  const normalizedTotalPages = toPositiveInt(totalPages, 1)
  const currentPage = Math.min(toPositiveInt(page, 1), normalizedTotalPages)

  const pageItems = useMemo(
    () => buildBlockPageItems(currentPage, normalizedTotalPages),
    [currentPage, normalizedTotalPages],
  )

  if (normalizedTotalPages <= 1 || typeof getPageHref !== 'function') {
    return null
  }

  const blockStart = getBlockStart(currentPage)
  const blockEnd = Math.min(blockStart + BLOCK_SIZE - 1, normalizedTotalPages)
  const hasPrevBlock = blockStart > 1
  const hasNextBlock = normalizedTotalPages > BLOCK_SIZE && blockEnd < normalizedTotalPages

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <NavControl
        to={getPageHref(blockStart - 1)}
        hidden={!hasPrevBlock}
        label="이전 페이지 목록"
      >
        <ChevronLeft className="size-4" strokeWidth={2.25} aria-hidden="true" />
      </NavControl>

      {pageItems.map((item) => (
        <PageItem
          key={item}
          pageNumber={item}
          isActive={item === currentPage}
          href={getPageHref(item)}
          ariaLabel={`${item} 페이지`}
        />
      ))}

      <NavControl
        to={getPageHref(blockEnd + 1)}
        hidden={!hasNextBlock}
        label="다음 페이지 목록"
      >
        <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
      </NavControl>
    </nav>
  )
}
