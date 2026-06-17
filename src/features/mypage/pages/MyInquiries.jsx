import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronUp, Inbox } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Pagination, Checkbox, InputField, ModalShell, formControlFocusClass } from '../../../components/index.js'
import { MyPageHeader, MyPageEmptyState, MyPageLoading, MyPagePanel } from '../../../components/mypage/MyPageUi.jsx'
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
    return <MyPageLoading label="문의 내역을 불러오는 중입니다." />
  }

  return (
    <>
      <MyPageHeader
        title="문의 내역"
        description="1:1 문의와 답변 상태를 확인할 수 있습니다."
        actions={(
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            새 문의 작성
          </Button>
        )}
      />

      {inquiries.length === 0 ? (
        <MyPageEmptyState icon={Inbox} title="작성한 문의가 없습니다." />
      ) : (
        <>
          <MyPagePanel className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border-soft bg-surface-muted/50 px-6 py-4">
              <Checkbox
                id="inquiry-select-all"
                variant="brand"
                size="md"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e)}
                label={<span className="text-body-sm font-bold">전체 선택</span>}
              />

              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error hover:bg-error/5"
                    onClick={handleDeleteSelected}
                  >
                    선택 삭제 ({selectedIds.length})
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-error hover:bg-error/5"
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
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={`inquiry-${qna.id}`}
                        variant="brand"
                        size="md"
                        checked={selectedIds.includes(qna.id)}
                        onChange={() => handleSelect(qna.id)}
                        aria-label={`${qna.title} 선택`}
                      />
                    </div>

                    <span className={`shrink-0 rounded-md px-3 py-1.5 text-body-sm font-semibold ${
                      qna.status === 'ANSWERED' ? 'bg-brand/10 text-brand' : 'bg-surface-muted text-muted'
                    }`}>
                      {qna.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-body font-bold text-ink">{qna.title}</h3>
                      <p className="mt-1 text-body-sm text-muted">
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
                  <div className="animate-fadeIn space-y-4 border-t border-border-soft bg-surface-muted p-6">
                    <div>
                      <p className="mb-1.5 text-caption font-bold uppercase tracking-label text-muted">Q. 질문 내용</p>
                      <p className="whitespace-pre-wrap text-body-sm leading-relaxed text-ink">{qna.content}</p>
                    </div>

                    {qna.status === 'ANSWERED' && (
                      <div className="rounded-md border border-border bg-surface p-4 shadow-card">
                        <p className="mb-1.5 text-caption font-bold uppercase tracking-label text-brand">A. 관리자 답변</p>
                        <p className="whitespace-pre-wrap text-body-sm leading-relaxed text-ink">{qna.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </MyPagePanel>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            getPageHref={(p) => `${location.pathname}?page=${p}`}
          />
        </>
      )}

      {isModalOpen && (
        <ModalShell
          title="새 문의 작성"
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-lg"
          bodyClassName="p-6"
        >
          <form onSubmit={handleCreateInquiry} className="space-y-4">
            <InputField
              id="inquiry-title"
              label="제목"
              required
              value={newInquiry.title}
              onChange={(e) => setNewInquiry({ ...newInquiry, title: e.target.value })}
              placeholder="제목을 입력하세요"
            />
            <div className="grid gap-1">
              <label htmlFor="inquiry-content" className="text-body font-semibold text-ink">
                문의 내용 *
              </label>
              <textarea
                id="inquiry-content"
                required
                className={`h-32 w-full resize-none rounded-md border border-border p-3 text-body-sm ${formControlFocusClass}`}
                placeholder="문의 내용을 입력하세요"
                value={newInquiry.content}
                onChange={(e) => setNewInquiry({ ...newInquiry, content: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-border-soft pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
              <Button type="submit" variant="primary">
                접수하기
              </Button>
            </div>
          </form>
        </ModalShell>
      )}
    </>
  )
}