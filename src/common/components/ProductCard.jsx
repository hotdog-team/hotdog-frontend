import { Heart, ShoppingCart, Star } from 'lucide-react'

function ProductCard({ product, onWishlistClick, onAddToCartClick }) {
  const handleWishlistClick = () => {
    onWishlistClick?.(product)
  }

  const handleAddToCartClick = () => {
    onAddToCartClick?.(product)
  }

  return (
    <article className="overflow-hidden rounded-md border border-[#dfe6ef] bg-white shadow-[0_1px_2px_rgba(7,20,49,0.03)]">
      <div className="relative aspect-[1.05/1] overflow-hidden bg-[#f2f5f8]">
        <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
        <span className="absolute bottom-3 left-3 rounded-sm bg-[#071431] px-2 py-1 text-[10px] font-bold text-white">
          {product.category}
        </span>
        <button
          className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-full bg-white/95 text-[#071431] shadow-[0_1px_4px_rgba(7,20,49,0.16)] hover:bg-[#f1f5fa]"
          type="button"
          aria-label={`${product.name} 찜하기`}
          onClick={handleWishlistClick}
        >
          <Heart className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <div className="px-5 pt-5 pb-4">
        <h3 className="line-clamp-1 text-[15px] font-medium text-[#071431]">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#071431]">
          <span className="flex text-[#ff4b11]" aria-label={`별점 ${product.rating}점`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-3 fill-current" strokeWidth={0} aria-hidden="true" />
            ))}
          </span>
          <span>{product.rating}</span>
          <span className="text-[#7b8798]">({product.reviews})</span>
        </div>
        <p className="mt-1 text-[14px] font-semibold text-[#071431]">{product.price}</p>
        <button
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#ff4b11] px-4 text-[13px] font-bold text-white hover:bg-[#e8430d]"
          type="button"
          onClick={handleAddToCartClick}
        >
          <ShoppingCart className="size-4" strokeWidth={2.3} aria-hidden="true" />
          장바구니 담기
        </button>
      </div>
    </article>
  )
}

export default ProductCard
