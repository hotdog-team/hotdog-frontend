import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Star, MessageCircle, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination } from '../../../components/index.js'
import ReviewFormModal from '../../../components/review/ReviewFormModal.jsx'
import axiosInstance from '../../../api/axiosInstance.js'
import { deleteReview, updateReview } from '../../../api/reviewApi.js'
import { resolveImageUrl } from '../../../api/imageApi.js'
import { resolveReviewImageUrl } from '../../../utils/reviewImage.js'

export default function MyReviews() {
  const [reviews, setReviews] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

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
    if (window.confirm('리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.')) {
      try {
        await deleteReview(reviewId)
        setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId))
        toast.success('리뷰가 정상적으로 삭제되었습니다.')
      } catch {
        toast.error('리뷰 삭제에 실패했습니다.')
      }
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

  if (isLoading) return <div className="flex h-full items-center justify-center font-bold text-ink">로딩 중...</div>

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">내가 작성한 리뷰</h2>
        <p className="mt-2 text-sm text-muted">구매하신 상품에 대해 남겨주신 소중한 후기 목록입니다.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-20 shadow-sm">
          <MessageCircle className="mb-4 size-12 text-muted" strokeWidth={1.5} />
          <p className="text-lg font-bold text-ink">작성하신 리뷰가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 mb-10">
            {reviews.map((review) => (
              <div key={review.reviewId} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border-soft pb-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={resolveImageUrl(review.productImageUrl) || 'https://via.placeholder.com/100'}
                      alt={review.productName}
                      className="size-16 rounded-lg object-cover border border-border-soft bg-surface-muted"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-ink truncate">{review.productName}</h3>
                      <div className="mt-1 flex items-center gap-0.5">
                        <span className="sr-only">별점 {review.rating}점</span>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${i < review.rating ? 'fill-rating text-rating' : 'fill-border text-border-soft'}`}
                            strokeWidth={0}
                          />
                        ))}
                        <span className="ml-2 text-xs text-muted">
                          작성일 {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => setSelectedReview(review)} className="flex items-center gap-1">
                      <Edit2 className="size-3.5" /> 수정
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(review.reviewId)} className="flex items-center gap-1">
                      <Trash2 className="size-3.5" /> 삭제
                    </Button>
                  </div>
                </div>
                <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap pl-1">{review.content}</p>
                {review.imageUrl && (
                  <img
                    src={resolveImageUrl(review.imageUrl)}
                    alt="리뷰 첨부 이미지"
                    className="mt-4 max-h-48 max-w-xs rounded-md border border-border object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <Pagination page={currentPage} totalPages={totalPages} getPageHref={(p) => `${location.pathname}?page=${p}`} />
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
    </div>
  )
}
