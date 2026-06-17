import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Star } from 'lucide-react'
import { toast } from 'react-toastify'
import { Pagination, PageLoadingBox, PageEmptyBox } from '../../../components/index.js'
import { resolveImageUrl } from '../../../api/imageApi.js'
import { getProductReviews, updateReview, deleteReview } from '../../../api/reviewApi.js'
import { resolveReviewImageUrl } from '../../../utils/reviewImage.js'
import { useAuthStore } from '../../../store/useAuthStore.js'
import ReviewFormModal from '../../../components/review/ReviewFormModal.jsx'

const PAGE_SIZE = 5

function StarDisplay({ rating, size = 'sm' }) {
  const cls = size === 'sm' ? 'size-3.5' : 'size-5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= rating ? 'fill-rating text-rating' : 'fill-border text-border-soft'}`}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

export default function ProductReviewSection({ productId, averageRate, reviewCount }) {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const currentPage = Math.max(1, parseInt(searchParams.get('reviewPage') || '1', 10))

  const [reviews, setReviews] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [editingReview, setEditingReview] = useState(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await getProductReviews(productId, currentPage - 1, PAGE_SIZE)
      setReviews(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch {
      toast.error('리뷰를 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (productId) fetchReviews()
  }, [productId, currentPage])

  const handleReviewSubmit = async ({ rating, content, file, imageUrl }) => {
    if (!editingReview?.reviewId) return

    setIsSubmittingReview(true)
    try {
      let uploadedImageUrl = null
      if (file) {
        uploadedImageUrl = await resolveReviewImageUrl({ file, imageUrl: null })
      } else if (imageUrl) {
        uploadedImageUrl = imageUrl
      }

      await updateReview(editingReview.reviewId, {
        rating,
        content,
        imageUrl: uploadedImageUrl,
      })

      toast.success('리뷰가 수정되었습니다.')
      setEditingReview(null)
      fetchReviews()
    } catch (error) {
      const isUploadError = file && String(error?.config?.url ?? '').includes('/api/images/upload')
      toast.error(
        isUploadError
          ? '이미지 업로드에 실패했습니다. JPG/PNG 파일인지 확인해 주세요.'
          : '리뷰 수정에 실패했습니다.',
      )
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return
    try {
      await deleteReview(reviewId)
      toast.success('리뷰가 삭제되었습니다.')
      fetchReviews()
    } catch {
      toast.error('리뷰 삭제에 실패했습니다.')
    }
  }

  const getReviewPageHref = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('reviewPage', page)
    return `${location.pathname}?${params.toString()}#reviews`
  }

  return (
    <section id="reviews" className="mt-24 scroll-mt-14">
      <div className="mb-8 flex items-end gap-6">
        <div>
          <h2 className="text-xl font-bold text-ink">리뷰 {reviewCount}건</h2>
          {reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarDisplay rating={Math.round(averageRate)} size="md" />
              <span className="text-body-lg font-bold text-ink">
                {averageRate?.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <PageLoadingBox label="리뷰를 불러오는 중입니다." />
      ) : reviews.length === 0 ? (
        <PageEmptyBox
          title="아직 작성된 리뷰가 없습니다."
          description="이 제품의 첫 리뷰 작성자가 되어주세요."
        />
      ) : (
        <>
          <div className="divide-y divide-border rounded-md border border-border bg-surface">
            {reviews.map((review) => {
              const isOwner = user?.name === review.memberName
              const dateStr = review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('ko-KR')
                : ''

              return (
                <div key={review.reviewId} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted font-bold text-ink">
                        {review.memberName?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-ink">{review.memberName}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <StarDisplay rating={review.rating} />
                          <span className="text-caption text-muted">{dateStr}</span>
                        </div>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="text-caption text-muted hover:text-ink"
                          onClick={() => setEditingReview(review)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="text-caption text-muted hover:text-error"
                          onClick={() => handleDelete(review.reviewId)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap pl-12 text-body-sm leading-relaxed text-foreground">
                    {review.content}
                  </p>
                  {review.imageUrl && (
                    <img
                      src={resolveImageUrl(review.imageUrl)}
                      alt="리뷰 첨부 이미지"
                      className="mt-3 ml-12 max-h-48 max-w-xs rounded-md border border-border object-cover"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <Pagination
            className="mt-8"
            page={currentPage}
            totalPages={totalPages}
            getPageHref={getReviewPageHref}
            ariaLabel="리뷰 페이지"
          />
        </>
      )}

      {editingReview && (
        <ReviewFormModal
          mode="edit"
          product={{
            name: editingReview.productName,
            imageUrl: editingReview.productImageUrl,
          }}
          initialValues={{
            rating: editingReview.rating,
            content: editingReview.content,
            imageUrl: editingReview.imageUrl,
          }}
          onClose={() => setEditingReview(null)}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmittingReview}
        />
      )}
    </section>
  )
}
