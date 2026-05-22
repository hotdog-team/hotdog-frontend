import { Camera, Star, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Pagination } from '../../../components/index.js'

const blockedWords = ['씨발', '시발', '병신', '개새끼', 'fuck', 'shit']
const xssPattern = /<script|javascript:|onerror=|onload=|iframe|object|embed/i

const initialOrders = [
  {
    id: 'EP-902183',
    date: '2023년 10월 24일',
    total: '1,249,000원',
    status: 'shipping',
    statusLabel: '배송 중',
    product: '프로 시리즈 생산성 노트북 14"',
    description: '1TB SSD, 32GB RAM, 매트 블랙',
    category: '단독 하드웨어',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80',
    hasReview: false,
  },
  {
    id: 'EP-884122',
    date: '2023년 9월 12일',
    total: '189,500원',
    status: 'delivered',
    statusLabel: '배송 완료',
    product: 'ANC 무선 포커스 헤드폰',
    description: '노이즈 캔슬링, 40시간 배터리, 매트 블랙',
    category: '테크 에센셜',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    hasReview: false,
  },
  {
    id: 'EP-911029',
    date: '2023년 10월 26일',
    total: '45,000원',
    status: 'preparing',
    statusLabel: '상품 준비 중',
    product: '기계식 슬림 오피스 키보드',
    description: '화이트, RGB 백라이트, 저소음 스위치',
    category: '액세서리',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80',
    hasReview: true,
  },
]

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
  const [rating, setRating] = useState(4)
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
    if (!file) {
      return
    }

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

    onSubmit(order.id)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <form className="max-h-modal w-full max-w-form overflow-y-auto bg-surface p-8 text-ink shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="review-modal-title" className="text-2xl font-medium">리뷰 작성</h2>
            <p className="mt-3 text-foreground">작성해주신 후기는 다른 임직원들의 구매 결정에 큰 도움이 됩니다.</p>
          </div>
          <button className="border border-border px-4 py-2 text-sm" type="button" onClick={onClose}>닫기</button>
        </div>

        <div className="mt-8 grid grid-cols-sidebar gap-8 max-md:grid-cols-1">
          <aside className="border border-border p-5">
            <img className="h-panel w-full object-cover" src={order.image} alt={order.product} />
            <p className="mt-4 inline-flex bg-surface-muted px-2 py-1 text-caption font-bold">{order.category}</p>
            <h3 className="mt-3 text-body-lg font-medium">{order.product}</h3>
            <p className="mt-3 text-body-sm text-foreground">구매일: {order.date}</p>
            <div className="mt-8 border-t border-border pt-5">
              <p className="text-caption font-bold text-brand">임직원 인증</p>
              <p className="mt-2 text-body-sm leading-6 text-foreground">이 구매는 임직원 전용 리워드 포인트 적립 대상입니다.</p>
            </div>
          </aside>

          <section className="border border-border p-8">
            <label className="block text-body-sm font-medium">전체 평점</label>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                return (
                  <button className={value <= rating ? 'text-brand' : 'text-star-empty'} key={value} type="button" aria-label={`${value}점`} onClick={() => setRating(value)}>
                    <Star className="size-9 fill-current" strokeWidth={0} />
                  </button>
                )
              })}
            </div>

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
                if (event.target !== fileInputRef.current) {
                  fileInputRef.current?.click()
                }
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
                      <button
                        className="shrink-0 rounded border border-white/70 px-3 py-1 text-caption font-semibold text-white hover:bg-surface hover:text-ink"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          clearSelectedImage()
                        }}
                      >
                        이미지 제거
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <Camera className="mx-auto mb-4 size-10 rounded-md bg-ink p-2 text-white" />
                  <p className="text-body-lg font-medium">이미지를 드래그하여 놓으세요</p>
                  <p className="mt-2 text-caption text-foreground">JPG, PNG 파일 (최대 5MB)</p>
                  <span className="mt-5 inline-flex border border-ink px-6 py-2 text-caption">
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
              <Button className="h-14 px-16 text-body-lg" type="submit" variant="primary" size="md">
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
  const isDelivered = order.status === 'delivered'
  const canReview = isDelivered && !order.hasReview

  return (
    <article className="rounded-md border border-border bg-surface">
      <header className="grid grid-cols-3 gap-5 border-b border-border bg-surface-muted px-8 py-5">
        <div><p className="text-caption text-foreground">주문일</p><p className="text-2xl font-bold">{order.date}</p></div>
        <div><p className="text-caption text-foreground">주문 번호</p><p className="text-2xl font-bold">#{order.id}</p></div>
        <div className="text-right"><p className="text-caption text-foreground">총 결제 금액</p><p className="text-2xl font-bold">{order.total}</p></div>
      </header>
      <div className="grid grid-cols-split gap-6 px-8 py-7 max-md:grid-cols-1">
        <div className="flex gap-6">
          <img className="size-thumb rounded object-cover" src={order.image} alt={order.product} />
          <div>
            <span className={`inline-flex rounded-full px-4 py-2 text-caption font-medium ${isDelivered ? 'bg-badge-delivered text-success' : order.status === 'shipping' ? 'bg-badge-shipping' : 'bg-badge-preparing text-brand'}`}>
              <Truck className="mr-1 size-4" />
              {order.statusLabel}
            </span>
            <p className="mt-5 text-caption font-bold text-brand">{order.category}</p>
            <h3 className="mt-2 text-2xl font-medium">{order.product}</h3>
            <p className="mt-2 text-foreground">{order.description}</p>
          </div>
        </div>
        <div className="grid content-center gap-2">
          <button className={`h-9 min-w-action rounded ${order.status === 'preparing' ? 'bg-disabled-surface text-muted' : 'bg-ink text-white'}`} type="button">배송 조회</button>
          {isDelivered && <button className="h-9 rounded border border-border" type="button">다시 구매</button>}
          {canReview && <button className="h-9 rounded border border-border" type="button" onClick={() => onReviewClick(order)}>리뷰 작성</button>}
          <button className="h-9 rounded border border-border" type="button">{order.status === 'preparing' ? '주문 취소' : '반품 신청'}</button>
        </div>
      </div>
    </article>
  )
}

function parseOrderPage(value) {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

function MyOrders() {
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState(initialOrders)
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null)
  const orderPage = parseOrderPage(searchParams.get('page'))

  const handleReviewSubmit = (orderId) => {
    setOrders((currentOrders) => currentOrders.map((order) => (order.id === orderId ? { ...order, hasReview: true } : order)))
    setSelectedReviewOrder(null)
  }

  return (
    <>
      <h1 className="text-3xl font-medium">주문/배송 내역</h1>
      <p className="mt-4 text-body-lg text-foreground">내 구매 내역/배송 상태를 확인합니다.</p>
      <section className="mt-12 grid gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onReviewClick={setSelectedReviewOrder} />
        ))}
        <Pagination
          className="mt-4"
          page={orderPage}
          totalPages={3}
          getPageHref={(nextPage) => `/mypage/orders?page=${nextPage}`}
          ariaLabel="주문 페이지"
        />
      </section>
      {selectedReviewOrder && <ReviewModal order={selectedReviewOrder} onClose={() => setSelectedReviewOrder(null)} onSubmit={handleReviewSubmit} />}
    </>
  )
}

export default MyOrders
