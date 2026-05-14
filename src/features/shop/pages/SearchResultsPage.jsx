import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '../../../common/components'
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
    <main className="mx-auto w-full max-w-[1110px] px-6 pt-10 pb-24 max-sm:px-4">
      <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <p className="text-[13px] text-[#657186]">홈 〉 검색 결과</p>
          <h1 className="mt-5 text-[34px] font-medium">'{query}'에 대한 {filteredProducts.length}개의 결과</h1>
        </div>
        <label className="flex items-center gap-3 text-[14px]">
          <span className="text-[#7b8798]">정렬 기준:</span>
          <select className="h-11 rounded border border-[#c7ccd6] bg-white px-4 text-[#071431]">
            <option>판매 인기순</option>
            <option>낮은 가격순</option>
            <option>높은 가격순</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-10 max-lg:grid-cols-1">
        <ProductFilters
          availableBrands={availableBrands}
          availableFeatures={availableFeatures}
          categoryOptions={categoryCatalog.filter((item) => ['appliance', 'wellness', 'health'].includes(item.code))}
          filters={filters}
          onFilterChange={setFilters}
          priceBounds={priceBounds}
        />

        <section>
          <p className="mb-6 text-[14px] font-semibold text-[#4b515d]">총 {products.length}개 상품 중 {filteredProducts.length}개 표시</p>
          <div className="grid grid-cols-3 gap-7 max-xl:grid-cols-2 max-sm:grid-cols-1">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} to={`/shop/${product.id}`} onWishlistClick={handleWishlistClick} onAddToCartClick={handleAddToCartClick} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded border border-[#dfe6ef] bg-white px-6 py-10 text-center text-[15px] text-[#657186]">
              선택한 필터와 일치하는 상품이 없습니다.
            </div>
          )}
          <nav className="mt-16 flex justify-center gap-3" aria-label="상품 페이지">
            <button className="inline-flex size-10 items-center justify-center rounded border border-[#c7ccd6]" type="button" aria-label="이전 페이지">
              <ChevronLeft className="size-5" />
            </button>
            {[1, 2, 3].map((page) => (
              <button className={`inline-flex size-10 items-center justify-center rounded border ${page === 1 ? 'border-[#071431] bg-[#071431] text-white' : 'border-[#c7ccd6] bg-white'}`} type="button" key={page}>
                {page}
              </button>
            ))}
            <span className="px-4 py-2">...</span>
            <button className="inline-flex size-10 items-center justify-center rounded border border-[#c7ccd6] bg-white" type="button">8</button>
            <button className="inline-flex size-10 items-center justify-center rounded border border-[#c7ccd6] bg-white" type="button" aria-label="다음 페이지">
              <ChevronRight className="size-5" />
            </button>
          </nav>
        </section>
      </div>
    </main>
  )
}

export default SearchResultsPage
