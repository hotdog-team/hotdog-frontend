import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard, PageEmptyBox } from '../../../components/index.js'
import ShopBreadcrumb from '../components/ShopBreadcrumb.jsx'
import {
  clearRecentlyViewedProducts,
  getRecentlyViewedProducts,
  removeRecentlyViewedProduct,
} from '../../../utils/recentlyViewedStorage.js'

function RecentlyViewedPage() {
  const [items, setItems] = useState(() => getRecentlyViewedProducts())

  const products = useMemo(
    () => items.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      salePrice: item.salePrice,
      originPrice: item.originPrice,
      discountRate: item.discountRate,
      price: typeof item.salePrice === 'number' ? `${item.salePrice.toLocaleString()}원` : String(item.salePrice ?? ''),
    })),
    [items],
  )

  const handleRemove = (productId) => {
    removeRecentlyViewedProduct(productId)
    setItems(getRecentlyViewedProducts())
  }

  const handleClearAll = () => {
    clearRecentlyViewedProducts()
    setItems([])
  }

  return (
    <main className="layout-container pt-8 pb-24">
      <ShopBreadcrumb
        items={[
          { label: '홈', to: '/home' },
          { label: '최근 본 상품', isCurrent: true },
        ]}
      />

      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">최근 본 상품</h1>
          <p className="mt-2 text-body-sm text-muted">최근에 확인한 상품을 다시 볼 수 있습니다.</p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            className="text-body-sm font-medium text-muted hover:text-ink"
            onClick={handleClearAll}
          >
            전체 삭제
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-10">
          <PageEmptyBox
            title="최근 본 상품이 없습니다."
            description="상품을 둘러보면 이곳에 기록됩니다."
            action={(
              <Link className="text-body-sm font-semibold text-brand hover:underline" to="/shop">
                쇼핑하러 가기
              </Link>
            )}
          />
        </div>
      ) : (
        <div className="mt-10 a11y-grid-products grid grid-cols-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <button
                type="button"
                className="absolute top-2 right-2 z-10 rounded-full border border-gray-300 bg-surface px-2 py-1 text-caption text-muted hover:text-ink"
                aria-label={`${product.name} 최근 본 기록 삭제`}
                onClick={() => handleRemove(product.id)}
              >
                삭제
              </button>
              <ProductCard product={product} to={`/shop/${product.id}`} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default RecentlyViewedPage
