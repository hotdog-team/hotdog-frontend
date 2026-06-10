import { useState, useEffect } from 'react'
import { Gavel, MessageSquare, Trash2, Check } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function ModerationManagement() {
  const [qnas, setQnas] = useState([])
  const [replyContent, setReplyContent] = useState({})


    const fetchWaitingQnas = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/qnas?status=WAITING&page=0&size=20');
        const allQnas = response.data.content || response.data;
        const waitingOnly = allQnas.filter(qna => qna.status === 'WAITING');
        setQnas(waitingOnly);
      } catch (err) {
        toast.error('문의 목록 로드 실패');
      }
    };

  const fetchQnas = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/qnas?status=WAITING&page=0&size=20')
        const data = response.data.content || response.data

        const filteredData = Array.isArray(data)
          ? data.filter(qna => qna.status === 'WAITING')
          : [];

        setQnas(filteredData)
      } catch (err) {
        toast.error('문의 목록을 불러오는 데 실패했습니다.')
      }
    }

  useEffect(() => {
    fetchQnas()
  }, [])

  const handleReplyChange = (id, value) => {
    setReplyContent((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmitReply = async (id) => {
    const answer = replyContent[id]
    if (!answer?.trim()) return toast.warn('답변 내용을 입력해 주세요.')

    try {
      await axiosInstance.patch(`/api/admin/qnas/${id}`, { answer })
      toast.success('답변이 등록되어 완료 처리되었습니다.')
      fetchQnas()
    } catch (err) {
      toast.error('답변 등록에 실패했습니다.')
    }
  }

  const handleDeleteQna = async (id) => {
    if (!window.confirm('해당 문의글을 강제 삭제하시겠습니까?')) return

    try {
      await axiosInstance.delete(`/api/admin/qnas/${id}`)
      toast.success('문의글이 삭제 처리(Soft Delete) 되었습니다.')
      fetchQnas()
    } catch (err) {
      toast.error('삭제 처리에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6">
        <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
          <Gavel className="text-error" size={28} /> 콘텐츠 모니터링 (1:1 문의 처리)
        </h1>
        <p className="mt-2 text-muted">접수된 1:1 문의 사항(WAITING)을 확인하고 답변을 등록하거나 부적절한 게시글을 강제 삭제합니다.</p>
      </div>

      <div className="space-y-6">
        {qnas.length === 0 ? (
          <div className="bg-surface border border-border-soft rounded-lg p-12 text-center text-muted">
            대기 중인 1:1 문의글이 없습니다.
          </div>
        ) : (
          qnas.map((qna) => (
            <div key={qna.id} className="bg-surface border border-border-soft rounded-lg shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-border-soft pb-4">
                <div>
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <MessageSquare size={18} className="text-brand"/> {qna.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    작성자: {qna.memberEmail || '알수없음'} | 등록일: {qna.createdAt ? new Date(qna.createdAt).toLocaleString() : '최근'}
                  </p>
                </div>
                <button onClick={() => handleDeleteQna(qna.id)} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors text-sm flex items-center gap-1 font-bold">
                  <Trash2 size={16} /> 강제 삭제
                </button>
              </div>

              <div className="text-body text-ink whitespace-pre-wrap py-2">
                {qna.content}
              </div>

              <div className="flex gap-3 pt-4 border-t border-border-soft bg-surface-muted p-4 rounded-md">
                <input
                  type="text"
                  placeholder="답변 내용을 입력하세요..."
                  value={replyContent[qna.id] || ''}
                  onChange={(e) => handleReplyChange(qna.id, e.target.value)}
                  className="flex-1 p-3 border border-border-soft rounded-md focus:outline-none focus:border-brand"
                />
                <Button onClick={() => handleSubmitReply(qna.id)} variant="primary" size="md" className="flex items-center gap-2 shrink-0">
                  <Check size={18} /> 답변 등록
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}