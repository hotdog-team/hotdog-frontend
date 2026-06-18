import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, X } from 'lucide-react'
import { usePopularSearchKeywordsQuery } from '../../hooks/queries/useSearchQuery.js'
import { buildSearchPath } from '../../hooks/useSearchNavigation.js'
import {
  clearRecentSearches,
  readRecentSearches,
  removeRecentSearch,
} from '../../utils/recentSearchStorage.js'
import { formatPopularSearchTimestamp } from '../../utils/popularSearchRank.js'

const MAX_POPULAR_KEYWORDS = 10
const MAX_POPULAR_ROWS = 5

const focusRingClass =
  'focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

const keywordLinkClass =
  'min-w-0 flex-1 truncate text-body-sm font-medium text-ink'

const rowHoverClass = 'rounded-sm hover:bg-surface-muted motion-safe-transition'

function RecentSearchRow({ entry, onNavigate, onRemove }) {
  const { keyword } = entry
  const searchPath = buildSearchPath(keyword)

  return (
    <li className={rowHoverClass}>
      <div className="flex items-center gap-2.5 px-1 py-2">
        <span className="inline-flex size-6 shrink-0 items-center justify-center text-muted">
          <Clock className="size-3.5" strokeWidth={2} aria-hidden="true" />
        </span>
        <Link
          to={searchPath}
          className={`${keywordLinkClass} ${focusRingClass}`}
          onClick={() => onNavigate(keyword)}
        >
          {keyword}
        </Link>
        <button
          type="button"
          className={`inline-flex size-6 shrink-0 items-center justify-center text-muted hover:text-ink ${focusRingClass}`}
          aria-label={`${keyword} 최근 검색어 삭제`}
          onClick={() => onRemove(keyword)}
        >
          <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

function PopularKeywordRow({ keyword, rank, onNavigate }) {
  const rankClass = rank <= 3 ? 'font-bold text-brand' : 'font-medium text-muted'
  const searchPath = buildSearchPath(keyword)

  return (
    <li className={rowHoverClass}>
      <Link
        to={searchPath}
        className={`flex w-full items-center gap-3 px-1 py-2 ${focusRingClass}`}
        onClick={() => onNavigate(keyword)}
      >
        <span className={`w-5 shrink-0 text-center text-body-sm tabular-nums ${rankClass}`}>
          {rank}
        </span>
        <span className={keywordLinkClass}>{keyword}</span>
      </Link>
    </li>
  )
}

function splitPopularColumns(keywords) {
  const leftColumn = []
  const rightColumn = []

  keywords.forEach((item, index) => {
    const entry = { item, index }
    if (index % 2 === 0) {
      leftColumn.push(entry)
    } else {
      rightColumn.push(entry)
    }
  })

  return { leftColumn, rightColumn }
}

export default function SearchSuggestionPanel({ id, userId, onKeywordNavigate, onClose }) {
  const [recentSearches, setRecentSearches] = useState(() => readRecentSearches(userId))
  const popularSearchKeywordsQuery = usePopularSearchKeywordsQuery()

  const popularKeywords = useMemo(() => {
    const items = Array.isArray(popularSearchKeywordsQuery.data)
      ? popularSearchKeywordsQuery.data
      : []
    return items.slice(0, MAX_POPULAR_KEYWORDS)
  }, [popularSearchKeywordsQuery.data])

  const popularTimestamp = useMemo(
    () => formatPopularSearchTimestamp(
      popularSearchKeywordsQuery.dataUpdatedAt
        ? new Date(popularSearchKeywordsQuery.dataUpdatedAt)
        : new Date(),
    ),
    [popularSearchKeywordsQuery.dataUpdatedAt],
  )

  const { leftColumn, rightColumn } = useMemo(
    () => splitPopularColumns(popularKeywords),
    [popularKeywords],
  )

  useEffect(() => {
    setRecentSearches(readRecentSearches(userId))
  }, [userId])

  useEffect(() => {
    const syncRecentSearches = () => setRecentSearches(readRecentSearches(userId))
    window.addEventListener('recent-searches-updated', syncRecentSearches)
    window.addEventListener('storage', syncRecentSearches)
    return () => {
      window.removeEventListener('recent-searches-updated', syncRecentSearches)
      window.removeEventListener('storage', syncRecentSearches)
    }
  }, [userId])

  const handleRemoveRecent = (keyword) => {
    setRecentSearches(removeRecentSearch(userId, keyword, recentSearches))
  }

  const handleClearRecent = () => {
    setRecentSearches(clearRecentSearches(userId))
  }

  const handleNavigate = (keyword) => {
    onKeywordNavigate?.(keyword)
    onClose?.()
  }

  const renderPopularColumn = (entries, ariaLabel) => (
    <ol className="min-w-0 space-y-0" aria-label={ariaLabel}>
      {entries.slice(0, MAX_POPULAR_ROWS).map(({ item, index }) => {
        const keyword = item?.keyword || item
        return (
          <PopularKeywordRow
            key={keyword}
            keyword={keyword}
            rank={index + 1}
            onNavigate={handleNavigate}
          />
        )
      })}
    </ol>
  )

  return (
    <div
      id={id}
      role="region"
      aria-label="검색어 추천"
      className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border border-border-soft bg-surface shadow-card-hover"
    >
      <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
        <section className="px-4 py-3" aria-labelledby={`${id}-recent-heading`}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 id={`${id}-recent-heading`} className="text-body-sm font-bold text-ink">
              최근 검색어
            </h2>
            {recentSearches.length > 0 && (
              <button
                type="button"
                className={`text-caption text-muted hover:text-ink ${focusRingClass}`}
                onClick={handleClearRecent}
              >
                전체삭제
              </button>
            )}
          </div>

          {recentSearches.length > 0 ? (
            <ul aria-label="최근 검색어 목록">
              {recentSearches.map((entry) => (
                <RecentSearchRow
                  key={entry.keyword}
                  entry={entry}
                  onNavigate={handleNavigate}
                  onRemove={handleRemoveRecent}
                />
              ))}
            </ul>
          ) : (
            <p className="py-3 text-body-sm text-muted">최근 검색 내역이 없습니다.</p>
          )}
        </section>

        <section
          className="border-t border-border-soft px-4 py-3"
          aria-labelledby={`${id}-popular-heading`}
        >
          <p id={`${id}-popular-heading`} className="mb-1 text-caption text-muted">
            인기 검색어 <span>{popularTimestamp}</span>
          </p>

          {popularSearchKeywordsQuery.isLoading ? (
            <p className="py-3 text-body-sm text-muted" role="status">
              인기 검색어를 불러오는 중입니다…
            </p>
          ) : popularKeywords.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4">
              {renderPopularColumn(leftColumn, '인기 검색어 홀수 순위')}
              {renderPopularColumn(rightColumn, '인기 검색어 짝수 순위')}
            </div>
          ) : (
            <p className="py-3 text-body-sm text-muted">집계된 인기 검색어가 없습니다.</p>
          )}
        </section>
      </div>

      <div className="flex justify-end border-t border-border-soft px-4 py-2">
        <button
          type="button"
          className={`text-caption text-muted hover:text-ink ${focusRingClass}`}
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  )
}
