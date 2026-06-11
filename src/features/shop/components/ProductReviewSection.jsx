import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Star, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination } from '../../../components/index.js'
import { getProductReviews, updateReview, deleteReview } from '../../../api/reviewApi.js'
import { useAuthStore } from '../../../store/useAuthStore.js'

const PAGE_SIZE = 5

function StarDisplay({ rating, size = 'sm' }) {
  const cls = size === 'sm' ? 'size-3.5' : 'size-5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= rating ? 'fill-brand text-brand' : 'fill-border text-border-soft'}`}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star}점`}
        >
          <Star
            className={`size-7 transition-colors ${
              star <= (hovered || value)
                ? 'fill-brand text-brand'
                : 'fill-border text-border-soft hover:fill-brand/40'
            }`}
            strokeWidth={0}
          />
        </button>
      ))}
      <span className="ml-2 self-center text-body-sm text-muted">{value}점</span>
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
  const [editForm, setEditForm] = useState({ rating: 5, content: '' })

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

  const openEditModal = (review) => {
    setEditingReview(review)
    setEditForm({ rating: review.rating, content: review.content })
  }

  const closeEditModal = () => {
    setEditingReview(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editForm.content.trim()) {
      toast.error('리뷰 내용을 입력해주세요.')
      return
    }
    try {
      await updateReview(editingReview.reviewId, editForm)
      toast.success('리뷰가 수정되었습니다.')
      closeEditModal()
      fetchReviews()
    } catch {
      toast.error('리뷰 수정에 실패했습니다.')
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
        <p className="py-10 text-center text-muted">리뷰를 불러오는 중입니다.</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-md border border-border bg-surface py-16 text-center">
          <p className="text-body font-medium text-ink">아직 작성된 리뷰가 없습니다.</p>
          <p className="mt-2 text-body-sm text-muted">이 제품의 첫 리뷰 작성자가 되어주세요.</p>
        </div>
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
                          onClick={() => openEditModal(review)}
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

                  <p className="mt-3 text-body-sm leading-relaxed text-foreground whitespace-pre-wrap pl-12">
                    {review.content}
                  </p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border-soft bg-surface p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">리뷰 수정</h3>
              <button type="button" onClick={closeEditModal} className="text-muted hover:text-error">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-2 block text-body-sm font-semibold text-ink">별점</label>
                <StarSelector
                  value={editForm.rating}
                  onChange={(v) => setEditForm((prev) => ({ ...prev, rating: v }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-body-sm font-semibold text-ink">리뷰 내용</label>
                <textarea
                  required
                  rows={4}
                  value={editForm.content}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full resize-none rounded-md border border-border-soft bg-white p-3 text-body-sm outline-none focus:border-brand"
                  placeholder="상품에 대한 솔직한 후기를 남겨주세요."
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-border-soft pt-4">
                <Button type="button" variant="outline" size="sm" onClick={closeEditModal}>
                  취소
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  수정 완료
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
