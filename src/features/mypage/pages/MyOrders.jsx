import { Camera, Star, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Pagination, Select } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

const blockedWords = ['씨발', '시발', '병신', '개새끼', 'fuck', 'shit']
const xssPattern = /<script|javascript:|onerror=|onload=|iframe|object|embed/i

function validateReview(content) {
  const trimmed = content.trim()

  if (trimmed.length < 20) {
    return '상세 후기는 최소 20자 이상 입력해 주세요.'
  }

  if (xssPattern.test(trimmed)) {
    return '보안상 허용되지 않는 스크립트 또는 태그 패턴이 포함되어 있습니다.'
  }

  if (blockedWords.some((word) => trimmed.toLowerCase().includes(word))) {
    return '후기에 부적절한 표현이 포함되어 있습니다. 내용을 수정해 주세요.'
  }

  return ''
}

function ReviewModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState('5')
  const [content, setContent] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const fileInputRef = useRef(null)

  const clearSelectedImage = () => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setSelectedFileName('')
    setPreviewImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl)
      }
    }
  }, [previewImageUrl])

  const handleFileSelect = (file) => {
    if (!file) return

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      clearSelectedImage()
      setValidationMessage('JPG 또는 PNG 이미지만 첨부할 수 있습니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      clearSelectedImage()
      setValidationMessage('이미지는 최대 5MB까지 첨부할 수 있습니다.')
      return
    }

    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl)
    }

    setSelectedFileName(file.name)
    setPreviewImageUrl(URL.createObjectURL(file))
    setValidationMessage('')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragActive(false)
    handleFileSelect(event.dataTransfer.files?.[0])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const message = validateReview(content)

    if (message) {
      setValidationMessage(message)
      return
    }
    onSubmit(order.orderId, { rating: Number(rating), content, file: fileInputRef.current?.files[0] })
  }

  const formattedDate = new Date(order.orderDate).toLocaleDateString('ko-KR')

  const ratingOptions = [
    { value: '5', label: '5점 (매우 만족)' },
    { value: '4', label: '4점 (만족)' },
    { value: '3', label: '3점 (보통)' },
    { value: '2', label: '2점 (불만족)' },
    { value: '1', label: '1점 (매우 불만족)' },
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <form className="max-h-modal w-full max-w-form overflow-y-auto bg-surface p-8 text-ink shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="review-modal-title" className="text-2xl font-medium">리뷰 작성</h2>
            <p className="mt-3 text-foreground">작성해주신 후기는 다른 임직원들의 구매 결정에 큰 도움이 됩니다.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>닫기</Button>
        </div>

        <div className="mt-8 grid grid-cols-sidebar gap-8 max-md:grid-cols-1">
          <aside className="border border-border p-5">
            <img className="h-panel w-full object-cover" src={order.imageUrl || 'https://via.placeholder.com/300'} alt={order.productName} />

            {order.category && (
              <p className="mt-4 inline-flex bg-surface-muted px-2 py-1 text-caption font-bold">{order.category}</p>
            )}

            <h3 className="mt-3 text-body-lg font-medium">{order.productName}</h3>
            <p className="mt-3 text-body-sm text-foreground">구매일: {formattedDate}</p>

            <div className="mt-8 border-t border-border pt-5">
              <p className="text-caption font-bold text-brand">임직원 인증</p>
              <p className="mt-2 text-body-sm leading-6 text-foreground">이 구매는 임직원 전용 리워드 포인트 적립 대상입니다.</p>
            </div>
          </aside>

          <section className="border border-border p-8">
            <Select
              id="review-rating"
              label="전체 평점"
              options={ratingOptions}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required={true}
            />

            <label className="mt-8 block text-body-sm font-medium" htmlFor="review-content">상세 후기</label>
            <textarea
              id="review-content"
              className="mt-4 h-panel w-full resize-none border border-border p-6 text-body outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
              placeholder="상품에 대한 솔직한 후기를 남겨주세요. (최소 20자 이상)"
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                setValidationMessage('')
              }}
            />

            <label className="mt-8 block text-body-sm font-medium" htmlFor="review-photo">사진 첨부</label>
            <div
              className={`relative mt-4 grid h-panel cursor-pointer place-items-center overflow-hidden border-2 border-dashed text-center outline-none transition-colors ${isDragActive ? 'border-brand bg-brand-soft' : 'border-border bg-surface hover:border-ink'}`}
              role="button"
              tabIndex={0}
              onClick={(event) => {
                if (event.target !== fileInputRef.current) fileInputRef.current?.click()
              }}
              onDragEnter={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={(event) => {
                event.preventDefault()
                setIsDragActive(false)
              }}
              onDrop={handleDrop}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
            {previewImageUrl ? (
                <>
                  <img className="absolute inset-0 size-full object-cover" src={previewImageUrl} alt={`${selectedFileName} 미리보기`} />
                  <div className="absolute inset-x-0 bottom-0 bg-ink/80 px-4 py-3 text-left text-white">
                    <p className="truncate text-caption font-medium">{selectedFileName}</p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-caption text-white/75">클릭하거나 새 이미지를 드래그해 교체</p>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 border border-white/70 text-white hover:bg-surface hover:text-ink"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSelectedImage();
                        }}
                      >
                        이미지 제거
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <Camera className="mx-auto mb-4 size-10 rounded-md bg-ink p-2 text-white" />
                  <p className="text-body-lg font-medium">이미지를 드래그하여 놓으세요</p>
                  <p className="mt-2 text-caption text-foreground">JPG, PNG 파일 (최대 5MB)</p>
                  <span className="mt-5 inline-flex border border-ink px-6 py-2 text-caption font-medium transition-colors hover:bg-surface-muted">
                    파일 찾기
                  </span>
                </div>
              )}
              <input
                className="sr-only"
                id="review-photo"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => handleFileSelect(event.target.files?.[0])}
              />
            </div>

            {validationMessage && <p className="mt-5 rounded border border-error-border bg-error-soft px-4 py-3 text-body-sm font-semibold text-error" role="alert">{validationMessage}</p>}

            <div className="mt-8 flex justify-end border-t border-border pt-7">
              <Button type="submit" variant="primary" size="lg" className="px-16">
                리뷰 등록하기
              </Button>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}

