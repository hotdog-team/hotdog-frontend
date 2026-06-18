import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCategories } from '../../../api/categoryApi'
import { Button, Pagination, ProductCard } from '../../../components/index.js'
import {
  useCategoryProductsQuery,
  useMetaTagProductsQuery,
  useProductsQuery,
  useRecommendProductsQuery,
} from '../../../hooks/queries/useProductQuery'
import useBookmarkedIds from '../../../hooks/useBookmarkedIds.js'
import { useAuthStore } from '../../../store/useAuthStore.js'

import {
  categoryCatalog,
  getCategoryByCode,
} from '../data/catalog'
import { buildRecommendListPath } from '../../../constants/profileMetaTags.js'
import ShopBreadcrumb from '../components/ShopBreadcrumb.jsx'
import ProductSortBar, { PRODUCT_SORT_OPTIONS } from '../components/ProductSortBar.jsx'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_SORT = 'RECOMMEND'

const PAGE_SIZE_OPTIONS = [20, 40, 60, 100]

const META_TAG_SORT_VALUES = new Set([...PRODUCT_SORT_OPTIONS.map((option) => option.value), 'ATTENTION'])

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

function buildRecommendCategory(title) {
  return {
    id: 'recommend',
    code: 'recommend',
    label: title || '오늘의 맞춤 추천',
    navLabel: title || '오늘의 맞춤 추천',
    description: '',
    heroTitle: '',
    heroDescription: '',
    image: '',
  }
}

function ProductGrid({
  category,
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
  listTitle,
}) {
  const [searchParams] = useSearchParams()
  const bookmarkedIds = useBookmarkedIds()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const getPageHref = (pageOneBased) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', String(pageOneBased - 1))
    return `/shop?${nextSearchParams.toString()}`
  }

  const totalElements = pageData?.totalElements ?? 0
  const totalPages = Math.max(1, pageData?.totalPages ?? 1)
  const heading = query
    ? null
    : ['recommend', 'meta-tags', 'search'].includes(category.code)
      ? category.label
      : `${category.label} 카테고리`
  const categoryListPath = category.code === 'recommend'
    ? buildRecommendListPath({ title: listTitle || '오늘의 맞춤 추천' })
    : ['meta-tags', 'search'].includes(category.code)
      ? '/shop'
      : `/shop?categoryId=${encodeURIComponent(category.id)}`

  return (
    <main className="layout-container pt-8 pb-24">
      <div className="mb-8">
        <ShopBreadcrumb
          items={[
            { label: '홈', to: '/home' },
            { label: category.navLabel, to: categoryListPath, isCurrent: true },
          ]}
        />
        <div className="mt-2">
          <h1 className="text-3xl font-bold">
            {query ? (
              <>
                &apos;{query}&apos; 검색 결과
                {!isLoading && !error ? ` ${totalElements.toLocaleString()}건` : ''}
              </>
            ) : (
              heading
            )}
          </h1>
        </div>
        {category.description && <p className="mt-4 text-body-lg text-foreground">{category.description}</p>}
      </div>

      <div className="mb-8 border-y border-border-soft py-2">
        <ProductSortBar
          sort={sort}
          onSortChange={onSortChange}
          pageSize={pageSize}
          onSizeChange={onSizeChange}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showRecommendHelp={isAuthenticated}
        />
      </div>

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
            <div className="a11y-grid-products grid grid-cols-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={`/shop/${product.id}`}
                  initialBookmarked={bookmarkedIds.has(Number(product.id))}
                  isDislikeView={!query}
                />
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
  const isRecommendList = searchParams.get('list') === 'recommend'
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
  const recommendProductsQuery = useRecommendProductsQuery({ page, size: pageSize, sort })
  const metaTagProductsQuery = useMetaTagProductsQuery({ metaTagIds, match, page, size: pageSize, sort })
  const isBareShopLanding = !categoryId && !query && metaTagIds.length === 0
  const shouldUseRecommendQuery = isRecommendList || isBareShopLanding
  const activeProductsQuery = metaTagIds.length > 0
    ? metaTagProductsQuery
    : categoryId
      ? categoryProductsQuery
      : shouldUseRecommendQuery
        ? recommendProductsQuery
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

  return (
    <ProductGrid
      category={
        metaTagIds.length > 0
          ? buildMetaTagCategory(listTitle)
          : categoryId
            ? category
            : shouldUseRecommendQuery
              ? buildRecommendCategory(listTitle)
              : buildSearchCategory()
      }
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
      listTitle={listTitle}
    />
  )
}

export default ProductListPage
