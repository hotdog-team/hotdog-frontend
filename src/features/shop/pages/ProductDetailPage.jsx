import { Heart, Info, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { GlobalFooter, GlobalHeader } from '../../../common/components'
import { getCategoryByCode, getProductById, productCatalog } from '../data/catalog'

const specs = [
  ['총 용량', '28.5 cu. ft.'],
  ['형태', '프렌치 도어'],
  ['크기', '35.75" x 70" x 34.25"'],
  ['에너지 스타', '등급 3'],
  ['연결성', 'Wi-Fi, Bluetooth 5.2'],
]

const relatedProducts = [
  productCatalog[1],
  productCatalog[2],
  productCatalog[4],
  productCatalog[7],
]

function ProductDetailPage() {
  const { productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  const product = getProductById(productId)

  if (!product) {
    return <Navigate to="/shop" replace />
  }

  const category = getCategoryByCode(product.categoryCode)
  const thumbnails = product.thumbnails ?? productCatalog.filter((item) => item.id !== product.id).slice(0, 4).map((item) => item.image)

  return (
    <div className="min-h-svh bg-[#fbfaf9] text-[#071431]">
      <GlobalHeader activeCategory={category?.navLabel ?? product.category} />
      <main className="mx-auto w-full max-w-[1110px] px-6 pt-12 pb-28 max-sm:px-4">
        <p className="mb-10 text-[14px] text-[#4b515d]">홈 〉 {category?.navLabel ?? product.category} 〉 {product.name}</p>
        <section className="grid grid-cols-[1.08fr_0.92fr] gap-14 max-lg:grid-cols-1">
          <div>
            <div className="relative overflow-hidden rounded-md border border-[#cfd6e1] bg-white">
              <span className="absolute top-4 left-4 rounded-full bg-[#071431] px-4 py-2 text-[12px] font-bold text-white">{product.badge || '임직원 전용'}</span>
              <img className="h-[460px] w-full object-cover" src={product.image} alt={product.name} />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {thumbnails.map((thumbnail, index) => (
                <div className="relative h-[132px] overflow-hidden rounded-md bg-[#e9eef4]" key={thumbnail}>
                  <img className="h-full w-full object-cover" src={thumbnail} alt="" />
                  {index === 3 && <span className="absolute inset-0 grid place-items-center bg-[#071431]/35 text-[28px] font-bold text-white">+4</span>}
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-5 rounded-md border border-[#e1e6ee] bg-white px-6 py-5">
              <span className="text-[#c64208]">✿</span>
              <div>
                <p className="font-semibold">인증된 리퍼브 및 검수 완료 상품</p>
                <p className="mt-1 text-[14px] text-[#4b515d]">각 유닛은 배송 전 B2E 물류 팀의 48단계 정밀 점검을 거칩니다.</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[15px] font-bold tracking-[0.1em] text-[#e24a0a]">{product.category}</p>
            <h1 className="text-[20px] font-medium">{product.name}</h1>
            <div className="mt-6 flex items-center gap-2 text-[#f5a400]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star className="size-5 fill-current" key={index} strokeWidth={0} />
              ))}
              <span className="ml-2 text-[14px] text-[#071431]">(128 리뷰)</span>
            </div>
            <p className="mt-8 max-w-[560px] text-[16px] leading-7 text-[#4b515d]">{product.description}</p>
            <div className="mt-10 rounded-md border border-[#d8dde6] bg-[#f4f1f0] px-7 py-6">
              <p className="text-[15px] text-[#4b515d]">소비자 가격: <span className="ml-3 line-through">$4,299.00</span></p>
              <p className="mt-5 text-[14px] font-bold text-[#e24a0a]">임직원 전용가</p>
              <div className="mt-1 flex items-center gap-4">
                <p className="text-[36px] font-light">{product.price}</p>
                <span className="rounded-sm bg-[#ff4b11] px-3 py-1 text-[11px] font-extrabold text-white">-34% OFF</span>
              </div>
              <p className="mt-6 border-t border-[#c7ccd6] pt-5 text-[14px] text-[#4b515d]"><Info className="mr-2 inline size-4" />결제 시 급여 공제 가능</p>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-6">
              <div>
                <p className="mb-3 text-[14px] font-semibold">수량</p>
                <div className="inline-flex h-11 overflow-hidden rounded border border-[#9aa5b5]">
                  <button className="px-4" type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus className="size-4" /></button>
                  <span className="grid w-14 place-items-center">{quantity}</span>
                  <button className="px-4" type="button" onClick={() => setQuantity((current) => current + 1)}><Plus className="size-4" /></button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-[14px] font-semibold">재고 상태</p>
                <div className="rounded border border-[#b6e5c5] bg-[#e8faed] px-5 py-3 font-semibold text-[#178a45]">◎ 재고 있음 (12개 남음)</div>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <button className="h-14 rounded-md bg-[#ff4b11] px-12 font-bold text-white" type="button">주문하기</button>
              <button className="inline-flex h-14 items-center gap-3 rounded-md border border-[#9aa5b5] px-8 font-bold" type="button"><ShoppingCart className="size-5" />장바구니 담기</button>
              <button className="inline-flex h-14 w-16 items-center justify-center rounded-md border border-[#9aa5b5]" type="button" aria-label="찜하기"><Heart className="size-6" /></button>
            </div>
          </div>
        </section>

        <section className="mt-24 border-b border-[#d8dde6] pb-14">
          <nav className="border-b border-[#c7ccd6]">
            <button className="border-b-2 border-[#e24a0a] px-5 py-4" type="button">상세 사양</button>
            <button className="px-5 py-4 text-[#4b515d]" type="button">배송 및 물류</button>
            <button className="px-5 py-4 text-[#4b515d]" type="button">보증 정보</button>
          </nav>
          <h2 className="mt-10 mb-6 text-[18px] font-medium">기술 사양</h2>
          <dl className="grid">
            {specs.map(([label, value]) => (
              <div className="grid grid-cols-2 border-b border-[#edf1f5] py-5" key={label}>
                <dt className="text-[#4b515d]">{label}</dt>
                <dd className="text-right font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-24">
          <div className="mb-10 flex justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#e24a0a]">함께 구매하면 좋은 상품</p>
              <h2 className="mt-2 text-[18px]">{category?.label ?? product.category} 함께 보기</h2>
            </div>
            <Link className="text-[16px]" to={`/shop?category=${product.categoryCode}`}>카테고리 보기 →</Link>
          </div>
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {relatedProducts.map((relatedProduct) => (
              <article key={relatedProduct.id}>
                <Link to={`/shop/${relatedProduct.id}`}>
                  <img className="h-[260px] w-full rounded-md border border-[#cfd6e1] object-cover" src={relatedProduct.image} alt={relatedProduct.name} />
                  <p className="mt-4 text-[12px] text-[#4b515d]">{relatedProduct.category}</p>
                  <h3 className="mt-1 text-[18px]">{relatedProduct.name}</h3>
                  <p className="mt-1 text-[17px]">{relatedProduct.price}</p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  )
}

export default ProductDetailPage
