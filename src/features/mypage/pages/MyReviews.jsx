import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, MessageCircle, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination } from '../../../components/index.js'
import { MyPageHeader, MyPageEmptyState, MyPageLoading } from '../../../components/mypage/MyPageUi.jsx'
import ReviewFormModal from '../../../components/review/ReviewFormModal.jsx'
import axiosInstance from '../../../api/axiosInstance.js'
import { deleteReview, updateReview } from '../../../api/reviewApi.js'
import { resolveImageUrl } from '../../../api/imageApi.js'
import { resolveReviewImageUrl } from '../../../utils/reviewImage.js'

function ReviewCard({ review, onEdit, onDelete }) {
  const imageUrl = resolveImageUrl(review.productImageUrl)
  const productPath = review.productId ? `/shop/${review.productId}` : null
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('ko-KR')
    : ''

  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-card">
      <div className="relative p-5 pb-4">
        <button
          type="button"
          className="absolute top-4 right-4 z-10 p-1 text-muted hover:text-ink"
          onClick={() => onDelete(review.reviewId)}
          aria-label={`${review.productName} 리뷰 삭제`}
        >
          <X className="size-5" strokeWidth={2} aria-hidden="true" />
        </button>

        {productPath ? (
          <Link
            to={productPath}
            className="flex items-start gap-4 pr-8 motion-safe-transition hover:opacity-90"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-20">
              {imageUrl ? (
                <img className="h-full w-full object-cover" src={imageUrl} alt="" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-caption text-muted">
                  이미지 없음
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-body font-medium text-ink">
                {review.productName}
              </p>
              {formattedDate && (
                <p className="mt-1 text-body-sm text-muted">작성일 {formattedDate}</p>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-start gap-4 pr-8">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-20">
              {imageUrl ? (
                <img className="h-full w-full object-cover" src={imageUrl} alt="" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-caption text-muted">
                  이미지 없음
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-body font-medium text-ink">
                {review.productName}
              </p>
              {formattedDate && (
                <p className="mt-1 text-body-sm text-muted">작성일 {formattedDate}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mx-5 border-t border-border" aria-hidden="true" />

      <div className="p-5 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <span className="sr-only">별점 {review.rating}점</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-4 ${star <= review.rating ? 'fill-rating text-rating' : 'fill-border text-border-soft'}`}
                  strokeWidth={0}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-body-lg font-bold leading-none text-ink tabular-nums">
              {review.rating}
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={() => onEdit(review)}>
            수정
          </Button>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-body leading-relaxed text-ink">
          {review.content}
        </p>

        {review.imageUrl && (
          <img
            src={resolveImageUrl(review.imageUrl)}
            alt="리뷰 첨부 이미지"
            className="mt-4 max-h-48 max-w-xs rounded-md border border-border object-cover"
          />
        )}
      </div>
    </article>
  )
}

export default function MyReviews() {
  const [reviews, setReviews] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const [searchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/api/reviews/my?page=${currentPage - 1}&size=10`)
      setReviews(response.data.content || [])
      setTotalPages(response.data.totalPages || 1)
    } catch {
      toast.error('리뷰 내역을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [currentPage])

  const handleDelete = async (reviewId) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.')) {
      return
    }

    try {
      await deleteReview(reviewId)
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId))
      toast.success('리뷰가 정상적으로 삭제되었습니다.')
    } catch {
      toast.error('리뷰 삭제에 실패했습니다.')
    }
  }

  const handleReviewSubmit = async ({ rating, content, file, imageUrl }) => {
    if (!selectedReview?.reviewId) return

    setIsSubmittingReview(true)
    try {
      let uploadedImageUrl = null
      if (file) {
        uploadedImageUrl = await resolveReviewImageUrl({ file, imageUrl: null })
      } else if (imageUrl) {
        uploadedImageUrl = imageUrl
      }

      await updateReview(selectedReview.reviewId, {
        rating,
        content,
        imageUrl: uploadedImageUrl,
      })

      toast.success('리뷰가 성공적으로 수정되었습니다.')
      setSelectedReview(null)
      fetchReviews()
    } catch (error) {
      console.error('리뷰 수정 실패:', error)
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

  if (isLoading) {
    return <MyPageLoading label="리뷰 내역을 불러오는 중입니다." />
  }

  return (
    <>
      <MyPageHeader
        title="내 리뷰"
        description="작성한 상품 리뷰를 확인하고 수정할 수 있습니다."
      />

      {reviews.length === 0 ? (
        <MyPageEmptyState icon={MessageCircle} title="작성한 리뷰가 없습니다." />
      ) : (
        <>
          <section className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onEdit={setSelectedReview}
                onDelete={handleDelete}
              />
            ))}
          </section>

          <Pagination
            className="mt-6"
            page={currentPage}
            totalPages={totalPages}
            getPageHref={(p) => `/mypage/reviews?page=${p}`}
          />
        </>
      )}

      {selectedReview && (
        <ReviewFormModal
          mode="edit"
          product={{
            name: selectedReview.productName,
            imageUrl: selectedReview.productImageUrl,
          }}
          initialValues={{
            rating: selectedReview.rating,
            content: selectedReview.content,
            imageUrl: selectedReview.imageUrl,
          }}
          onClose={() => setSelectedReview(null)}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmittingReview}
        />
      )}
    </>
  )
}
