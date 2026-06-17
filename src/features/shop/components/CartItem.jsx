import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Checkbox } from '../../../components/index.js'
import QuantitySelector from './QuantitySelector'

export default function CartItem({
  item,
  checked,
  onSelect,
  onIncrease,
  onDecrease,
  onDelete,
}) {
  const productPath = `/shop/${item.productId}`

  const discountAmount = item.discountRate
    ? Math.floor(item.price * (item.discountRate / 100))
    : 0
  const discountedPrice = item.price - discountAmount
  const subtotal = discountedPrice * item.quantity
  const hasDiscount = item.discountRate > 0

  const imageUrl =
    item.image?.trim()
    || item.imageUrl?.trim()
    || item.thumbnailImage?.trim()
    || item.productImageUrl?.trim()
    || item.thumbnailUrl?.trim()

  return (
    <article className="border-b border-border py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`cart-item-${item.cartId}`}
          variant="brand"
          size="md"
          checked={checked}
          onChange={onSelect}
          fieldClassName="shrink-0 pt-0.5"
          aria-label={`${item.productName} 선택`}
        />

        <div className="min-w-0 flex-1">
          <Link
            to={productPath}
            className="flex gap-4 motion-safe-transition hover:opacity-90"
          >
            <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-32">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-caption text-muted">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-body font-medium text-muted tracking-tight">
                {item.productName}
              </h3>

              <div className="mt-2">
                {hasDiscount && (
                  <p className="text-body-sm text-muted line-through">
                    {item.price.toLocaleString()}원
                  </p>
                )}
                <p className={`flex min-w-0 items-baseline gap-1 text-xl font-semibold text-ink ${hasDiscount ? 'mt-1' : ''}`}>
                  {hasDiscount && (
                    <span className="text-[0.9em] text-brand">{item.discountRate}%</span>
                  )}
                  <span className="inline-flex items-baseline">
                    <span>{discountedPrice.toLocaleString()}</span>
                    <span className="text-body font-medium">원</span>
                  </span>
                </p>
              </div>
            </div>
          </Link>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-md bg-surface-muted px-4 py-3">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />

            <div className="flex items-center gap-3">
              <p className="inline-flex items-baseline text-body-sm font-semibold text-ink">
                <span>{subtotal.toLocaleString()}</span>
                <span>원</span>
              </p>
              <button
                type="button"
                className="p-1 text-muted hover:text-ink"
                onClick={onDelete}
                aria-label={`${item.productName} 삭제`}
              >
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
