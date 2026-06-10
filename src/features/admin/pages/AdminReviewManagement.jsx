import { useState, useEffect } from 'react'
import { MessageSquare, EyeOff, Star } from 'lucide-react'
import { toast } from 'react-toastify'
import axiosInstance from '../../../api/axiosInstance.js'

export default function AdminReviewManagement() {
  const [reviews, setReviews] = useState([])

  const fetchAllReviews = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/reviews');
      const data = Array.isArray(response.data) ? response.data : [];
      setReviews(data);
    } catch (err) {
      toast.error('리뷰 목록을 불러오는 데 실패했습니다.');
    }
  }

  useEffect(() => {
    fetchAllReviews()
  }, [])

  const handleHideReview = async (id) => {
    if (!window.confirm('이 리뷰를 블라인드(숨김) 처리하시겠습니까?')) return
    try {
      await axiosInstance.patch(`/api/admin/reviews/${id}`, { status: 'HIDDEN' })
      toast.success('리뷰가 블라인드 처리되었습니다.')
      fetchAllReviews()
    } catch (err) {
      toast.error('리뷰 상태 변경에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6">
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <MessageSquare className="text-brand" size={28} /> 리뷰 관리
        </h1>
        <p className="mt-2 text-muted">등록된 전체 리뷰를 조회하고 악성 리뷰를 블라인드 처리합니다.</p>
      </div>

      <div className="bg-surface border border-border-soft rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-muted border-b border-border-soft text-muted">
            <tr>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold w-48">상품명</th>
              <th className="p-4 font-semibold">리뷰 내용 / 별점</th>
              <th className="p-4 font-semibold w-24">상태</th>
              <th className="p-4 font-semibold text-right w-32">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {reviews.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-muted">등록된 리뷰가 없습니다.</td></tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className={`transition-colors ${review.status === 'HIDDEN' ? 'bg-surface-muted/30 opacity-60' : 'hover:bg-surface-muted/50'}`}>
                  <td className="p-4 text-muted">#{review.id}</td>
                  <td className="p-4 font-medium text-ink truncate">{review.productName || '알 수 없는 상품'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`size-3 ${i < review.rating ? 'fill-brand text-brand' : 'fill-border text-border-soft'}`} />)}
                    </div>
                    <p className="text-ink text-xs line-clamp-2">{review.content}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-sm text-xs font-bold ${review.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      {review.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {review.status !== 'HIDDEN' && (
                      <button onClick={() => handleHideReview(review.id)} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors flex items-center gap-1 ml-auto" title="블라인드">
                        <EyeOff size={16} /> <span className="text-xs font-bold">숨김</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}