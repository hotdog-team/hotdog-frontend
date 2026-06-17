import { Ellipsis, Heart, ShoppingCart, Star } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addCartItem } from '../../api/cartApi.js'
import { sendBehaviorLog, clearDislikeHide } from '../../api/behaviorLogApi.js'
import { addBookmark, removeBookmark } from '../../api/bookmarkApi.js'
import { useEffect, useRef, useState } from 'react'

import { removeHiddenId, getHiddenIds, addHiddenId, HIDDEN_STORAGE_KEY } from '../../utils/dislikeHiddenStorage.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import { redirectToLogin } from '../../utils/requireLogin.js'

const DISLIKE_UNDO_MS = 10000

function ProductCard({
  product,
  to,
  initialBookmarked = false,
  onBookmarkChange,
  isDislikeView = true,
  showCategory = true,
  showBookmark = true,
  showCartButton = true,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const queryClient = useQueryClient()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isHidden, setIsHidden] = useState(() => (
    isDislikeView ? getHiddenIds().has(Number(product.id)) : false
  ))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dislikePendingRef = useRef({ cancelled: false })
  const menuRef = useRef(null)

  useEffect(() => {
    setIsBookmarked(initialBookmarked)
  }, [initialBookmarked])

  useEffect(() => {
    if (!isDislikeView) {
      setIsHidden(false)
      return
    }

    setIsHidden(getHiddenIds().has(Number(product.id)))
  }, [isDislikeView, product.id])

  useEffect(() => {
    if (!isDislikeView) return

    const syncHiddenState = (event) => {
      if (event.key != null && event.key !== HIDDEN_STORAGE_KEY) return
      setIsHidden(getHiddenIds().has(Number(product.id)))
    }

    window.addEventListener('storage', syncHiddenState)
    return () => window.removeEventListener('storage', syncHiddenState)
  }, [isDislikeView, product.id])

  useEffect(() => {
    if (!isMenuOpen) return

    const handlePointerDown = (event) => {
      if (menuRef.current?.contains(event.target)) return
      setIsMenuOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const handleCardClick = () => {
    setIsMenuOpen(false)
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
    if (!isAuthenticated) {
      redirectToLogin(navigate, location)
      return
    }
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
    if (!isAuthenticated) {
      redirectToLogin(navigate, { pathname: '/cart' })
      return
    }
    try {
      await addCartItem(Number(product.id), 1)
      toast.success(`${product.name}을(를) 장바구니에 담았습니다.`)
    } catch (error) {
      console.error('장바구니 담기 실패:', error)
      toast.error('장바구니에 담는 중 문제가 발생했습니다.')
    }
  }

  const undoDislike = async (toastId) => {
    dislikePendingRef.current.cancelled = true
    setIsHidden(false)
    removeHiddenId(product.id)
    toast.dismiss(toastId)

    try {
      await clearDislikeHide(product.id)
    } catch (error) {
      // dislike 취소 실패 처리는 무시하여 알리지 않는다
    }
  }

  const handleDislikeClick = (event) => {
    event.stopPropagation()
    setIsMenuOpen(false)
    dislikePendingRef.current = { cancelled: false }

    setIsHidden(true)
    addHiddenId(product.id)

    sendBehaviorLog({ productId: product.id, actionType: 'DISLIKE' })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['homeProducts'] })
        queryClient.invalidateQueries({ queryKey: ['recommendProducts'] })
        queryClient.invalidateQueries({ queryKey: ['categoryProducts'] })
        queryClient.invalidateQueries({ queryKey: ['metaTagProducts'] })
        queryClient.invalidateQueries({ queryKey: ['homePurpose'] })
        queryClient.invalidateQueries({ queryKey: ['homePersonalized'] })
      })
      .catch((error) => {
      console.error('DISLIKE 기록 실패:', error)
      setIsHidden(false)
      removeHiddenId(product.id)
      toast.error('요청 처리에 실패했습니다. 다시 시도해 주세요.')
    })

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
      },
    )
  }

  const cardLinkLabel = to ? `${product.name} 상세 보기` : undefined
  const averageRate = product.averageRate ?? product.rating ?? 0
  const reviewCount = product.reviewCount ?? product.reviews ?? 0
  const hasRating = averageRate > 0
  const discountRate = Number(product.discountRate ?? 0)
  const categoryLabel = product.categoryName ?? product.category ?? '상품'

  if (isDislikeView && isHidden) {
    return null
  }

  return (
    <article
      className={to ? 'cursor-pointer motion-safe-transition' : undefined}
      role={to ? 'link' : undefined}
      tabIndex={to ? 0 : undefined}
      aria-label={cardLinkLabel}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="relative aspect-product bg-surface-muted">
        <div className="absolute inset-0 overflow-hidden">
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
        </div>

        {showBookmark && (
          <button
            className="absolute bottom-2 right-2 z-10 inline-flex size-10 items-center justify-center motion-safe-transition"
            type="button"
            aria-label={`${product.name} 찜하기`}
            onClick={handleWishlistClick}
          >
            <Heart
              className={`size-6 drop-shadow-icon-stroke transition-colors ${
                isBookmarked ? 'fill-brand text-brand' : 'fill-none text-white'
              }`}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <div className="pt-0.5 pb-4">
        {(showCategory || isDislikeView) && (
        <div className="flex items-center justify-between gap-2">
          {showCategory && (
            <p className="min-w-0 truncate text-caption font-medium text-muted">{categoryLabel}</p>
          )}
          {isDislikeView && (
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                className={`inline-flex size-8 items-center justify-center rounded-full motion-safe-transition hover:bg-surface-muted ${
                  isMenuOpen ? 'bg-surface-muted' : ''
                }`}
                aria-label={`${product.name} 더보기`}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                onClick={(event) => {
                  event.stopPropagation()
                  setIsMenuOpen((open) => !open)
                }}
              >
                <Ellipsis
                  className="size-4 text-muted"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </button>

              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 z-20 mt-1 min-w-32 overflow-hidden rounded-lg border border-border-soft bg-surface py-1 shadow-card-hover"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-body-sm font-medium text-ink motion-safe-transition hover:bg-surface-muted"
                    onClick={handleDislikeClick}
                  >
                    당분간 보지 않기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        <h3 className="line-clamp-2 text-body font-medium text-muted tracking-tight">{product.name}</h3>
        <div className="mt-1 flex h-7 items-center justify-between gap-2">
          <p className="flex min-w-0 items-baseline gap-1 text-body-lg font-bold text-ink">
            {discountRate > 0 && (
              <span className="text-[0.9em] text-brand">{discountRate}%</span>
            )}
            <span className="inline-flex items-baseline">
              <span>{product.salePrice?.toLocaleString()}</span>
              <span className="text-body font-medium">원</span>
            </span>
          </p>
          {showCartButton && (
          <button
            type="button"
            className="inline-flex h-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface px-3 text-ink motion-safe-transition hover:border-ink hover:bg-surface-muted"
            aria-label={`${product.name} 장바구니 담기`}
            onClick={handleAddToCartClick}
          >
            <ShoppingCart className="size-4" strokeWidth={2.3} aria-hidden="true" />
          </button>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1 text-caption font-medium text-ink">
          <Star
            className={`size-3 shrink-0 ${hasRating ? 'fill-rating text-rating' : 'fill-border text-border-soft'}`}
            strokeWidth={0}
            aria-hidden="true"
          />
          <span className="sr-only">별점 {averageRate.toFixed(1)}점, 리뷰 {reviewCount}개</span>
          <span aria-hidden="true">{averageRate.toFixed(1)}</span>
          <span className="text-muted" aria-hidden="true">({reviewCount})</span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
