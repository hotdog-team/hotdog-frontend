import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, Inbox, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function MyInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const [selectedIds, setSelectedIds] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ title: '', content: '' });

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const fetchInquiries = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/api/members/me/qnas?page=${currentPage - 1}&size=10`)
      setInquiries(response.data.content || [])
      setTotalPages(response.data.totalPages || 1)
      setSelectedIds([])
    } catch (err) {
      toast.error('문의 내역을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [currentPage])

  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/qnas', newInquiry);
      toast.success('문의가 성공적으로 접수되었습니다.');
      setIsModalOpen(false);
      setNewInquiry({ title: '', content: '' });
      fetchInquiries();
    } catch (err) {
      toast.error('문의 등록에 실패했습니다.');
    }
  };

  // 1. 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return toast.warn('삭제할 문의를 선택해 주세요.');
    if (!window.confirm(`선택하신 ${selectedIds.length}개의 문의를 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(selectedIds.map(id => axiosInstance.delete(`/api/qnas/${id}`)));
      toast.success('선택한 문의가 삭제되었습니다.');
      setSelectedIds([]);
      fetchInquiries();
    } catch (err) {
      toast.error('일부 문의 삭제에 실패했습니다.');
    }
  };

  // 2. 전체 삭제
  const handleDeleteAll = async () => {
    if (inquiries.length === 0) return toast.warn('삭제할 문의가 없습니다.');
    if (!window.confirm('현재 페이지의 전체 문의를 삭제하시겠습니까?')) return;

    try {
      await Promise.all(inquiries.map(q => axiosInstance.delete(`/api/qnas/${q.id}`)));
      toast.success('전체 문의가 삭제되었습니다.');
      setSelectedIds([]);
      fetchInquiries();
    } catch (err) {
      toast.error('전체 삭제에 실패했습니다.');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(inquiries.map(q => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const isAllSelected = inquiries.length > 0 && selectedIds.length === inquiries.length;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center font-bold text-ink">로딩 중...</div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-ink tracking-tight">1:1 문의 내역</h2>
          <p className="mt-2 text-sm text-muted">고객님이 제출하신 문의 사항과 답변 상태를 확인할 수 있습니다.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          새 문의 작성
        </Button>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-20 shadow-sm">
          <Inbox className="mb-4 size-12 text-muted" strokeWidth={1.5} />
          <p className="text-lg font-bold text-ink">작성하신 문의 내역이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden mb-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft bg-surface-muted/50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer accent-brand"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                <span className="text-sm font-bold text-ink">전체 선택</span>
              </label>

              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-error text-error hover:bg-error/10 transition-colors h-8 text-xs"
                    onClick={handleDeleteSelected}
                  >
                    선택 삭제 ({selectedIds.length})
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-error text-error hover:bg-error/10 transition-colors h-8 text-xs"
                  onClick={handleDeleteAll}
                >
                  전체 삭제
                </Button>
              </div>
            </div>

            {inquiries.map((qna) => (
              <div key={qna.id} className="border-b border-border-soft last:border-0">
                <div
                  className="flex cursor-pointer items-center justify-between p-6 hover:bg-surface-muted transition-colors"
                  onClick={() => toggleExpand(qna.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer accent-brand"
                        checked={selectedIds.includes(qna.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelect(qna.id);
                        }}
                      />
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold shrink-0 ${
                      qna.status === 'ANSWERED' ? 'bg-brand/10 text-brand' : 'bg-border-soft text-muted'
                    }`}>
                      {qna.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-md font-bold text-ink truncate">{qna.title}</h3>
                      <p className="mt-1 text-xs text-muted">
                        {qna.createdAt ? new Date(qna.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-muted">
                    <div className="p-2">
                      {expandedId === qna.id ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                    </div>
                  </div>
                </div>

                {expandedId === qna.id && (
                  <div className="bg-surface-muted p-6 border-t border-border-soft space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-xs font-extrabold uppercase tracking-label text-muted mb-1.5">Q. 질문 내용</p>
                        <p className="text-ink whitespace-pre-wrap text-sm leading-relaxed">{qna.content}</p>
                      </div>
                    </div>

                    {qna.status === 'ANSWERED' && (
                      <div className="rounded-lg bg-surface p-4 border border-border-soft shadow-inner">
                        <p className="text-xs font-extrabold uppercase tracking-label text-brand mb-1.5">A. 관리자 답변</p>
                        <p className="text-ink whitespace-pre-wrap text-sm leading-relaxed">{qna.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            getPageHref={(p) => `${location.pathname}?page=${p}`}
          />
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateInquiry} className="bg-surface p-6 rounded-xl w-full max-w-lg shadow-xl border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">새 문의 작성</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24}/></button>
            </div>
            <input
              required className="w-full p-3 border border-border rounded-md mb-3 outline-none focus:border-brand"
              placeholder="제목을 입력하세요"
              value={newInquiry.title}
              onChange={e => setNewInquiry({...newInquiry, title: e.target.value})}
            />
            <textarea
              required className="w-full p-3 border border-border rounded-md h-32 mb-6 outline-none focus:border-brand resize-none"
              placeholder="문의 내용을 입력하세요"
              value={newInquiry.content}
              onChange={e => setNewInquiry({...newInquiry, content: e.target.value})}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button type="submit">접수하기</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}