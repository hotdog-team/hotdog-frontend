import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Star, MessageCircle, Trash2, Edit2, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function MyReviews() {
  const [reviews, setReviews] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState({ id: null, rating: 5, content: '' })

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/api/reviews/my?page=${currentPage - 1}&size=10`)
      setReviews(response.data.content || [])
      setTotalPages(response.data.totalPages || 1)
    } catch (err) {
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
        await axiosInstance.delete(`/api/reviews/${reviewId}`)
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        toast.success('리뷰가 정상적으로 삭제되었습니다.')
      } catch (err) {
        toast.error('리뷰 삭제에 실패했습니다.')
      }
    }
  }

  const openEditModal = (review) => {
    setEditingReview({
      id: review.reviewId,
      rating: review.rating,
      content: review.content
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateReview = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.patch(`/api/reviews/${editingReview.id}`, {
        rating: editingReview.rating,
        content: editingReview.content
      })
      toast.success('리뷰가 성공적으로 수정되었습니다.')
      setIsEditModalOpen(false)
      fetchReviews()
    } catch (err) {
      toast.error('리뷰 수정에 실패했습니다.')
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
                    <img src={review.productImageUrl || '/assets/placeholder.jpg'} alt={review.productName} className="size-16 rounded-lg object-cover border border-border-soft bg-surface-muted" />
                    <div className="min-w-0">
                      <h3 className="font-bold text-ink truncate">{review.productName}</h3>
                      <div className="mt-1 flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`size-4 ${i < review.rating ? 'fill-brand text-brand' : 'fill-border text-border-soft'}`} />
                        ))}
                        <span className="ml-2 text-xs text-muted">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(review)} className="flex items-center gap-1">
                      <Edit2 className="size-3.5" /> 수정
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(review.reviewId)} className="flex items-center gap-1">
                      <Trash2 className="size-3.5" /> 삭제
                    </Button>
                  </div>
                </div>
                <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap pl-1">{review.content}</p>
              </div>
            ))}
          </div>
          <Pagination page={currentPage} totalPages={totalPages} getPageHref={(p) => `${location.pathname}?page=${p}`} />
        </>
      )}

      {/* 리뷰 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-md border border-border-soft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">리뷰 수정</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleUpdateReview} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">별점</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setEditingReview({ ...editingReview, rating: star })}>
                      <Star className={`size-8 ${star <= editingReview.rating ? 'fill-brand text-brand' : 'fill-border text-border-soft hover:fill-brand/50 hover:text-brand/50'} transition-colors`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1">리뷰 내용</label>
                <textarea
                  required
                  rows={4}
                  value={editingReview.content}
                  onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                  className="w-full p-3 border border-border-soft rounded-md focus:border-brand outline-none resize-none bg-white"
                  placeholder="상품에 대한 솔직한 리뷰를 남겨주세요."
                />
              </div>
              <div className="pt-4 border-t border-border-soft flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">수정 완료</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}