function OrderCard({ order, onReviewClick }) {
  const isDelivered = order.orderStatus === 'DELIVERED'
  const canReview = isDelivered && !order.hasReview
  const formattedDate = new Date(order.orderDate).toLocaleDateString('ko-KR')

  let badgeClass = 'bg-surface-muted text-ink'
  let statusText = '처리 중'

  if (order.orderStatus === 'DELIVERED') { badgeClass = 'bg-badge-delivered text-success'; statusText = '배송 완료' }
  else if (order.orderStatus === 'IN_TRANSIT') { badgeClass = 'bg-badge-shipping text-ink'; statusText = '배송 중' }
  else if (order.orderStatus === 'BEFORE_SHIPMENT') { badgeClass = 'bg-badge-preparing text-brand'; statusText = '상품 준비 중' }

  return (
    <article className="rounded-md border border-border bg-surface">
      <header className="grid grid-cols-3 gap-5 border-b border-border bg-surface-muted px-8 py-5">
        <div><p className="text-caption text-foreground">주문일</p><p className="text-2xl font-bold">{formattedDate}</p></div>
        <div><p className="text-caption text-foreground">주문 번호</p><p className="text-2xl font-bold">#{order.orderId}</p></div>
        <div className="text-right"><p className="text-caption text-foreground">총 결제 금액</p><p className="text-2xl font-bold">{order.totalPrice?.toLocaleString()}원</p></div>
      </header>
      <div className="grid grid-cols-split gap-6 px-8 py-7 max-md:grid-cols-1">
        <div className="flex gap-6">
          <img className="size-thumb rounded object-cover" src={order.imageUrl || 'https://via.placeholder.com/100'} alt={order.productName} />
          <div>
            <span className={`inline-flex rounded-full px-4 py-2 text-caption font-medium ${badgeClass}`}>
              <Truck className="mr-1 size-4" /> {statusText}
            </span>

            {order.category && (
               <p className="mt-5 text-caption font-bold text-brand">{order.category}</p>
            )}

            <h3 className={`${order.category ? 'mt-2' : 'mt-5'} text-2xl font-medium`}>{order.productName}</h3>

            {order.description && (
               <p className="mt-2 text-foreground">{order.description}</p>
            )}
          </div>
        </div>
        <div className="grid content-center gap-2">
          <Button variant="secondary" size="md" disabled={order.orderStatus !== 'IN_TRANSIT'} fullWidth>배송 조회</Button>
          {isDelivered && <Button variant="outline" size="md" fullWidth>다시 구매</Button>}
          {canReview && <Button variant="primary" size="md" onClick={() => onReviewClick(order)} fullWidth>리뷰 작성</Button>}
          <Button variant="outline" size="md" disabled={!['BEFORE_SHIPMENT', 'PENDING'].includes(order.orderStatus)} fullWidth>
             {['BEFORE_SHIPMENT', 'PENDING'].includes(order.orderStatus) ? '주문 취소' : '반품 신청'}
          </Button>
        </div>
      </div>
    </article>
  )
}

function MyOrders() {
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const res = await axiosInstance.get(`/api/orders?page=${page}`)
        setOrders(res.data.content || res.data)
        setTotalPages(res.data.totalPages || 1)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [page])

  const handleReviewSubmit = async (orderId, reviewData) => {
    try {
      setOrders((currentOrders) => currentOrders.map((order) => (order.orderId === orderId ? { ...order, hasReview: true } : order)))
      setSelectedReviewOrder(null)
      alert("리뷰가 성공적으로 등록되었습니다.")
    } catch (error) {
      console.error("리뷰 등록 실패:", error)
      alert("리뷰 등록에 실패했습니다.")
    }
  }

  return (
    <>
      <h1 className="text-3xl font-medium">주문/배송 내역</h1>
      <p className="mt-4 text-body-lg text-foreground">내 구매 내역/배송 상태를 확인합니다.</p>

      <section className="mt-12 grid gap-6">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : orders.length === 0 ? (
          <p className="py-10 text-center text-foreground">주문 내역이 없습니다.</p>
        ) : (
          orders.map(o => <OrderCard key={o.orderId} order={o} onReviewClick={setSelectedReviewOrder} />)
        )}

        {orders.length > 0 && (
          <Pagination className="mt-4" page={page} totalPages={totalPages} getPageHref={p => `/mypage/orders?page=${p}`} ariaLabel="주문 페이지" />
        )}
      </section>

      {selectedReviewOrder && (
        <ReviewModal
          order={selectedReviewOrder}
          onClose={() => setSelectedReviewOrder(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  )
}

export default MyOrders