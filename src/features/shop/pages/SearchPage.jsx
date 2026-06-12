import { useMemo, useState, useEffect } from 'react'
import { ChevronRight, CornerDownRight, Search, Tags } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/index.js'
import { usePopularSearchKeywordsQuery } from '../../../hooks/queries/useSearchQuery'
import axiosInstance from '../../../api/axiosInstance.js'
import { useAuthStore } from '../../../store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'

import {
  findExactProductByName,
  getSearchSuggestions,
  recommendedCategories,
} from '../data/catalog'

const MAX_RECENT_SEARCHES = 5

const getRecentSearchesKey = (userId) => `d-to-recent-searches-${userId || 'guest'}`

function buildSearchPath(query) {
  return `/shop?query=${encodeURIComponent(query)}`
}

function readRecentSearches(userId) {
  try {
    const key = getRecentSearchesKey(userId)
    const storedSearches = window.localStorage.getItem(key)
    const parsedSearches = JSON.parse(storedSearches)
    return Array.isArray(parsedSearches) ? parsedSearches.filter((search) => typeof search === 'string') : []
  } catch {
    return []
  }
}

function writeRecentSearches(userId, searches) {
  try {
    const key = getRecentSearchesKey(userId)
    window.localStorage.setItem(key, JSON.stringify(searches))
  } catch {
  }
}

