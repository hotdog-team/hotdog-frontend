import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/index.js'
import { useProductDetailQuery, useRelatedProductsQuery, } from '../../../hooks/queries/useProductQuery'
import { useProductViewLog } from "../../../hooks/useProductViewLog.js";
import {addBookmark, removeBookmark} from "../../../api/bookmarkApi.js";
import {toast} from "react-toastify";
import useBookmarkedIds from "../../../hooks/useBookmarkedIds.js";
import {addCartItem} from "../../../api/cartApi.js";
import { useNavigate } from 'react-router-dom';
import ProductReviewSection from '../components/ProductReviewSection.jsx'


function ProductDetailPage() {
  const { productId } = useParams()
  const [quantity, setQuantity] = useState(1)

  const queryClient = useQueryClient()
  const bookmarkedIds = useBookmarkedIds()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const navigate = useNavigate()

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
    return <div className="layout-container py-20">상품 정보를 불러오는 중입니다.</div>
  }

  if (error) {
    return <div className="layout-container py-20">상품 정보를 불러오지 못했습니다.</div>
  }

  if (!product) {
    return <div className="layout-container py-20">상품 정보가 없습니다.</div>
  }


  const category = { label: product.category, navLabel: product.category, }
  const thumbnails = product.thumbnails ?? []

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
    try {
      await addCartItem(Number(product.id), quantity)
      toast.success(`${product.name} ${quantity}개를 장바구니에 담았습니다.`)
    } catch {
      toast.error('장바구니 담기 실패')
    }
  }

  const handleOrder = () => {
    navigate('/orders/checkout', {
      state: {
        type: 'direct',
        productId: Number(product.id),
        quantity,
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
      <div className="layout-container pt-12 pb-12">
        <nav aria-label="현재 위치" className="mb-10">
          <ol className="flex items-center gap-1 text-body-sm text-muted">
            <Link to={'/home'} className="hover:text-ink transition-colors">
              홈
            </Link>
            <li aria-hidden="true"><ChevronRight className="size-3.5 shrink-0" strokeWidth={2} /></li>
            <li>
              <Link to={`/shop?categoryId=${encodeURIComponent(product.categoryId ?? product.categoryCode)}`} className="hover:text-ink transition-colors">
                {category?.navLabel ?? product.category}
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="size-3.5 shrink-0" strokeWidth={2} /></li>
            <li className="truncate text-ink font-medium" aria-current="page">{product.name}</li>
          </ol>
        </nav>
        <section className="a11y-grid-2col grid grid-cols-detail gap-14 max-lg:grid-cols-1">
          <div>
            <div className="relative overflow-hidden rounded-md border border-border-soft bg-surface">
              <img className="h-product w-full object-cover" src={product.image} alt={product.name} />
            </div>
            <div className="a11y-grid-4col mt-2 grid grid-cols-4 gap-2">
              {thumbnails.map((thumbnail, index) => (
                <div className="relative h-thumb overflow-hidden rounded-md bg-placeholder" key={thumbnail}>
                  <img className="h-full w-full object-cover" src={thumbnail} alt="" />
                  {index === 3 && <span className="absolute inset-0 grid place-items-center bg-ink/35 text-2xl font-bold text-white">+4</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-body font-bold text-brand">{product.category}</p>
            <h1 className="text-2xl font-medium">{product.name}</h1>
            <span className="sr-only">별점 {product.rating}점, 리뷰 {product.reviews}건</span>
            <div className="mt-4 flex items-center gap-0 text-rating" aria-hidden="true">
              {Array.from({ length: product.rating > 0 || 5 }).map((_, index) => (
                <Star className="size-5 fill-current" key={index} strokeWidth={0}/>
              ))}
              <span className="ml-2 text-body-sm text-ink" aria-hidden="true">(리뷰 {product.reviews}건)</span>
            </div>
            <p className="text-body-lg text-gray-400 mt-6"><span className="sr-only">원가 </span><span className="line-through">{product.originPrice?.toLocaleString()}원</span></p>
              <div className="mt-1 flex items-center gap-4">
                <p className="text-3xl font-bold tracking-tight">
                  <span className="sr-only">할인가</span>
                  {product.salePrice?.toLocaleString()}원</p>
                <span className="rounded-sm bg-brand px-3 py-1 text-caption font-extrabold text-white">{product.discountRate}% 할인</span>
              </div>
                  <p className="flex items-center gap-1.5 text-body font-medium text-gray-600 mt-4"><Truck className="size-4" strokeWidth={2.0} aria-hidden="true"/> {product.deliveryFee === 0 ? `무료 배송` : `배송비 ${product.deliveryFee.toLocaleString()}원`}</p>

            <div className="mt-9 flex gap-4 items-center">
                <p className="mb-2 text-body-sm font-semibold">수량</p>
                <div className="inline-flex h-11 overflow-hidden rounded border border-border bg-white">
                  <button className="px-4" type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus className="size-4" /></button>
                  <input
                      type="number"
                      min={1}
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stockQuantity, Math.max(1, Number(e.target.value))))}
                      className="w-14 text-center"
                  />
                  <button className="px-4" type="button" onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}><Plus className="size-4" /></button>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <Button className="h-14 px-12" type="button" variant="primary" size="md"
              onClick={handleOrder}>
                주문하기
              </Button>
              <Button
                  className="h-14 px-8"
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleAddToCartClick}>
                <ShoppingCart className="size-5" aria-hidden="true" />
                장바구니 담기
              </Button>
              <Button type="button" variant="outline" size="icon" className="h-14 w-16" aria-label={`${product.name} 찜하기`} onClick={handleWishlistClick}>
                <Heart className={`size-6 transition-colors ${isBookmarked ? 'fill-brand text-brand' : ''}`} aria-hidden="true" />
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
              { id: 'reviews', label: `리뷰${product.reviewCount > 0 ? ` (${product.reviewCount})` : ''}` },
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

        <section className="mt-24">
          <div className="mb-10 flex justify-between">
            <div>
              <h2 className="mt-2 text-xl">함께 구매하면 좋은 상품</h2>
            </div>
            <Link className="text-body" to={`/shop?categoryId=${encodeURIComponent(product.categoryId ?? product.categoryCode)}`}>카테고리 보기 →</Link>
          </div>
          <div className="a11y-grid-products grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {relatedProducts.map((relatedProduct) => (
              <article key={relatedProduct.id}>
                <Link to={`/shop/${relatedProduct.id}`}>
                  <img className="h-card w-full rounded-md border border-border-soft object-cover" src={relatedProduct.image} alt={relatedProduct.name} />
                  <p className="mt-4 text-caption text-foreground">{relatedProduct.category}</p>
                  <h3 className="mt-1 text-body-md font-bold">{relatedProduct.name}</h3>
                  <p className="mt-1 text-body-md">{relatedProduct.price}</p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductDetailPage
