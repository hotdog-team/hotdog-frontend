import { Edit2, Star, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Pagination, Select } from '../../../components/index.js'
import ReviewFormModal from '../../../components/review/ReviewFormModal.jsx'
import axiosInstance from '../../../api/axiosInstance.js'
import { createReview, getReviewByOrderItem, updateReview } from '../../../api/reviewApi.js'
import { resolveImageUrl } from '../../../api/imageApi.js'
import { resolveReviewImageUrl } from '../../../utils/reviewImage.js'
import { addCartItem, addCartItems } from '../../../api/cartApi'
import {
  getOrderDetail,
  cancelOrderItems,
  requestOrderReturn,
  requestReturnItems,
} from '../../../api/orderApi'


const ORDER_STATUS_LABEL = {
  PENDING: '결제 대기',
  PROCESSING: '결제 중',
  COMPLETED: '결제 완료',
  BEFORE_SHIPMENT: '배송 준비 중',
  IN_TRANSIT: '배송 중',
  DELIVERED: '배송 완료',
  PARTIAL_CANCELLED: '부분 취소',
  CANCELLED: '주문 취소',
  RETURN_REQUESTED: '반품 신청',
  RETURN_COMPLETED: '반품 완료',
  PARTIAL_RETURN_REQUESTED: '부분 반품 신청',
  PARTIAL_RETURN_COMPLETED: '부분 반품 완료',
}

const ORDER_STATUS_CLASS = {
  PENDING: 'bg-gray-100 text-gray-600',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  BEFORE_SHIPMENT: 'bg-orange-100 text-orange-700',
  IN_TRANSIT: 'bg-sky-100 text-sky-700',
  DELIVERED: 'bg-green-100 text-green-700',
  PARTIAL_CANCELLED: 'bg-red-100 text-red-600',
  CANCELLED: 'bg-gray-200 text-gray-500',
  RETURN_REQUESTED: 'bg-purple-100 text-purple-700',
  RETURN_COMPLETED: 'bg-gray-200 text-gray-500',
  PARTIAL_RETURN_REQUESTED: 'bg-purple-100 text-purple-700',
  PARTIAL_RETURN_COMPLETED: 'bg-gray-200 text-gray-500',
}

const CANCELLED_STATUSES = ['CANCELLED']
const RETURN_STATUSES = ['RETURN_REQUESTED', 'RETURN_COMPLETED', 'PARTIAL_RETURN_REQUESTED', 'PARTIAL_RETURN_COMPLETED']
const ORDER_ITEM_PREVIEW_LIMIT = 3

function getOrderStatusLabel(status) {
  return ORDER_STATUS_LABEL[status] || status || '-'
}

function getOrderStatusClass(status) {
  return ORDER_STATUS_CLASS[status] || 'bg-surface-muted text-ink'
}

function getOrderProductSummary(order) {
  const items = order.orderItems || []

  if (items.length === 0) {
    return {
      productName: order.productName || '-',
      quantity: order.quantity || 1,
    }
  }

  const firstItem = items[0]
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  return {
    productName:
      items.length > 1
        ? `${firstItem.productName} 외 ${items.length - 1}건`
        : firstItem.productName,
    quantity: totalQuantity || firstItem.quantity || 1,
  }
}

function ReviewViewModal({ context, review, isLoading, onClose, onEdit }) {
  const formattedDate = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString('ko-KR')
    : ''

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" role="dialog" aria-modal="true">
      <div className="max-h-modal w-full max-w-lg overflow-y-auto rounded-md bg-surface p-8 text-ink shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">내 리뷰</h2>
            {formattedDate && <p className="mt-1 text-caption text-muted">작성일 {formattedDate}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="내 리뷰 닫기"
            title="닫기"
            className="shrink-0 text-muted transition-colors hover:text-error"
          >
            <XCircle size={24} aria-hidden="true" />
          </button>
        </div>
        <div className="flex justify-start mt-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-1">
            <Edit2 className="size-3.5" /> 수정
          </Button>
        </div>
        {isLoading ? (
          <p className="mt-10 text-center text-muted">리뷰를 불러오는 중입니다...</p>
        ) : review ? (
          <div className="mt-2 space-y-6">
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <img
                className="size-20 shrink-0 rounded-md object-cover"
                src={resolveImageUrl(context.imageUrl) || 'https://via.placeholder.com/100'}
                alt={context.productName}
              />
              <div className="min-w-0">
                <p className="font-semibold text-ink">{context.productName}</p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-body font-medium text-ink">별점</p>
              <div className="mt-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-5 ${star <= review.rating ? 'fill-rating text-rating' : 'fill-border text-border-soft'}`}
                    strokeWidth={0}
                  />
                ))}
                <span className="ml-2 text-body-sm font-semibold text-ink">{review.rating}점</span>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-body font-medium text-ink">리뷰 내용</p>
              <p className="mt-2 whitespace-pre-wrap text-body-sm leading-relaxed text-foreground">
                {review.content}
              </p>
            </div>

            {review.imageUrl && (
              <div>
                <p className="text-body font-medium text-ink">첨부 이미지</p>
                <img
                  src={resolveImageUrl(review.imageUrl)}
                  alt="리뷰 첨부 이미지"
                  className="mt-2 max-h-56 max-w-full rounded-md border border-border object-cover"
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TrackingModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-md bg-surface p-8 text-ink shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-medium">배송 조회</h2>
            <p className="mt-3 text-body-sm text-foreground">주문번호 #{order.orderId}</p>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        <div className="mt-8 rounded-md border border-border bg-surface-muted p-5">
          <p className="text-caption text-foreground">운송장 번호</p>

          {order.trackingNumber ? (
            <p className="mt-2 text-xl font-bold text-ink">{order.trackingNumber}</p>
          ) : (
            <p className="mt-2 text-body-sm font-medium text-foreground">
              아직 운송장 번호가 등록되지 않았습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ReturnRequestModal({
  order,
  item,
  onClose,
  onSubmit,
}) {
  const [reason, setReason] = useState('')
  const [detailReason, setDetailReason] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const productName =
    item?.productName ||
    getOrderProductSummary(order).productName

  const quantity =
    item?.quantity ||
    getOrderProductSummary(order).quantity
  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('ko-KR')
    : '-'

  const reasonOptions = [
    { value: '', label: '반품 사유를 선택해 주세요' },
    { value: 'CHANGE_MIND', label: '단순 변심' },
    { value: 'DEFECTIVE', label: '상품 불량' },
    { value: 'WRONG_ITEM', label: '오배송' },
    { value: 'OTHER', label: '기타' },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!reason) {
      setValidationMessage('반품 사유를 선택해 주세요.')
      return
    }

    onSubmit(order.orderId, {
      reason,
      detailReason,
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" role="dialog" aria-modal="true">
      <form className="w-full max-w-xl rounded-md bg-surface p-8 text-ink shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-medium">반품 신청</h2>
            <p className="mt-3 text-body-sm text-foreground">
              반품 정보를 확인하고 사유를 입력해 주세요.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        <div className="mt-8 grid gap-4 rounded-md border border-border bg-surface-muted p-5 text-body-sm">
          <p>
            <span className="text-foreground">주문번호</span>
            <br />
            <strong>#{order.orderId}</strong>
          </p>

          <p>
            <span className="text-foreground">상품명</span>
            <br />
            <strong>{productName}</strong>
          </p>

          <p>
            <span className="text-foreground">수량</span>
            <br />
            <strong>{quantity}개</strong>
          </p>

          <p>
            <span className="text-foreground">주문일</span>
            <br />
            <strong>{formattedDate}</strong>
          </p>
        </div>

        <div className="mt-6">
          <Select
            id="return-reason"
            label="반품 사유"
            options={reasonOptions}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setValidationMessage('')
            }}
            required={true}
          />
        </div>

        <label className="mt-6 block text-body-sm font-medium" htmlFor="return-detail-reason">
          상세 사유
        </label>

        <textarea
          id="return-detail-reason"
          className="mt-3 h-36 w-full resize-none border border-border p-4 text-body outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
          placeholder="상세 사유를 입력해 주세요."
          value={detailReason}
          onChange={(event) => setDetailReason(event.target.value)}
        />

        {validationMessage && (
          <p className="mt-4 rounded border border-error-border bg-error-soft px-4 py-3 text-body-sm font-semibold text-error" role="alert">
            {validationMessage}
          </p>
        )}

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            취소
          </Button>

          <Button type="submit" variant="primary" size="md">
            반품 신청
          </Button>
        </div>
      </form>
    </div>
  )
}


function CancelRequestModal({
  order,
  item,
  onClose,
  onSubmit,
}) {
  const formattedDate = order.orderDate
    ? new Date(order.orderDate).toLocaleDateString('ko-KR')
    : '-'

  const isAllCancel = !item

  const productName = isAllCancel
    ? getOrderProductSummary(order).productName
    : item.productName

  const quantity = isAllCancel
    ? getOrderProductSummary(order).quantity
    : item.quantity || 1

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl rounded-md bg-surface p-8 text-ink shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-medium">
              {isAllCancel ? '전체 주문 취소' : '주문 취소'}
            </h2>
            <p className="mt-3 text-body-sm text-foreground">
              취소할 주문 정보를 확인해 주세요.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        <div className="mt-8 grid gap-4 rounded-md border border-border bg-surface-muted p-5 text-body-sm">
          <p>
            <span className="text-foreground">주문번호</span>
            <br />
            <strong>#{order.orderId}</strong>
          </p>

          <p>
            <span className="text-foreground">상품명</span>
            <br />
            <strong>{productName}</strong>
          </p>

          <p>
            <span className="text-foreground">수량</span>
            <br />
            <strong>{quantity}개</strong>
          </p>

          <p>
            <span className="text-foreground">주문일</span>
            <br />
            <strong>{formattedDate}</strong>
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            취소
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onSubmit(order, item)}
          >
            주문 취소
          </Button>
        </div>
      </div>
    </div>
  )
}

function buildReviewContext(order, item) {
  return {
    orderId: order.orderId,
    orderDate: order.orderDate,
    orderItemId: item.orderItemId,
    productName: item.productName,
    imageUrl: item.imageUrl,
    category: item.category,
  }
}

function canWriteReview(order, item) {
  return (
    [
      'DELIVERED',
      'PARTIAL_RETURN_REQUESTED',
      'PARTIAL_RETURN_COMPLETED',
    ].includes(order.orderStatus)
    && item?.status === 'ORDERED'
    && item?.source === 'INTERNAL'
    && item?.productId
    && !item?.hasReview
  )
}

function getValidTotalPrice(order) {
  if (
    order.orderStatus === 'CANCELLED' ||
    order.orderStatus === 'RETURN_COMPLETED'
  ) {
    return 0
  }

  const productTotal = (order.orderItems || [])
    .filter(
      (item) =>
        ![
          'CANCELLED',
          'RETURN_REQUESTED',
          'RETURN_COMPLETED',
        ].includes(item.status),
    )
    .reduce(
      (sum, item) =>
        sum + (item.priceAtOrder || 0) * (item.quantity || 0),
      0,
    )

  return productTotal + (order.deliveryFee || 0)
}

function OrderCard({
  order,
  onReviewClick,
  onViewReviewClick,
  onDetailClick,
  onCancelClick,
  onCancelItemClick,
  onTrackingClick,
  onReturnClick,
  onRepurchaseItem,
  onRepurchaseAll,
}) {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false)

  const isDelivered = order.orderStatus === 'DELIVERED'
  const isInTransit = order.orderStatus === 'IN_TRANSIT'
  const isCancelled = CANCELLED_STATUSES.includes(order.orderStatus)
  const isReturnStatus = RETURN_STATUSES.includes(order.orderStatus)
  const formattedDate = new Date(order.orderDate).toLocaleDateString('ko-KR')
  const statusText = getOrderStatusLabel(order.orderStatus)
  const statusClass = getOrderStatusClass(order.orderStatus)
  const canCancel = ['PENDING', 'PROCESSING', 'COMPLETED', 'PARTIAL_CANCELLED'].includes(order.orderStatus)
  const canCancelAll = ['PENDING', 'PROCESSING', 'COMPLETED', 'PARTIAL_CANCELLED'].includes(order.orderStatus)
  const canTrack = ['BEFORE_SHIPMENT', 'IN_TRANSIT'].includes(order.orderStatus)
  const canReturnOrReview = [
    'DELIVERED',
    'PARTIAL_RETURN_REQUESTED',
    'PARTIAL_RETURN_COMPLETED',
  ].includes(order.orderStatus)
  const canReturnAll = [
    'DELIVERED',
    'PARTIAL_RETURN_REQUESTED',
    'PARTIAL_RETURN_COMPLETED',
  ].includes(order.orderStatus)
  const canRepurchaseAll = [
    'DELIVERED',
    'PARTIAL_RETURN_REQUESTED',
    'PARTIAL_RETURN_COMPLETED',
  ].includes(order.orderStatus)

  const orderItems = order.orderItems?.length
    ? order.orderItems
    : [{ productName: order.productName, imageUrl: order.imageUrl, quantity: 1 }]
  const hasMoreItems = orderItems.length > ORDER_ITEM_PREVIEW_LIMIT
  const visibleItems = isItemsExpanded || !hasMoreItems
    ? orderItems
    : orderItems.slice(0, ORDER_ITEM_PREVIEW_LIMIT)
  const hiddenItemCount = orderItems.length - ORDER_ITEM_PREVIEW_LIMIT

  return (
    <article
      className="cursor-pointer rounded-md border border-border bg-surface shadow-card"
      onClick={() => onDetailClick(order.orderId)}
    >
      <header className="grid grid-cols-3 items-center gap-5 border-b border-border px-8 py-5">
        <div>
          <p className="text-caption text-foreground">주문일</p>
          <p className="text-xl font-bold">{formattedDate}</p>
        </div>

        <div className="text-center">
          <p className="text-caption text-foreground">총 결제 금액</p>
          <p className="text-xl font-bold">
            {getValidTotalPrice(order).toLocaleString()}원
          </p>
        </div>

        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {canCancelAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelClick(order)}
            >
              전체 주문취소
            </Button>
          )}

          {canReturnAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReturnClick(order, null)}
            >
              전체 반품
            </Button>
          )}

          {canRepurchaseAll && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRepurchaseAll(order)}
            >
              전체 재구매
            </Button>
          )}
        </div>
      </header>


      <div className="grid grid-cols-split gap-6 px-8 py-7 max-md:grid-cols-1">
        <div className="space-y-5">
          {visibleItems.map((item, index) => (
            <div
              key={item.orderItemId ?? `${order.orderId}-${index}`}
              className="flex items-center gap-6 border-b border-border-soft pb-5 last:border-b-0 last:pb-0"
            >
              <img
                className="size-thumb shrink-0 rounded object-cover"
                src={item.imageUrl || 'https://via.placeholder.com/100'}
                alt={item.productName}
              />

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-body-lg font-bold">{item.productName}</h3>
                {item.quantity > 1 && (
                  <p className="mt-1 text-body-sm text-muted">수량 {item.quantity}개</p>
                )}
                <p className="mt-1 text-body font-bold text-brand">{(item.priceAtOrder * item.quantity).toLocaleString()}원</p>
                {item.status === 'CANCELLED' && (
                  <p className="mt-2 text-body-sm font-semibold text-muted">주문 취소 완료</p>
                )}
                {item.status ===
                  'RETURN_REQUESTED' && (
                    <p className="mt-2 text-body-sm font-semibold text-purple-700">
                      반품 신청 완료
                    </p>
                  )}
                {item.status ===
                  'RETURN_COMPLETED' && (
                    <p className="mt-2 text-body-sm font-semibold text-muted">
                      반품 완료
                    </p>
                  )}
              </div>

              <div
                className="mt-4 flex flex-wrap gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {canCancel && item.status === 'ORDERED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancelItemClick(order, item)}
                  >
                    주문 취소
                  </Button>
                )}

                {canTrack && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onTrackingClick(order)}
                  >
                    배송 조회
                  </Button>
                )}

                {canReturnOrReview &&
                  item.status === 'ORDERED' &&
                  canWriteReview(order, item) && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onReviewClick(buildReviewContext(order, item))}
                    >
                      리뷰 작성
                    </Button>
                  )}

                {canReturnOrReview &&
                  item.status === 'ORDERED' &&
                  item.hasReview && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewReviewClick(buildReviewContext(order, item))}
                    >
                      내 리뷰 보기
                    </Button>
                  )}

                {canReturnOrReview &&
                  item.status === 'ORDERED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReturnClick(order, item)}
                    >
                      반품 신청
                    </Button>
                  )}

                {canReturnOrReview &&
                  item.status === 'ORDERED' &&
                  item.productId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRepurchaseItem(item)}
                    >
                      재구매
                    </Button>
                  )}
              </div>
            </div>
          ))}

          {hasMoreItems && (
            <button
              type="button"
              className="text-body-sm font-semibold text-brand hover:underline"
              onClick={(e) => {
                e.stopPropagation()
                setIsItemsExpanded((prev) => !prev)
              }}
            >
              {isItemsExpanded
                ? '상품 목록 접기'
                : `외 ${hiddenItemCount}건 더보기`}
            </button>
          )}
        </div>

      </div>
    </article>
  )
}

