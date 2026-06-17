import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, CircleHelp } from 'lucide-react'
import { formControlFocusMutedClass } from '../../../components/index.js'

const FOCUS_CLASS =
  'focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink focus-visible:text-ink'

const PAGE_SIZE_SELECT_ID = 'product-list-page-size'

export const PRODUCT_SORT_OPTIONS = [
  { label: '신상품순', value: 'LATEST' },
  { label: '추천순', value: 'RECOMMEND' },
  { label: '판매순', value: 'SALES' },
  { label: '낮은가격순', value: 'LOW_PRICE' },
  { label: '높은가격순', value: 'HIGH_PRICE' },
  { label: '인기순', value: 'POPULAR' },
]

const RECOMMEND_SORT_HELP = {
  title: '추천순이란?',
  body: [
    '회원님이 관심 있어 하시는 스타일·취향과 최근 쇼핑 활동을 바탕으로, 각 상품이 얼마나 잘 맞는지 점수를 계산하여 높은 순으로 보여 드립니다.',
    '프로필에 입력한 선호 정보와 상품 보기, 찜, 장바구니, 구매 같은 활동이 반영됩니다. 활동이 쌓일수록 자신에게 맞는 상품에 가까워집니다.',
  ],
}

function RecommendSortHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (containerRef.current?.contains(event.target)) {
        return
      }
      setIsOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <span ref={containerRef} className="relative -ml-0.5 inline-flex">
      <button
        type="button"
        className="inline-flex size-4 items-center justify-center rounded-full text-muted motion-safe-transition hover:bg-surface-muted hover:text-ink focus-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
        aria-label="추천순 안내"
        aria-expanded={isOpen}
        aria-controls="recommend-sort-help"
        onClick={(event) => {
          event.stopPropagation()
          setIsOpen((open) => !open)
        }}
      >
        <CircleHelp className="size-3.5" strokeWidth={2} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id="recommend-sort-help"
          role="dialog"
          aria-labelledby="recommend-sort-help-title"
          className="absolute top-full -left-3 z-30 mt-2 w-72  rounded-md bg-ink p-4 text-left shadow-card-hover max-sm:left-0 max-sm:right-auto"
        >
          <span
            className="absolute -top-2 left-4 size-0 border-x-4 border-b-8 border-x-transparent border-b-ink max-sm:right-auto max-sm:left-0.5"
            aria-hidden="true"
          />
          <p id="recommend-sort-help-title" className="text-body-sm font-bold text-white">
            {RECOMMEND_SORT_HELP.title}
          </p>
          <div className="mt-2 space-y-2 text-caption leading-relaxed text-on-navy-muted">
            {RECOMMEND_SORT_HELP.body.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </span>
  )
}
export default function ProductSortBar({
  sort,
  onSortChange,
  pageSize,
  onSizeChange,
  pageSizeOptions = [20, 40, 60, 100],
  showRecommendHelp = true,
}) {
  const radioClass = (isActive) =>
    `motion-safe-transition ${
      isActive ? 'font-bold text-ink' : 'font-medium text-muted hover:text-ink'
    }`

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-body-sm">
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-2"
        role="radiogroup"
        aria-label="정렬 기준"
      >
        {PRODUCT_SORT_OPTIONS.map((option) => {
          const isActive = sort === option.value

          return (
            <span key={option.value} className="inline-flex items-center">
              <button
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 motion-safe-transition ${FOCUS_CLASS} ${radioClass(isActive)}`}
                onClick={() => onSortChange(option.value)}
              >                {isActive && (
                  <Check className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                )}
                {option.label}
              </button>
              {option.value === 'RECOMMEND' && showRecommendHelp && <RecommendSortHelp />}
            </span>
          )
        })}
      </div>

      <div className="relative inline-flex shrink-0 items-center">
        <label htmlFor={PAGE_SIZE_SELECT_ID} className="sr-only">
          표시 개수
        </label>
        <select
          id={PAGE_SIZE_SELECT_ID}
          className={`appearance-none cursor-pointer rounded-sm border border-transparent bg-transparent py-1.5 pl-3 pr-8 font-bold text-muted motion-safe-transition hover:bg-surface-muted ${formControlFocusMutedClass}`}
          value={pageSize}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option value={size} key={size}>
              {size}개씩 보기
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}