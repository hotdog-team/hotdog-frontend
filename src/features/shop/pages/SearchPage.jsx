import { useMemo, useState } from 'react'
import { ChevronRight, CornerDownRight, Search, Tags } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  findExactProductByName,
  getSearchSuggestions,
  popularKeywords,
  quickCategories,
  recentKeywords,
  recommendedCategories,
} from '../data/catalog'

function buildSearchPath(query) {
  return `/shop?query=${encodeURIComponent(query)}`
}

function SearchHero({ initialValue = '' }) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState(initialValue)
  const trimmedValue = searchValue.trim()
  const suggestions = useMemo(() => getSearchSuggestions(searchValue), [searchValue])
  const shouldShowSuggestions = trimmedValue.length > 0

  const submitSearch = (value) => {
    const nextValue = value.trim()

    if (!nextValue) {
      return
    }

    const exactProduct = findExactProductByName(nextValue)
    navigate(exactProduct ? `/shop/${exactProduct.id}` : buildSearchPath(nextValue))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitSearch(searchValue)
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/shop/${suggestion.productId}`)
      return
    }

    navigate(buildSearchPath(suggestion.label))
  }

  return (
    <section className="mx-auto w-full max-w-[900px] px-6 pt-16 max-sm:px-4">
      <div className={`relative rounded-lg border bg-white ${shouldShowSuggestions ? 'border-[#dfe6ef] shadow-[0_28px_60px_rgba(7,20,49,0.18)]' : 'border-transparent'}`}>
        <form className="flex gap-4 rounded-lg border-2 border-[#071431] bg-white p-2" role="search" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="shop-search">
            상품 검색
          </label>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-[#7f94b2]" strokeWidth={2.25} aria-hidden="true" />
            <input
              id="shop-search"
              className="h-12 w-full bg-transparent pr-3 pl-14 text-[18px] font-medium text-[#071431] outline-none placeholder:text-[#7f94b2] max-sm:text-[15px]"
              name="search"
              type="search"
              value={searchValue}
              placeholder="건강식품, 가전제품, 여행 상품 등을 검색해 보세요..."
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  submitSearch(searchValue)
                }
              }}
            />
          </div>
          <button className="h-12 min-w-[120px] rounded bg-[#071431] px-8 text-[14px] font-bold tracking-[0.18em] text-white hover:bg-[#12264f] max-sm:min-w-20 max-sm:px-4" type="submit">
            SEARCH
          </button>
        </form>

        {shouldShowSuggestions && (
          <div className="overflow-hidden rounded-b-lg bg-white">
            <section className="px-9 pt-8 pb-7 max-sm:px-5">
              <h2 className="text-[13px] font-bold text-[#8c9bb2]">추천 키워드</h2>
              <div className="mt-5 grid gap-5">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <button
                      className="flex items-center gap-4 text-left text-[20px] font-medium text-[#24314b] hover:text-[#ff4b11] max-sm:text-[16px]"
                      type="button"
                      key={`${suggestion.type}-${suggestion.label}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="size-5 shrink-0 text-[#90a1bb]" aria-hidden="true" />
                      <span>{suggestion.label}</span>
                    </button>
                  ))
                ) : (
                  <button className="flex items-center gap-4 text-left text-[20px] font-medium text-[#24314b] hover:text-[#ff4b11] max-sm:text-[16px]" type="button" onClick={() => submitSearch(trimmedValue)}>
                    <Search className="size-5 shrink-0 text-[#90a1bb]" aria-hidden="true" />
                    <span>{trimmedValue}</span>
                  </button>
                )}
              </div>
            </section>

            <section className="border-t border-[#edf1f5] px-9 py-7 max-sm:px-5">
              <h2 className="text-[13px] font-bold text-[#8c9bb2]">추천 카테고리</h2>
              <div className="mt-5 grid gap-5">
                {recommendedCategories.map((category) => (
                  <button className="flex items-center justify-between text-left text-[18px] font-medium text-[#24314b] hover:text-[#ff4b11] max-sm:text-[15px]" type="button" key={`${category.categoryCode}-${category.detail}`} onClick={() => navigate(`/shop?category=${category.categoryCode}`)}>
                    <span className="inline-flex min-w-0 items-center gap-4">
                      <Tags className="size-5 shrink-0 text-[#90a1bb]" aria-hidden="true" />
                      <span className="truncate">{category.label} 〉 {category.detail}</span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-[#b5c0cf]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>

            <button className="w-full bg-[#f4f7fb] px-4 py-4 text-[13px] font-bold text-[#7d8ca4] hover:text-[#071431]" type="button" onClick={() => submitSearch(trimmedValue)}>
              Enter를 눌러 모든 결과 보기
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function SearchPage() {
  const navigate = useNavigate()

  return (
    <>
      <SearchHero />
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 max-sm:px-4">
        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[24px] font-medium text-[#071431]">최근 검색어</h2>
            <button className="text-[13px] font-medium text-[#9aa5b5] hover:text-[#071431]" type="button">모두 지우기</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {recentKeywords.map((keyword) => (
              <button className="rounded-lg border border-[#c7ccd6] px-5 py-3 text-[15px] font-medium text-[#343b48] hover:border-[#071431]" type="button" key={keyword} onClick={() => navigate(buildSearchPath(keyword))}>
                {keyword} ×
              </button>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-6 text-[24px] font-medium text-[#071431]">인기 검색어</h2>
          <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
            {popularKeywords.map((keyword, index) => (
              <button className="flex h-16 items-center justify-between rounded border border-[#c7ccd6] bg-white px-5 text-left text-[17px] font-medium hover:border-[#071431]" type="button" key={keyword} onClick={() => navigate(buildSearchPath(keyword))}>
                <span><span className="mr-4 text-[#9aa5b5]">{String(index + 1).padStart(2, '0')}</span>{keyword}</span>
                <CornerDownRight className="size-5 text-[#bc3c08]" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-[24px] font-medium text-[#071431]">빠른 카테고리</h2>
          <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
            {quickCategories.map((category) => (
              <button className="text-center" type="button" key={category.categoryCode} onClick={() => navigate(`/shop?category=${category.categoryCode}`)}>
                <img className="aspect-square w-full rounded-lg object-cover shadow-[0_12px_28px_rgba(7,20,49,0.12)]" src={category.image} alt="" />
                <span className="mt-3 block text-[15px] font-medium text-[#343b48]">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default SearchPage