function MyOrders() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null)
  const [selectedCancelOrderItem, setSelectedCancelOrderItem] = useState(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [viewingReview, setViewingReview] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null)
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [statusGroup, setStatusGroup] = useState('ALL')
  const [months, setMonths] = useState(null)

  const page = Number(searchParams.get('page')) || 1

  const handleDetailClick = (orderId) => {
    navigate(`/mypage/orders/${orderId}`)
  }

  const handleRepurchaseItem = async (item) => {
    if (!item?.productId) {
      toast.info('재구매 가능한 상품이 아닙니다.')
      return
    }

    try {
      await addCartItem(item.productId, item.quantity || 1)
      toast.success('장바구니에 담았습니다.')
      navigate('/cart')
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info('이미 장바구니에 담긴 상품입니다.')
        navigate('/cart')
        return
      }

      console.error('상품별 재구매 실패:', error)
      toast.error('재구매에 실패했습니다.')
    }
  }

  const handleRepurchaseAll = async (order) => {
    if (order.orderStatus === 'RETURN_COMPLETED') {
      toast.info('재구매 가능한 상품이 없습니다.')
      return
    }

    const items = (order.orderItems || [])
      .filter(
        (item) =>
          ![
            'CANCELLED',
            'RETURN_REQUESTED',
            'RETURN_COMPLETED',
          ].includes(item.status) &&
          item.productId,
      )
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity || 1,
      }))

    if (items.length === 0) {
      toast.info('재구매 가능한 상품이 없습니다.')
      return
    }

    try {
      await addCartItems(items)
      toast.success('장바구니에 담았습니다.')
      navigate('/cart')
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info('일부 상품이 이미 장바구니에 담겨 있습니다.')
        navigate('/cart')
        return
      }

      console.error('전체 재구매 실패:', error)
      toast.error('전체 재구매에 실패했습니다.')
    }
  }

  const fetchOrders = async ({
    targetPage = page,
    nextStatusGroup = statusGroup,
    nextMonths = months,
  } = {}) => {
    try {
      setIsLoading(true)

      const res = await axiosInstance.get('/api/orders', {
        params: {
          page: targetPage - 1,
          size: 10,
          sort: 'createdAt,desc',
          ...(nextStatusGroup !== 'ALL' && { statusGroup: nextStatusGroup }),
          ...(nextMonths && { months: nextMonths }),
        },
      })

      setOrders(res.data.content || res.data)
      setTotalPages(res.data.totalPages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    navigate('/mypage/orders?page=1')
    fetchOrders({ targetPage: 1 })
  }

  const handleReset = () => {
    setStatusGroup('ALL')
    setMonths(null)

    navigate('/mypage/orders?page=1')
    fetchOrders({
      targetPage: 1,
      nextStatusGroup: 'ALL',
      nextMonths: null,
    })
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  const handleCancelOrder = async (order) => {
    if (
      ![
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'PARTIAL_CANCELLED',
      ].includes(order.orderStatus)
    ) {
      toast.info('현재 상태에서는 주문 취소가 불가능합니다.')
      return
    }

    try {
      const orderDetail = await getOrderDetail(order.orderId)
      const cancelTargetItemIds = (orderDetail.orderItems || [])
        .filter((item) => item.status === 'ORDERED')
        .map((item) => item.orderItemId)

      if (cancelTargetItemIds.length === 0) {
        await fetchOrders()
        setSelectedCancelOrderItem(null)
        toast.info('취소 가능한 상품이 없습니다.')
        return
      }

      await cancelOrderItems(order.orderId, cancelTargetItemIds)
      await fetchOrders()

      setSelectedCancelOrderItem(null)
      toast.success('주문이 취소되었습니다.')
    } catch (error) {
      console.error('주문 취소 실패:', error)
      toast.error('주문 취소에 실패했습니다.')
    }
  }

  const handleCancelOrderItem = async (order, item) => {
    if (
      ![
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'PARTIAL_CANCELLED',
      ].includes(order.orderStatus)
    ) {
      toast.info('현재 상태에서는 주문 취소가 불가능합니다.')
      return
    }

    if (!item?.orderItemId) {
      toast.error('주문 상품 정보를 찾을 수 없습니다.')
      return
    }

    if (item.status !== 'ORDERED') {
      toast.info('취소 가능한 상품이 아닙니다.')
      return
    }

    try {
      await cancelOrderItems(order.orderId, [item.orderItemId])
      await fetchOrders()

      setSelectedCancelOrderItem(null)
      toast.success('상품이 취소되었습니다.')
    } catch (error) {
      console.error('상품 취소 실패:', error)
      toast.error('상품 취소에 실패했습니다.')
    }
  }

  const handleReturnSubmit = async (
    orderId,
    returnData,
  ) => {
    try {
      if (selectedReturnOrder?.item?.orderItemId) {
        await requestReturnItems(orderId, {
          orderItemIds: [
            selectedReturnOrder.item.orderItemId,
          ],
          ...returnData,
        })
      } else {
        await requestOrderReturn(
          orderId,
          returnData,
        )
      }

      await fetchOrders()

      setSelectedReturnOrder(null)

      toast.success('반품 신청이 완료되었습니다.')
    } catch (error) {
      console.error(
        '반품 신청 실패:',
        error,
      )

      toast.error('반품 신청에 실패했습니다.')
    }
  }

  const handleViewReviewClick = () => {
    navigate('/mypage/reviews')
  }

  const handleEditReviewClick = () => {
    if (!viewingReview?.review) return

    setEditingReview({
      context: viewingReview.context,
      review: viewingReview.review,
    })
    setViewingReview(null)
  }

  const handleReviewUpdate = async ({ rating, content, file, imageUrl }) => {
    if (!editingReview?.review?.reviewId) return

    setIsSubmittingReview(true)
    try {
      let uploadedImageUrl = null
      if (file) {
        uploadedImageUrl = await resolveReviewImageUrl({ file, imageUrl: null })
      } else if (imageUrl) {
        uploadedImageUrl = imageUrl
      }

      await updateReview(editingReview.review.reviewId, {
        rating,
        content,
        imageUrl: uploadedImageUrl,
      })

      setEditingReview(null)
      toast.success('리뷰가 수정되었습니다.')
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

  const handleReviewSubmit = async ({ rating, content, file, imageUrl }) => {
    if (!selectedReviewOrder?.orderItemId) {
      toast.error('주문 상품 정보를 찾을 수 없습니다.')
      return
    }

    setIsSubmittingReview(true)
    try {
      let uploadedImageUrl = null
      if (file) {
        uploadedImageUrl = await resolveReviewImageUrl({ file, imageUrl: null })
      } else if (imageUrl) {
        uploadedImageUrl = imageUrl
      }

      await createReview(selectedReviewOrder.orderItemId, {
        rating,
        content,
        imageUrl: uploadedImageUrl,
      })

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          if (order.orderId !== selectedReviewOrder.orderId) return order

          return {
            ...order,
            orderItems: order.orderItems?.map((item) =>
              item.orderItemId === selectedReviewOrder.orderItemId
                ? { ...item, hasReview: true }
                : item,
            ),
          }
        }),
      )
      setSelectedReviewOrder(null)
      toast.success('리뷰가 성공적으로 등록되었습니다.')
    } catch (error) {
      console.error('리뷰 등록 실패:', error)
      const isUploadError = file && String(error?.config?.url ?? '').includes('/api/images/upload')
      toast.error(
        isUploadError
          ? '이미지 업로드에 실패했습니다. JPG/PNG 파일인지 확인해 주세요.'
          : '리뷰 등록에 실패했습니다.',
      )
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold">주문/배송 내역</h1>
      <p className="mt-2 text-md text-muted">내 구매 내역/배송 상태를 확인합니다.</p>

      <div className="mt-8 rounded-md border border-border bg-surface p-6">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label className="mb-2 block text-body-sm font-medium text-ink" htmlFor="order-status-filter">
              주문 상태
            </label>

            <select
              id="order-status-filter"
              value={statusGroup}
              onChange={(event) => setStatusGroup(event.target.value)}
              className="h-10 min-w-36 rounded border border-border bg-surface px-3 text-body-sm outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
            >
              <option value="ALL">전체</option>
              <option value="PENDING">입금대기</option>
              <option value="SHIPPING">배송중</option>
              <option value="DELIVERED">배송완료</option>
              <option value="CANCEL_RETURN">취소/반품</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-body-sm font-medium text-ink">조회 기간</p>

            <div className="flex flex-wrap gap-2">
              {[
                { label: '전체', value: null },
                { label: '1개월', value: 1 },
                { label: '3개월', value: 3 },
                { label: '6개월', value: 6 },
                { label: '1년', value: 12 },
              ].map((period) => (
                <Button
                  key={period.label}
                  type="button"
                  variant={months === period.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setMonths(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSearch}>
              조회
            </Button>

            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : orders.length === 0 ? (
          <p className="py-10 text-center text-foreground">주문 내역이 없습니다.</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onReviewClick={setSelectedReviewOrder}
              onViewReviewClick={handleViewReviewClick}
              onDetailClick={handleDetailClick}
              onCancelClick={(order) =>
                setSelectedCancelOrderItem({
                  order,
                  item: null,
                })
              }
              onCancelItemClick={(order, item) =>
                setSelectedCancelOrderItem({
                  order,
                  item,
                })
              }
              onTrackingClick={setSelectedTrackingOrder}
              onReturnClick={(order, item) =>
                setSelectedReturnOrder({
                  order,
                  item,
                })
              }
              onRepurchaseItem={handleRepurchaseItem}
              onRepurchaseAll={handleRepurchaseAll}
            />
          ))
        )}

        {orders.length > 0 && (
          <Pagination
            className="mt-4"
            page={page}
            totalPages={totalPages}
            getPageHref={(p) => `/mypage/orders?page=${p}`}
            ariaLabel="주문 페이지"
          />
        )}
      </section>

      {selectedTrackingOrder && (
        <TrackingModal
          order={selectedTrackingOrder}
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}

      {selectedCancelOrderItem && (
        <CancelRequestModal
          order={selectedCancelOrderItem.order}
          item={selectedCancelOrderItem.item}
          onClose={() => setSelectedCancelOrderItem(null)}
          onSubmit={(order, item) =>
            item?.orderItemId
              ? handleCancelOrderItem(order, item)
              : handleCancelOrder(order)
          }
        />
      )}

      {selectedReturnOrder && (
        <ReturnRequestModal
          order={selectedReturnOrder.order}
          item={selectedReturnOrder.item}
          onClose={() =>
            setSelectedReturnOrder(null)
          }
          onSubmit={handleReturnSubmit}
        />
      )}

      {viewingReview && (
        <ReviewViewModal
          context={viewingReview.context}
          review={viewingReview.review}
          isLoading={viewingReview.isLoading}
          onClose={() => setViewingReview(null)}
          onEdit={handleEditReviewClick}
        />
      )}

      {editingReview && (
        <ReviewFormModal
          mode="edit"
          product={{
            orderId: editingReview.context.orderId,
            name: editingReview.context.productName,
            imageUrl: editingReview.context.imageUrl,
            category: editingReview.context.category,
            orderDate: editingReview.context.orderDate,
          }}
          initialValues={{
            rating: editingReview.review.rating,
            content: editingReview.review.content,
            imageUrl: editingReview.review.imageUrl,
          }}
          onClose={() => setEditingReview(null)}
          onSubmit={handleReviewUpdate}
          isSubmitting={isSubmittingReview}
        />
      )}

      {selectedReviewOrder && (
        <ReviewFormModal
          mode="create"
          product={{
            orderId: selectedReviewOrder.orderId,
            name: selectedReviewOrder.productName,
            imageUrl: selectedReviewOrder.imageUrl,
            category: selectedReviewOrder.category,
            orderDate: selectedReviewOrder.orderDate,
          }}
          onClose={() => setSelectedReviewOrder(null)}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmittingReview}
        />
      )}
    </>
  )
}

export default MyOrders