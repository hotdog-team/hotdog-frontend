import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { PackageOpen, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination, Select, PageLoadingBox } from '../../../components/index.js'
import { MyPageHeader, MyPageEmptyState, MyPageLoading, MyPagePanel } from '../../../components/mypage/MyPageUi.jsx'
import { fetchCategories } from '../../../api/categoryApi.js'
import { removeBookmark } from '../../../api/bookmarkApi.js'
import axiosInstance from '../../../api/axiosInstance.js'
import { resolveImageUrl } from '../../../api/imageApi.js'

function BookmarkCard({ item, onRemove }) {
  const productPath = `/shop/${item.productId}`
  const imageUrl = resolveImageUrl(item.imageUrl)
  const discountRate = Number(item.discountRate ?? 0)
  const salePrice = Number(item.salePrice ?? item.originPrice ?? 0)
  const originPrice = Number(item.originPrice ?? 0)
  const hasDiscount = discountRate > 0
  const isSoldOut = item.status === 'SOLD_OUT'

  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-card">
      <div className="relative flex items-center gap-4 p-5">
        <button
          type="button"
          className="absolute top-4 right-4 z-10 p-1 text-muted hover:text-ink"
          onClick={() => onRemove(item.productId)}
          aria-label={`${item.productName} 찜 해제`}
        >
          <X className="size-5" strokeWidth={2} aria-hidden="true" />
        </button>

        <Link
          to={productPath}
          className="flex min-w-0 flex-1 items-center gap-4 pr-8 motion-safe-transition hover:opacity-90"
        >
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-20">
            {imageUrl ? (
              <img className="h-full w-full object-cover" src={imageUrl} alt="" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-caption text-muted">
                이미지 없음
              </div>
            )}
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-body font-bold text-white">품절</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-body font-medium text-ink">
              {item.productName}
            </p>
            <p className="mt-2 flex min-w-0 items-baseline gap-1 text-body-lg font-bold text-ink">
              {hasDiscount && (
                <span className="text-[0.9em] text-brand">{discountRate}%</span>
              )}
              <span className="inline-flex items-baseline">
                <span>{salePrice.toLocaleString()}</span>
                <span className="text-body font-medium">원</span>
              </span>
            </p>
            {hasDiscount && (
              <p className="mt-1 text-body-sm text-muted line-through">
                {originPrice.toLocaleString()}원
              </p>
            )}
          </div>
        </Link>
      </div>
    </article>
  )
}

export default function MyBookmarks() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [bookmarks, setBookmarks] = useState([])
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const currentPage = Number(searchParams.get('page')) || 1
  const categoryIdParam = searchParams.get('categoryId')
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : null

  const updateFilters = ({ categoryId, page = 1 }) => {
    const params = new URLSearchParams()
    params.set('page', String(page))

    if (categoryId) {
      params.set('categoryId', String(categoryId))
    }

    setSearchParams(params)
  }

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const raw = Array.isArray(data) ? data : data?.data ?? []
        setCategories(raw.filter((category) => category?.id != null || category?.code != null))
      })
      .catch(() => {})
  }, [])

  const fetchBookmarks = async ({
    page = currentPage,
    categoryId = selectedCategoryId,
  } = {}) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/api/bookmarks', {
        params: {
          page: page - 1,
          size: 10,
          ...(categoryId ? { categoryId } : {}),
        },
      })
      setBookmarks(response.data.content || [])
      setTotalPages(response.data.totalPages || 1)
    } catch {
      toast.error('찜한 상품을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [currentPage, selectedCategoryId])

  const handleSearch = () => {
    if (currentPage !== 1) {
      updateFilters({ categoryId: selectedCategoryId, page: 1 })
      return
    }
    fetchBookmarks({ page: 1, categoryId: selectedCategoryId })
  }

  const handleReset = () => {
    setSearchParams(new URLSearchParams({ page: '1' }))
  }

  const handleRemove = async (productId) => {
    try {
      await removeBookmark(productId)
      setBookmarks((prev) => prev.filter((item) => item.productId !== productId))
      toast.success('찜 목록에서 제거했습니다.')
    } catch {
      toast.error('찜 해제에 실패했습니다.')
    }
  }

  if (isLoading && bookmarks.length === 0 && categories.length === 0) {
    return <MyPageLoading label="찜한 상품을 불러오는 중입니다." />
  }

  return (
    <>
      <MyPageHeader
        title="찜한 상품"
        description="관심 상품으로 등록한 목록입니다."
      />

      <MyPagePanel className="mt-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Select
            id="bookmark-category-filter"
            label="카테고리"
            size="sm"
            className="min-w-36"
            options={[
              { value: 'ALL', label: '전체' },
              ...categories.map((category) => {
                const categoryId = Number(category.id ?? category.code)
                return {
                  value: String(categoryId),
                  label: category.label ?? category.name,
                }
              }),
            ]}
            value={selectedCategoryId ?? 'ALL'}
            onChange={(event) => {
              const value = event.target.value
              updateFilters({
                categoryId: value === 'ALL' ? null : Number(value),
                page: 1,
              })
            }}
          />

          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSearch}>
              조회
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </div>
      </MyPagePanel>

      <section className="mt-6 grid gap-4">
        {isLoading ? (
          <PageLoadingBox label="찜한 상품을 불러오는 중입니다." />
        ) : bookmarks.length === 0 ? (
          <MyPageEmptyState
            icon={PackageOpen}
            title="찜한 상품이 없습니다."
            action={(
              <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
                쇼핑하러 가기
              </Button>
            )}
          />
        ) : (
          bookmarks.map((item) => (
            <BookmarkCard
              key={item.bookmarkId}
              item={item}
              onRemove={handleRemove}
            />
          ))
        )}
      </section>

      {!isLoading && bookmarks.length > 0 && (
        <Pagination
          className="mt-6"
          page={currentPage}
          totalPages={totalPages}
          getPageHref={(p) => {
            const params = new URLSearchParams(searchParams)
            params.set('page', String(p))
            return `/mypage/bookmarks?${params.toString()}`
          }}
        />
      )}
    </>
  )
}
