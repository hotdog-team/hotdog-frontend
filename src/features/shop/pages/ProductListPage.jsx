import { useEffect, useMemo, useState } from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import { fetchCategories } from '../../../api/categoryApi'
import { Button, Pagination, ProductCard } from '../../../components/index.js'
import { useCategoryProductsQuery, useMetaTagProductsQuery, useProductsQuery } from '../../../hooks/queries/useProductQuery'
import useBookmarkedIds from '../../../hooks/useBookmarkedIds.js'

import {
  categoryCatalog,
  getCategoryByCode,
} from '../data/catalog'
import EmptySearchResultsPage from './EmptySearchResultsPage'
import SearchPage from './SearchPage'
import {ChevronRight} from "lucide-react";

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_SORT = 'RECOMMEND'

const PAGE_SIZE_OPTIONS = [20, 40, 60, 100]

const SORT_OPTIONS = [
  { label: '기본', value: 'RECOMMEND' },
  { label: '최신순', value: 'LATEST' },
  { label: '판매순', value: 'SALES' },
  { label: '낮은 가격순', value: 'LOW_PRICE' },
  { label: '높은 가격순', value: 'HIGH_PRICE' },
  { label: '인기순', value: 'POPULAR' },

]

const META_TAG_SORT_VALUES = new Set([...SORT_OPTIONS.map((o) => o.value), 'ATTENTION'])

function parsePage(value) {
  const page = Number(value)
  return Number.isInteger(page) && page >= 0 ? page : 0
}

function parsePageSize(value) {
  const size = Number(value)
  return PAGE_SIZE_OPTIONS.includes(size) ? size : DEFAULT_PAGE_SIZE
}

function normalizeCategory(category) {
  const id = category?.id ?? category?.code

  if (id == null) {
    return null
  }

  const fallbackCategory = getCategoryByCode(category.code)

  return {
    ...fallbackCategory,
    ...category,
    id: String(id),
    code: String(id),
    label: category.name ?? category.label ?? fallbackCategory?.label ?? '상품',
    navLabel: category.name ?? category.navLabel ?? fallbackCategory?.navLabel ?? '상품',
    description: category.description ?? fallbackCategory?.description ?? '',
    heroTitle: category.heroTitle ?? fallbackCategory?.heroTitle ?? `${category.name ?? fallbackCategory?.label ?? '상품'} 추천 상품`,
    heroDescription: category.heroDescription ?? fallbackCategory?.heroDescription ?? '카테고리별 추천 상품을 확인해 보세요.',
    image: category.image ?? category.imageUrl ?? fallbackCategory?.image ?? '',
  }
}

function buildFallbackCategories() {
  return categoryCatalog.map((category) => normalizeCategory({ ...category, id: category.code, name: category.label })).filter(Boolean)
}

function buildMetaTagCategory(title) {
  return {
    id: 'meta-tags',
    code: 'meta-tags',
    label: title || '맞춤 상품',
    navLabel: title || '맞춤 상품',
    description: '',
    heroTitle: '',
    heroDescription: '',
    image: '',
  }
}

function buildSearchCategory() {
  return {
    id: 'search',
    code: 'search',
    label: '검색 결과',
    navLabel: '검색 결과',
    description: '',
    heroTitle: '',
    heroDescription: '',
    image: '',
  }
}

