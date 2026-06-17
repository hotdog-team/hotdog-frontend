import { Heart, Star, Truck } from 'lucide-react'
import ShopBreadcrumb from '../components/ShopBreadcrumb.jsx'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, PageLoadingBox, PageErrorBox } from '../../../components/index.js'
import { useProductDetailQuery, useRelatedProductsQuery } from '../../../hooks/queries/useProductQuery'
import { useProductViewLog } from '../../../hooks/useProductViewLog.js'
import { addBookmark, removeBookmark } from '../../../api/bookmarkApi.js'
import { toast } from 'react-toastify'
import useBookmarkedIds from '../../../hooks/useBookmarkedIds.js'
import { addCartItem } from '../../../api/cartApi.js'
import { useAuthStore } from '../../../store/useAuthStore.js'
import { redirectToLogin } from '../../../utils/requireLogin.js'
import ProductReviewSection from '../components/ProductReviewSection.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import { addRecentlyViewedProduct } from '../../../utils/recentlyViewedStorage.js'
import { ProductCard } from '../../../components/index.js'


function ProductDetailPage() {
  const { productId } = useParams()
  const [quantity, setQuantity] = useState(1)

  const queryClient = useQueryClient()
  const bookmarkedIds = useBookmarkedIds()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [activeTab, setActiveTab] = useState('detail-info')
  const [isTabPinned, setIsTabPinned] = useState(false)
  const [tabBarHeight, setTabBarHeight] = useState(0)

  const tabSentinelRef = useRef(null)
  const tabBarRef = useRef(null)

  useEffect(() => {
    setIsBookmarked(bookmarkedIds.has(Number(productId)))
  }, [bookmarkedIds])

  useProductViewLog(productId)

  const {
    data: product,
    isLoading,
    error,
  } = useProductDetailQuery(productId)

  useEffect(() => {
    if (!product?.id) {
      return
    }

    addRecentlyViewedProduct(product)
  }, [product])

  const {
    data: relatedProducts = [],
  } = useRelatedProductsQuery(productId)

  useEffect(() => {
    if (!product?.id) return

    const sections = ['detail-info', 'reviews']
    const observers = sections.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(id) },
        { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
      )
      observer.observe(el)
      return observer
    })

    return () => observers.forEach((obs) => obs?.disconnect())
  }, [product?.id])

  useEffect(() => {
    const sentinel = tabSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsTabPinned(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [product?.id, isLoading])

  useEffect(() => {
    const tabBar = tabBarRef.current
    if (!tabBar) return

    const updateHeight = () => setTabBarHeight(tabBar.offsetHeight)
    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(tabBar)
    return () => resizeObserver.disconnect()
  }, [product?.id, isLoading])

  if (isLoading) {
    return (
      <div className="layout-container py-20">
        <PageLoadingBox label="상품 정보를 불러오는 중입니다." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="layout-container py-20">
        <PageErrorBox title="상품 정보를 불러오지 못했습니다." />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="layout-container py-20">
        <PageErrorBox title="상품 정보가 없습니다." />
      </div>
    )
  }


  const category = { label: product.category, navLabel: product.category, }
  const thumbnails = product.thumbnails ?? []
  const averageRate = product.averageRate ?? product.rating ?? 0
  const reviewCount = product.reviewCount ?? product.reviews ?? 0
  const discountRate = Number(product.discountRate ?? 0)
  const salePrice = Number(product.salePrice ?? 0)
  const originPrice = Number(product.originPrice ?? 0)
  const lineTotal = salePrice * quantity
  const hasDiscount = discountRate > 0 && originPrice > salePrice
  const isSoldOut = product.status === 'SOLD_OUT' || Number(product.stockQuantity ?? 0) <= 0

  const handleWishlistClick = async (event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      redirectToLogin(navigate, location)
      return
    }
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
      queryClient.invalidateQueries({ queryKey: ['bookmarkedIds'] })
    } catch (error) {
      if (error.response?.status === 409) {
        setIsBookmarked(true)
        return
      }
      console.error('북마크 처리 실패', error);
      toast.error(`찜 처리 중 문제가 발생했습니다.`);
    }
  }

  const handleAddToCartClick = async () => {
    if (!isAuthenticated) {
      redirectToLogin(navigate, {
        pathname: '/cart',
      })
      return
    }
    try {
      await addCartItem(Number(product.id), quantity)
      toast.success(`${product.name} ${quantity}개를 장바구니에 담았습니다.`)
    } catch {
      toast.error('장바구니 담기 실패')
    }
  }

  const handleOrder = () => {
    if (!isAuthenticated) {
      redirectToLogin(navigate, {
        pathname: '/orders/checkout',
        state: {
          type: 'direct',
          productId: Number(product.id),
          quantity,
          imageUrl: product.image ?? product.imageUrl ?? '',
        },
      })
      return
    }
    navigate('/orders/checkout', {
      state: {
        type: 'direct',
        productId: Number(product.id),
        quantity,
        imageUrl: product.image ?? product.imageUrl ?? '',
      },
    })
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = tabBarRef.current?.offsetHeight ?? tabBarHeight ?? 56
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="bg-page text-ink">
      <div className="layout-container pt-8 pb-12">
        <div className="mb-10">
          <ShopBreadcrumb
            items={[
              { label: '홈', to: '/home' },
              {
                label: category?.navLabel ?? product.category,
                to: `/shop?categoryId=${encodeURIComponent(product.categoryId ?? product.categoryCode)}`,
              },
              { label: product.name, isCurrent: true },
            ]}
          />
        </div>
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div className="min-w-0 w-full lg:max-w-none">
            <div className="relative aspect-product overflow-hidden rounded-md bg-surface-muted">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src={product.image}
                alt={product.name}
              />
              {isSoldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-xl font-bold text-white">품절</span>
                </div>
              )}
            </div>
            <div className="a11y-grid-4col mt-2 grid grid-cols-4 gap-2">
              {thumbnails.map((thumbnail, index) => (
                <div
                  className="relative aspect-square min-w-0 overflow-hidden rounded-md bg-surface-muted"
                  key={thumbnail}
                >
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={thumbnail}
                    alt=""
                  />
                  {index === 3 && (
                    <span className="absolute inset-0 grid place-items-center bg-ink/35 text-2xl font-bold text-white">
                      +4
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-end justify-between gap-10">
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-body font-bold text-brand">{product.category}</p>
                <h1 className="text-2xl font-medium tracking-tight">{product.name}</h1>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 shrink-0 rounded-full border-border hover:border-ink"
                aria-label={`${product.name} 찜하기`}
                onClick={handleWishlistClick}
              >
                <Heart
                  className={`size-6 transition-colors ${isBookmarked ? 'fill-brand text-brand' : 'text-muted'}`}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </div>
            <span className="sr-only">별점 {averageRate.toFixed(1)}점, 리뷰 {reviewCount}건</span>
            <div className="mt-4 flex items-center gap-1" aria-hidden="true">
              <span className="text-body-sm font-semibold leading-none text-ink">{averageRate.toFixed(1)}</span>
              <Star className="size-4 shrink-0 fill-rating text-rating" strokeWidth={0} aria-hidden="true" />
              <a
                href="#reviews"
                className="focus-ring ml-0.5 text-body-sm font-medium leading-none text-muted underline underline-offset-2 hover:text-ink"
                onClick={(event) => {
                  event.preventDefault()
                  scrollTo('reviews')
                }}
              >
                리뷰 {reviewCount}건
              </a>
            </div>
            {hasDiscount && (
              <p className="mt-6 text-body-sm text-muted">
                <span className="sr-only">원가 </span>
                <span className="line-through">{originPrice.toLocaleString()}원</span>
              </p>
            )}
            <div className={`flex items-baseline gap-2 ${hasDiscount ? 'mt-1' : 'mt-6'}`}>
              {discountRate > 0 && (
                <span className="text-xl font-semibold text-brand">{discountRate}%</span>
              )}
              <p className="flex items-baseline gap-0.5 text-xl font-semibold tracking-tight text-ink">
                <span className="sr-only">판매가 </span>
                <span>{salePrice.toLocaleString()}</span>
                <span className="text-body-sm font-medium text-ink">원</span>
              </p>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-body-sm font-medium text-muted">
              <Truck className="size-4" strokeWidth={2.0} aria-hidden="true" />
              {product.deliveryFee === 0 ? '무료 배송' : `배송비 ${product.deliveryFee.toLocaleString()}원`}
            </p>

            <div className="mt-8 rounded-md bg-surface-muted px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <QuantitySelector
                  quantity={quantity}
                  min={1}
                  max={isSoldOut ? 1 : product.stockQuantity}
                  disabled={isSoldOut}
                  onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                  onIncrease={() => setQuantity((current) => Math.min(product.stockQuantity, current + 1))}
                />
                <p className="flex items-baseline gap-0.5 text-body-sm font-semibold text-ink">
                  <span className="sr-only">상품 금액 </span>
                  <span>{lineTotal.toLocaleString()}</span>
                  <span>원</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t-2 border-ink pt-4">
              <span className="text-body-sm font-semibold text-ink">총 {quantity}개</span>
              <p className="flex items-baseline gap-2">
                <span className="text-body-sm">총 상품 금액</span>
                <span className="inline-flex items-baseline gap-0.5 text-2xl font-bold text-brand">
                  <span>{lineTotal.toLocaleString()}</span>
                  <span className="text-body font-medium">원</span>
                </span>
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-2 sm:flex-row">
              <Button
                className="h-12 flex-1"
                type="button"
                variant="outline"
                size="md"
                disabled={isSoldOut}
                onClick={handleAddToCartClick}
              >
                {isSoldOut ? '품절' : '장바구니 담기'}
              </Button>
              <Button
                  className="h-12 flex-1"
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={isSoldOut}
                  onClick={handleOrder}
              >
                {isSoldOut ? '품절' : '바로 구매하기'}
              </Button>
            </div>
          </div>
        </section>

      </div>

      <div ref={tabSentinelRef} className="mt-4 h-px" aria-hidden="true" />

      {isTabPinned && <div style={{ height: tabBarHeight }} aria-hidden="true" />}

      <div
        ref={tabBarRef}
        className={`w-full bg-page ${
          isTabPinned ? 'fixed top-0 left-0 right-0 z-30 border-b border-border shadow-sm' : ''
        }`}
      >
        <div className="layout-container">
          <nav className="flex" aria-label="상품 상세 탭">
            {[
              { id: 'detail-info', label: '상세정보' },
              { id: 'reviews', label: product.reviewCount > 0 ? `리뷰 ${product.reviewCount}` : '리뷰' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`px-6 py-4 text-body font-medium transition-colors border-b-2 ${
                  activeTab === id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="layout-container pb-28">
        <section id="detail-info" className="border-b border-border-soft py-14">
          <h2 className="mb-6 text-xl font-bold">상세정보</h2>
          {product.description ? (
            <div className="whitespace-pre-wrap text-body leading-7 text-foreground">
              {product.description}
            </div>
          ) : (
            <p className="text-body-sm text-muted">등록된 상품 정보가 없습니다.</p>
          )}
        </section>

        <ProductReviewSection
          productId={product.id}
          averageRate={product.averageRate ?? 0}
          reviewCount={product.reviewCount ?? 0}
        />

        <section className="mt-20 border-t border-border-soft pt-12">
          <h2 className="mb-6 text-body-lg font-semibold text-ink">함께 구매하면 좋은 상품</h2>
          <div className="a11y-grid-products grid grid-cols-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                to={`/shop/${relatedProduct.id}`}
                showCategory={false}
                showBookmark={false}
                showCartButton={false}
                isDislikeView={false}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductDetailPage
