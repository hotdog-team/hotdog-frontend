import { useMemo, useState } from 'react'
import { ProductCard, Pagination } from '../../../components/index.js'
import ProductFilters from '../components/ProductFilters'
import {
  categoryCatalog,
  filterProducts,
  getAvailableBrands,
  getAvailableFeatures,
  getPriceBounds,
} from '../data/catalog'

function SearchResultsPage({ query, products }) {
  const handleWishlistClick = () => {}
  const handleAddToCartClick = () => {}
  const priceBounds = useMemo(() => getPriceBounds(products), [products])
  const availableBrands = useMemo(() => getAvailableBrands(products), [products])
  const availableFeatures = useMemo(() => getAvailableFeatures(products), [products])
  const [filters, setFilters] = useState({
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
    categoryCodes: [],
    brands: [],
    features: [],
  })
  const filteredProducts = useMemo(() => filterProducts(products, filters), [filters, products])

  return (
    <main className="layout-container pt-10 pb-24">
      <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <p className="text-caption text-muted">홈 〉 검색 결과</p>
          <h1 className="mt-5 text-3xl font-medium">'{query}'에 대한 {filteredProducts.length}개의 결과</h1>
        </div>
        <label className="flex items-center gap-3 text-body-sm">
          <span className="text-muted">정렬 기준:</span>
          <select className="h-11 rounded border border-border bg-surface px-4 text-ink">
            <option>판매 인기순</option>
            <option>낮은 가격순</option>
            <option>높은 가격순</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-sidebar gap-10 max-lg:grid-cols-1">
        <ProductFilters
          availableBrands={availableBrands}
          availableFeatures={availableFeatures}
          categoryOptions={categoryCatalog.filter((item) => ['appliance', 'wellness', 'health'].includes(item.code))}
          filters={filters}
          onFilterChange={setFilters}
          priceBounds={priceBounds}
        />

        <section>
          <p className="mb-6 text-body-sm font-semibold text-body">총 {products.length}개 상품 중 {filteredProducts.length}개 표시</p>
          <div className="grid grid-cols-3 gap-7 max-xl:grid-cols-2 max-sm:grid-cols-1">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} to={`/shop/${product.id}`} onWishlistClick={handleWishlistClick} onAddToCartClick={handleAddToCartClick} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded border border-border-soft bg-surface px-6 py-10 text-center text-muted">
              선택한 필터와 일치하는 상품이 없습니다.
            </div>
          )}
          <Pagination
            className="mt-16"
            page={1}
            totalPages={3}
            getPageHref={(nextPage) => {
              const params = new URLSearchParams()
              if (query) {
                params.set('query', query)
              }
              params.set('page', String(nextPage - 1))
              return `/shop?${params.toString()}`
            }}
            ariaLabel="상품 페이지"
          />
        </section>
      </div>
    </main>
  )
}

export default SearchResultsPage