function ProductGrid({
  category,
  categories,
  error,
  isLoading,
  onRetry,
  onSizeChange,
  onSortChange,
  page,
  pageData,
  pageSize,
  products,
  query,
  sort,
}) {
  const [searchParams] = useSearchParams()
  const bookmarkedIds = useBookmarkedIds()
  const getPageHref = (pageOneBased) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', String(pageOneBased - 1))
    return `/shop?${nextSearchParams.toString()}`
  }

  const totalElements = pageData?.totalElements ?? 0
  const totalPages = Math.max(1, pageData?.totalPages ?? 1)
  const visibleStart = totalElements === 0 ? 0 : page * pageSize + 1
  const visibleEnd = Math.min(page * pageSize + products.length, totalElements)
  const title = query ? `'${query}' 검색 결과` : `${category.label} 카테고리`

  return (
    <main className="layout-container pt-10 pb-24">
      <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
        <div>
          <nav aria-label="현재 위치">
            <ol className="flex items-center text-caption text-muted">
              <Link to={'/home'} className="hover:text-ink transition-colors">
                홈
              </Link>
              <li aria-hidden="true"><ChevronRight className="size-3.5 shrink-0" strokeWidth={2} /></li>
              <li aria-current="page">
                <Link to={`/shop?categoryId=${encodeURIComponent(category.id ?? category.id)}`} className="hover:text-ink transition-colors">
                {category.navLabel}
                </Link>
                </li>
            </ol>
          </nav>
          <h1 className="mt-5 text-3xl font-bold">{title}</h1>
          {category.description && <p className="mt-4 text-body-lg text-foreground">{category.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-body-sm">
          <label className="flex items-center gap-3">
            <span className="text-muted">표시 개수:</span>
            <select
              className="h-11 rounded border border-border bg-surface px-4 text-ink"
              value={pageSize}
              onChange={(event) => onSizeChange(Number(event.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option value={option} key={option}>{option}개씩 보기</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3">
            <span className="text-muted">정렬 기준:</span>
            <select
              className="h-11 rounded border border-border bg-surface px-4 text-ink"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {category.image && (
        <section
          className="mb-14 h-banner overflow-hidden rounded-md bg-ink px-10 pt-hero-inset text-white"
          style={{
            backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--color-navy) 92%, transparent), color-mix(in srgb, var(--color-navy) 44%, transparent)), url(${category.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <span className="rounded-sm bg-brand px-3 py-2 text-caption font-bold">시즌 이벤트</span>
          <h2 className="mt-5 text-2xl font-light">{category.heroTitle}</h2>
          <p className="mt-4 max-w-prose text-body leading-6 text-on-navy-muted">{category.heroDescription}</p>
        </section>
      )}

      <div className="a11y-grid-sidebar grid gap-10 max-lg:grid-cols-1">

        <section>
          {isLoading && (
            <div className="rounded border border-border-soft bg-surface px-6 py-10 text-center text-muted">
              상품을 불러오는 중입니다.
            </div>
          )}

          {error && (
            <div className="rounded border border-error-border bg-surface px-6 py-10 text-center text-error">
              <p>상품 목록을 불러오지 못했습니다.</p>
              <Button className="mt-4" type="button" variant="secondary" size="sm" onClick={onRetry}>
                다시 시도
              </Button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <p className="mb-6 text-body-sm font-semibold text-foreground">
                총 {totalElements}개 상품 중 {visibleStart}-{visibleEnd}개 표시
              </p>
              <div className="a11y-grid-products grid grid-cols-4 gap-7 max-xl:grid-cols-2 max-sm:grid-cols-1">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} to={`/shop/${product.id}`} initialBookmarked={bookmarkedIds.has(Number(product.id))} />
                ))}
              </div>
              {products.length === 0 && (
                <div className="rounded border border-border-soft bg-surface px-6 py-10 text-center text-muted">
                  선택한 조건과 일치하는 상품이 없습니다.
                </div>
              )}
              <Pagination
                className="mt-16"
                page={page + 1}
                totalPages={totalPages}
                getPageHref={getPageHref}
                ariaLabel="상품 페이지"
              />
            </>
          )}
        </section>
      </div>
    </main>
  )
}

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query')?.trim() ?? ''
  const categoryIdParam = searchParams.get('categoryId') ?? ''
  const legacyCategoryCode = searchParams.get('category') ?? ''
  const page = parsePage(searchParams.get('page'))
  const pageSize = parsePageSize(searchParams.get('size'))
  const metaTagIds = searchParams.getAll('metaTagIds').map(Number).filter((id) => Number.isFinite(id) && id > 0)
  const match = searchParams.get('match') === 'all' ? 'all' : 'any'
  const listTitle = searchParams.get('title')?.trim() ?? ''
  const sortParam = searchParams.get('sort')
  const sort = META_TAG_SORT_VALUES.has(sortParam) ? sortParam : DEFAULT_SORT
  const [categories, setCategories] = useState(() => buildFallbackCategories())
  const legacyCategory = useMemo(() => {
    const fallbackCategory = getCategoryByCode(legacyCategoryCode)

    return categories.find((item) => (
      item.id === legacyCategoryCode ||
      item.code === legacyCategoryCode ||
      item.label === fallbackCategory?.label ||
      item.navLabel === fallbackCategory?.navLabel
    ))
  }, [categories, legacyCategoryCode])
  const categoryId = categoryIdParam || legacyCategory?.id || legacyCategoryCode
  const category = useMemo(() => categories.find((item) => item.id === categoryId) ?? normalizeCategory({ id: categoryId, name: '상품' }), [categories, categoryId])
  const categoryProductsQuery = useCategoryProductsQuery({ categoryId, page, size: pageSize, sort, keyword: query })
  const productsQuery = useProductsQuery({ keyword: query, page, size: pageSize, sort })
  const metaTagProductsQuery = useMetaTagProductsQuery({ metaTagIds, match, page, size: pageSize, sort })
  const activeProductsQuery = metaTagIds.length > 0
    ? metaTagProductsQuery
    : categoryId
      ? categoryProductsQuery
      : productsQuery

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const categoryResponse = await fetchCategories()
        const nextCategories = Array.isArray(categoryResponse)
          ? categoryResponse.map(normalizeCategory).filter(Boolean)
          : []

        if (isMounted && nextCategories.length > 0) {
          setCategories(nextCategories)
        }
      } catch {
        if (isMounted) {
          setCategories(buildFallbackCategories())
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const updateListParams = (nextValues) => {
    const nextSearchParams = new URLSearchParams(searchParams)

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value == null || value === '') {
        nextSearchParams.delete(key)
        return
      }

      nextSearchParams.set(key, String(value))
    })

    setSearchParams(nextSearchParams)
  }

  const handleSortChange = (nextSort) => {
    updateListParams({ sort: nextSort, page: 0 })
  }

  const handleSizeChange = (nextSize) => {
    updateListParams({ size: nextSize, page: 0 })
  }

  const getCategoryPath = (categoryCode) => {
    const fallbackCategory = getCategoryByCode(categoryCode)
    const nextCategory = categories.find((item) => (
      item.id === categoryCode ||
      item.code === categoryCode ||
      item.label === fallbackCategory?.label ||
      item.navLabel === fallbackCategory?.navLabel
    ))
    const nextCategoryId = nextCategory?.id ?? categoryCode

    return `/shop?categoryId=${encodeURIComponent(nextCategoryId)}&sort=${DEFAULT_SORT}&size=${DEFAULT_PAGE_SIZE}&page=0`
  }

  let content

  if (!categoryId && !query && metaTagIds.length === 0) {
    content = <SearchPage getCategoryPath={getCategoryPath} />
  } else if (query && metaTagIds.length === 0 && !activeProductsQuery.isLoading && !activeProductsQuery.error && activeProductsQuery.data?.totalElements === 0) {
    content = <EmptySearchResultsPage getCategoryPath={getCategoryPath} query={query} />
  } else {
    content = (
      <ProductGrid
        category={
          metaTagIds.length > 0
            ? buildMetaTagCategory(listTitle)
            : categoryId
              ? category
              : buildSearchCategory()
        }
        categories={categories}
        error={activeProductsQuery.error}
        isLoading={activeProductsQuery.isLoading}
        onRetry={activeProductsQuery.refetch}
        onSizeChange={handleSizeChange}
        onSortChange={handleSortChange}
        page={page}
        pageData={activeProductsQuery.data}
        pageSize={pageSize}
        products={activeProductsQuery.data?.content ?? []}
        query={query}
        sort={sort}
      />
    )
  }

  return content
}

export default ProductListPage
