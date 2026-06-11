import { useState, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, ProductCard, Pagination } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function MyBookmarks() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(`/api/bookmarks?page=${currentPage - 1}&size=9`)
        setBookmarks(response.data.content || [])
        setTotalPages(response.data.totalPages || 1)
      } catch (err) {
        toast.error('찜한 상품을 불러오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookmarks()
  }, [currentPage])

  if (isLoading) {
    return <div className="flex h-full items-center justify-center font-bold text-ink">로딩 중...</div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">찜한 상품</h2>
        <p className="mt-2 text-sm text-muted">관심 상품으로 등록하신 제품 목록입니다.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-20 shadow-sm">
          <PackageOpen className="mb-4 size-12 text-muted" strokeWidth={1.5} />
          <p className="text-lg font-bold text-ink">찜한 상품이 없습니다.</p>
          <Button variant="primary" size="md" className="mt-6" onClick={() => navigate('/shop')}>
            쇼핑하러 가기
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {bookmarks.map((item) => {
              const productData = {
                id: item.productId,
                name: item.productName,
                image: item.imageUrl || '',
                salePrice: item.salePrice ?? item.originPrice ?? 0,
                originPrice: item.originPrice ?? 0,
                rating: item.averageRate ?? 0,
                reviews: item.reviewCount ?? 0,
              }

              return (
                <ProductCard
                  key={item.bookmarkId}
                  product={productData}
                  to={`/shop/${item.productId}`}
                  initialBookmarked
                  onBookmarkChange={(productId, isBookmarked) => {
                    if (!isBookmarked) {
                      setBookmarks((prev) => prev.filter((b) => b.productId !== productId))
                    }
                  }}
                  isDislikeView={false}
                />
              )
            })}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            getPageHref={(p) => `${location.pathname}?page=${p}`}
          />
        </>
      )}
    </div>
  )
}