function SearchHero({ getCategoryPath, initialValue = '', onProductSearch, onSearch }) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState(initialValue)
  const trimmedValue = searchValue.trim()
  const suggestions = useMemo(() => getSearchSuggestions(searchValue), [searchValue])
  const shouldShowSuggestions = trimmedValue.length > 0

  const submitSearch = (value) => {
    onSearch(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submitSearch(searchValue)
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      onProductSearch(suggestion.label, suggestion.productId)
      return
    }
    onSearch(suggestion.label)
  }

  return (
    <section className="layout-container max-w-form pt-16">
      <div className={`relative rounded-lg border bg-surface ${shouldShowSuggestions ? 'border-border-soft shadow-card-hover' : 'border-transparent'}`}>
        <form className="flex gap-4 rounded-lg border-2 border-ink bg-surface p-2" role="search" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="shop-search">
            상품 검색
          </label>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-6 -translate-y-1/2 text-muted" strokeWidth={2.25} aria-hidden="true" />
            <input
              id="shop-search"
              className="h-12 w-full bg-transparent pr-3 pl-14 text-body-lg font-medium text-ink outline-none placeholder:text-muted max-sm:text-body"
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
          <Button className="min-w-action tracking-wide max-sm:min-w-20" type="submit" variant="secondary" size="md">
            SEARCH
          </Button>
        </form>

        {shouldShowSuggestions && (
          <div className="overflow-hidden rounded-b-lg bg-surface">
            <section className="px-9 pt-8 pb-7 max-sm:px-5">
              <h2 className="text-caption font-bold text-muted">추천 키워드</h2>
              <div className="mt-5 grid gap-5">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <button
                      className="flex items-center gap-4 text-left text-body-lg font-medium text-foreground hover:text-brand max-sm:text-body"
                      type="button"
                      key={`${suggestion.type}-${suggestion.label}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
                      <span>{suggestion.label}</span>
                    </button>
                  ))
                ) : (
                  <button className="flex items-center gap-4 text-left text-body-lg font-medium text-foreground hover:text-brand max-sm:text-body" type="button" onClick={() => submitSearch(trimmedValue)}>
                    <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
                    <span>{trimmedValue}</span>
                  </button>
                )}
              </div>
            </section>

            <section className="border-t border-border-soft px-9 py-7 max-sm:px-5">
              <h2 className="text-caption font-bold text-muted">추천 카테고리</h2>
              <div className="mt-5 grid gap-5">
                {recommendedCategories.map((category) => (
                  <button className="flex items-center justify-between text-left text-body-lg font-medium text-foreground hover:text-brand max-sm:text-body" type="button" key={`${category.categoryCode}-${category.detail}`} onClick={() => navigate(getCategoryPath(category.categoryCode))}>
                    <span className="inline-flex min-w-0 items-center gap-4">
                      <Tags className="size-5 shrink-0 text-muted" aria-hidden="true" />
                      <span className="truncate">{category.label} 〉 {category.detail}</span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>

            <button className="w-full bg-surface-muted px-4 py-4 text-caption font-bold text-muted hover:text-ink" type="button" onClick={() => submitSearch(trimmedValue)}>
              Enter를 눌러 모든 결과 보기
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function SearchPage({ getCategoryPath = (categoryCode) => `/shop?categoryId=${encodeURIComponent(categoryCode)}` }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const user = useAuthStore((state) => state.user)
  const userId = user?.memberId || user?.id || user?.email || 'guest'

  const [recentSearches, setRecentSearches] = useState(() => readRecentSearches(userId))

  useEffect(() => {
    setRecentSearches(readRecentSearches(userId))
  }, [userId])

  const popularSearchKeywordsQuery = usePopularSearchKeywordsQuery()

  const popularData = popularSearchKeywordsQuery.data || [];
  const displayedPopularKeywords = Array.isArray(popularData) ? popularData : [];
  const isLoadingPopular = popularSearchKeywordsQuery.isLoading;

  const logSearchToBackend = async (keyword) => {
    try {
      await axiosInstance.post(`/api/search/log?keyword=${encodeURIComponent(keyword)}`)

      queryClient.invalidateQueries({ queryKey: ['popularSearchKeywords'] })
    } catch (error) {
      console.error('인기 검색어 저장 실패:', error)
    }
  }

  const saveRecentSearch = (keyword) => {
    const nextKeyword = keyword.trim()
    if (!nextKeyword) return []

    const nextSearches = [
      nextKeyword,
      ...recentSearches.filter((search) => search !== nextKeyword),
    ].slice(0, MAX_RECENT_SEARCHES)

    setRecentSearches(nextSearches)
    writeRecentSearches(userId, nextSearches)

    return nextSearches
  }

  const handleRemoveRecentSearch = (e, keywordToRemove) => {
    e.stopPropagation()
    const nextSearches = recentSearches.filter((search) => search !== keywordToRemove)
    setRecentSearches(nextSearches)
    writeRecentSearches(userId, nextSearches)
  }

  const handleSearch = (keyword) => {
    const nextKeyword = keyword.trim()
    if (!nextKeyword) return

    saveRecentSearch(nextKeyword)
    logSearchToBackend(nextKeyword)

    const exactProduct = findExactProductByName(nextKeyword)
    navigate(exactProduct ? `/shop/${exactProduct.id}` : buildSearchPath(nextKeyword))
  }

  const handleProductSearch = (keyword, productId) => {
    const nextKeyword = keyword.trim()
    if (!nextKeyword) return

    saveRecentSearch(nextKeyword)
    logSearchToBackend(nextKeyword)

    navigate(`/shop/${productId}`)
  }

  const handleClearRecentSearches = () => {
    setRecentSearches([])
    writeRecentSearches(userId, [])
  }

  return (
    <>
      <SearchHero getCategoryPath={getCategoryPath} onProductSearch={handleProductSearch} onSearch={handleSearch} />
      <section className="layout-container mt-16 max-w-form mb-20">

        <div className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-ink">최근 검색어</h2>
            <button className="text-caption font-medium text-muted hover:text-ink" type="button" onClick={handleClearRecentSearches}>모두 지우기</button>
          </div>
          {recentSearches.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {recentSearches.map((keyword) => (
                <button
                  className="flex items-center rounded-lg border border-border px-5 py-3 text-body font-medium text-foreground hover:border-ink"
                  type="button"
                  key={keyword}
                  onClick={() => handleSearch(keyword)}
                >
                  {keyword}
                  <span
                    className="ml-2 px-1 text-muted hover:text-ink"
                    onClick={(e) => handleRemoveRecentSearch(e, keyword)}
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted">최근 검색 내역이 없습니다.</p>
          )}
        </div>

        <div>
          <h2 className="mb-6 text-xl font-medium text-ink">인기 검색어</h2>
          <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
            {isLoadingPopular ? (
              <p className="text-muted">인기 검색어를 불러오는 중입니다...</p>
            ) : displayedPopularKeywords.length > 0 ? (
              displayedPopularKeywords.map((keyword, index) => (
                <button className="flex h-16 items-center justify-between rounded border border-border bg-surface px-5 text-left text-body-lg font-medium hover:border-ink" type="button" key={keyword?.keyword || keyword} onClick={() => handleSearch(keyword?.keyword || keyword)}>
                  <span>
                    <span className="mr-4 text-muted">{String(index + 1).padStart(2, '0')}</span>
                    {keyword?.keyword || keyword}
                    {keyword?.searchCount > 0 && <span className="text-sm text-brand ml-2">({keyword.searchCount})</span>}
                  </span>
                  <CornerDownRight className="size-5 text-brand" aria-hidden="true" />
                </button>
              ))
            ) : (
              <p className="text-muted">집계된 인기 검색어가 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default SearchPage