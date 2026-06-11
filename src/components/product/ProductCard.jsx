import { EyeOff, Heart, ShoppingCart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addCartItem } from '../../api/cartApi.js'
import { sendBehaviorLog } from '../../api/behaviorLogApi.js'
import Button from '../ui/Button.jsx'
import { addBookmark, removeBookmark } from '../../api/bookmarkApi.js'
import { useEffect, useRef, useState } from 'react'

const DISLIKE_UNDO_MS = 10000
const HIDDEN_STORAGE_KEY = 'dislike:hidden'

function getHiddenIds() {
  try {
    const raw = sessionStorage.getItem(HIDDEN_STORAGE_KEY)
    return new Set(Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function addHiddenId(id) {
  const next = getHiddenIds()
  next.add(Number(id))
  sessionStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify([...next]))
}

function removeHiddenId(id) {
  const next = getHiddenIds()
  next.delete(Number(id))
  sessionStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify([...next]))
}

function ProductCard({ product, to, initialBookmarked = false, onBookmarkChange, isDislikeView = true }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isHidden, setIsHidden] = useState(() => getHiddenIds().has(Number(product.id)))
  const dislikePendingRef = useRef({ cancelled: false })

  useEffect(() => {
    setIsBookmarked(initialBookmarked)
  }, [initialBookmarked])

  const handleCardClick = () => {
    if (to) {
      navigate(to)
    }
  }

  const handleCardKeyDown = (event) => {
    if (to && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      navigate(to)
    }
  }

  const handleWishlistClick = async (event) => {
    event.stopPropagation()
    try {
      if (isBookmarked) {
        await removeBookmark(Number(product.id))
        setIsBookmarked(false)
        onBookmarkChange?.(Number(product.id), false)
        toast.info(`${product.name}을(를) 찜 목록에서 제거했습니다.`)
      } else {
        await addBookmark(Number(product.id))
        setIsBookmarked(true)
        onBookmarkChange?.(Number(product.id), true)
        toast.success(`${product.name}을(를) 찜 목록에 추가했습니다.`)
      }
      queryClient.invalidateQueries({ queryKey: ['bookmarkedIds'] })
    } catch (error) {
      if (error.response?.status === 409) {
        setIsBookmarked(true)
        return
      }
      console.error('북마크 처리 실패', error)
      toast.error('찜 목록 처리 중 문제가 발생했습니다.')
    }
  }

  const handleAddToCartClick = async (event) => {
    event.stopPropagation()
    try {
      await addCartItem(Number(product.id), 1)
      toast.success(`${product.name}을(를) 장바구니에 담았습니다.`)
    } catch (error) {
      console.error('장바구니 담기 실패:', error)
      toast.error('장바구니에 담는 중 문제가 발생했습니다.')
    }
  }

  const undoDislike = (toastId) => {
    dislikePendingRef.current.cancelled = true
    setIsHidden(false)
    removeHiddenId(product.id)
    toast.dismiss(toastId)
  }

  const handleDislikeClick = (event) => {
    event.stopPropagation()
    dislikePendingRef.current = { cancelled: false }

    setIsHidden(true)
    addHiddenId(product.id)

    const toastId = toast.info(
      <div className="flex items-center gap-3 text-body-sm">
        <span>당분간 이 상품을 표시하지 않습니다.</span>
        <button
          type="button"
          className="shrink-0 font-bold text-brand hover:underline"
          onClick={() => undoDislike(toastId)}
        >
          취소
        </button>
      </div>,
      {
        autoClose: DISLIKE_UNDO_MS,
        closeOnClick: false,
        onClose: () => {
          if (dislikePendingRef.current.cancelled) return
          sendBehaviorLog({ productId: product.id, actionType: 'DISLIKE' }).catch((error) => {
            console.error('DISLIKE 기록 실패:', error)
            setIsHidden(false)
            removeHiddenId(product.id)
            toast.error('요청 처리에 실패했습니다. 다시 시도해 주세요.')
          })
        },
      },
    )
  }

  const cardLinkLabel = to ? `${product.name} 상세 보기` : undefined

  if (isHidden) {
    return null
  }

  return (
    <article
      className={`group overflow-hidden rounded-md border border-border-soft bg-surface shadow-card ${to ? 'cursor-pointer motion-safe-transition hover:shadow-card-hover' : ''}`}
      role={to ? 'link' : undefined}
      tabIndex={to ? 0 : undefined}
      aria-label={cardLinkLabel}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative aspect-product overflow-hidden bg-surface-muted">
        {product.image?.trim() ? (
          <img
            className="h-full w-full object-cover"
            src={product.image}
            alt={product.name}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-caption text-muted">
            이미지 없음
          </div>
        )}

        {isDislikeView &&
            (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-start bg-linear-to-t from-black/55 to-transparent px-3 pb-3 pt-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-caption font-medium text-ink shadow-sm motion-safe-transition hover:bg-surface"
            onClick={handleDislikeClick}
          >
            <EyeOff className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
            당분간 보지 않기
          </button>
        </div>
            )
        }
        <button
          className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full border border-border-soft bg-surface/95 text-ink motion-safe-transition hover:bg-surface-muted"
          type="button"
          aria-label={`${product.name} 찜하기`}
          onClick={handleWishlistClick}
        >
          <Heart
            className={`size-5 transition-colors ${isBookmarked ? 'fill-brand text-brand' : ''}`}
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="px-5 pt-5 pb-4">
        <h3 className="line-clamp-2 text-body font-medium text-ink">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-caption font-semibold text-ink">
          <span className="flex text-rating" aria-hidden="true">
            {Array.from({ length: product.rating > 0 || 5 }).map((_, index) => (
              <Star key={index} className="size-3 fill-current" strokeWidth={0} />
            ))}
          </span>
          <span className="sr-only">별점 {product.rating}점, 리뷰 {product.reviews}개</span>
          <span aria-hidden="true">{product.rating}</span>
          <span className="text-muted" aria-hidden="true">({product.reviews}개)</span>
        </div>
        <p className="mt-1 text-body-md font-semibold text-ink">
          {product.salePrice?.toLocaleString()}원{' '}
          <span className="line-through font-light text-muted text-body-sm" aria-hidden="true">
            {product.originPrice?.toLocaleString()}원
          </span>
        </p>
        <Button
          className="mt-4 rounded-sm"
          type="button"
          variant="primary"
          size="sm"
          fullWidth
          onClick={handleAddToCartClick}
        >
          <ShoppingCart className="size-4" strokeWidth={2.3} aria-hidden="true" />
          장바구니 담기
        </Button>
      </div>
    </article>
  )
}

export default ProductCard
