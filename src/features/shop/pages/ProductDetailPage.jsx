import { Heart, Info, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../../../components/index.js'
import { useProductDetailQuery, useRelatedProductsQuery, } from '../../../hooks/queries/useProductQuery'
import { useProductViewLog } from "../../../hooks/useProductViewLog.js";

const specs = [
  ['총 용량', '28.5 cu. ft.'],
  ['형태', '프렌치 도어'],
  ['크기', '35.75" x 70" x 34.25"'],
  ['에너지 스타', '등급 3'],
  ['연결성', 'Wi-Fi, Bluetooth 5.2'],
]

function ProductDetailPage() {
  const { productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  useProductViewLog(productId);
  const {
    data: product,
    isLoading,
    error,
  } = useProductDetailQuery(productId)

  const {
    data: relatedProducts = [],
  } = useRelatedProductsQuery(productId)

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

  return (
    <div className="bg-page text-ink">
      <div className="layout-container pt-12 pb-28">
        <p className="mb-10 text-body-sm text-foreground">홈 〉 {category?.navLabel ?? product.category} 〉 {product.name}</p>
        <section className="a11y-grid-2col grid grid-cols-detail gap-14 max-lg:grid-cols-1">
          <div>
            <div className="relative overflow-hidden rounded-md border border-border-soft bg-surface">
              <span className="absolute top-4 left-4 rounded-full bg-ink px-4 py-2 text-caption font-bold text-white">{product.badge || '임직원 전용'}</span>
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
            <div className="mt-5 flex gap-5 rounded-md border border-border-soft bg-surface px-6 py-5">
              <span className="text-brand">✿</span>
              <div>
                <p className="font-semibold">인증된 리퍼브 및 검수 완료 상품</p>
                <p className="mt-1 text-body-sm text-foreground">각 유닛은 배송 전 B2E 물류 팀의 48단계 정밀 점검을 거칩니다.</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-body font-bold tracking-wide text-brand">{product.category}</p>
            <h1 className="text-body-lg font-medium">{product.name}</h1>
            <div className="mt-6 flex items-center gap-2 text-rating">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star className="size-5 fill-current" key={index} strokeWidth={0} />
              ))}
              <span className="ml-2 text-body-sm text-ink">(128 리뷰)</span>
            </div>
            <p className="mt-8 max-w-content text-body leading-7 text-foreground">{product.description}</p>
            <div className="mt-10 rounded-md border border-border-soft bg-surface-muted px-7 py-6">
              <p className="text-body text-foreground">소비자 가격: <span className="ml-3 line-through">{product.originPrice?.toLocaleString()}원</span></p>
              <p className="mt-5 text-body-sm font-bold text-brand">임직원 전용가</p>
              <div className="mt-1 flex items-center gap-4">
                <p className="text-3xl font-light">{product.salePrice?.toLocaleString()}원</p>
                {product.discountRate > 0 && (<span className="rounded-sm bg-brand px-3 py-1 text-caption font-extrabold text-white">-{product.discountRate}% OFF</span>)}
              </div>
              <p className="mt-6 border-t border-border pt-5 text-body-sm text-foreground"><Info className="mr-2 inline size-4" />결제 시 급여 공제 가능</p>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-6">
              <div>
                <p className="mb-3 text-body-sm font-semibold">수량</p>
                <div className="inline-flex h-11 overflow-hidden rounded border border-border">
                  <button className="px-4" type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus className="size-4" /></button>
                  <span className="grid w-14 place-items-center">{quantity}</span>
                  <button className="px-4" type="button" onClick={() => setQuantity((current) => current + 1)}><Plus className="size-4" /></button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-body-sm font-semibold">재고 상태</p>
                <div className="rounded border border-success-border bg-success-soft px-5 py-3 font-semibold text-success">◎ 재고 있음 ({product.stockQuantity}개 남음)</div>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <Button className="h-14 px-12" type="button" variant="primary" size="md">
                주문하기
              </Button>
              <Button className="h-14 px-8" type="button" variant="outline" size="md">
                <ShoppingCart className="size-5" aria-hidden="true" />
                장바구니 담기
              </Button>
              <Button type="button" variant="outline" size="icon" className="h-14 w-16" aria-label="찜하기">
                <Heart className="size-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-24 border-b border-border-soft pb-14">
          <nav className="border-b border-border">
            <button className="border-b-2 border-brand px-5 py-4" type="button">상세 사양</button>
            <button className="px-5 py-4 text-body" type="button">배송 및 물류</button>
            <button className="px-5 py-4 text-body" type="button">보증 정보</button>
          </nav>
          <h2 className="mt-10 mb-6 text-body-lg font-medium">기술 사양</h2>
          <dl className="grid">
            {specs.map(([label, value]) => (
              <div className="grid grid-cols-2 border-b border-border-soft py-5" key={label}>
                <dt className="text-body">{label}</dt>
                <dd className="text-right font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-24">
          <div className="mb-10 flex justify-between">
            <div>
              <p className="text-body-sm font-bold text-brand">함께 구매하면 좋은 상품</p>
              <h2 className="mt-2 text-body-lg">{category?.label ?? product.category} 함께 보기</h2>
            </div>
            <Link className="text-body" to={`/shop?category=${product.categoryCode}`}>카테고리 보기 →</Link>
          </div>
          <div className="a11y-grid-products grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {relatedProducts.map((relatedProduct) => (
              <article key={relatedProduct.id}>
                <Link to={`/shop/${relatedProduct.id}`}>
                  <img className="h-card w-full rounded-md border border-border-soft object-cover" src={relatedProduct.image} alt={relatedProduct.name} />
                  <p className="mt-4 text-caption text-foreground">{relatedProduct.category}</p>
                  <h3 className="mt-1 text-body-lg">{relatedProduct.name}</h3>
                  <p className="mt-1 text-body-lg">{relatedProduct.price}</p>
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
