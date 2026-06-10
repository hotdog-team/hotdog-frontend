import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addCartItem } from '../../api/cartApi.js';
import Button from '../ui/Button.jsx'
import { addBookmark, removeBookmark } from "../../api/bookmarkApi.js";
import {useState} from "react";

function ProductCard({ product, to, initialBookmarked = false }) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  console.log('ProductCard product:', product)

  const imageUrl =
    product.image?.trim() ||
    product.imageUrl?.trim() ||
    product.thumbnailUrl?.trim() ||
    product.thumbnail?.trim() ||
    product.images?.[0]?.imageUrl?.trim() ||
    product.images?.[0]?.url?.trim()

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
    event.stopPropagation();
    try {
      if (isBookmarked) {
        await removeBookmark(Number(product.id));
        setIsBookmarked(false);
        toast.info(`${product.name}을(를) 찜 목록에서 제거했습니다.`);
      } else {
        await addBookmark(Number(product.id));
        setIsBookmarked(true);
        toast.success(`${product.name}을(를) 찜 목록에 추가했습니다.`);
      }
    } catch (error) {
      console.error('북마크 처리 실패', error);
      toast.error(`찜 목록 처리 중 문제가 발생했습니다.`);
    }
  }

  const handleAddToCartClick = async (event) => {
    event.stopPropagation();
    try {
      await addCartItem(Number(product.id), 1);
      toast.success(`${product.name}을(를) 장바구니에 담았습니다.`);
    } catch (error) {
      console.error('장바구니 담기 실패:', error);
      toast.error(`장바구니에 담는 중 문제가 발생했습니다.`);
    }
  }

  const cardLinkLabel = to ? `${product.name} 상세 보기` : undefined

  return (
    <article
      className={`overflow-hidden rounded-md border border-border-soft bg-surface shadow-card ${to ? 'cursor-pointer motion-safe-transition hover:shadow-card-hover' : ''}`}
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


        <span className="absolute bottom-3 left-3 rounded-sm bg-ink px-2 py-1 text-caption font-bold text-surface">
          {product.category}
        </span>
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
        <h3 className="line-clamp-1 text-body-sm font-medium text-ink">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-caption font-semibold text-ink">
          <span className="flex text-brand" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-3 fill-current" strokeWidth={0} />
            ))}
          </span>
          <span className="sr-only">별점 {product.rating}점, 리뷰 {product.reviews}개</span>
          <span aria-hidden="true">{product.rating}</span>
          <span className="text-muted" aria-hidden="true">({product.reviews})</span>
        </div>
        <p className="mt-1 text-body-sm font-semibold text-ink">{product.price}</p>
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
