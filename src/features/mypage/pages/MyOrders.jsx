import { ChevronDown, Edit2, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Pagination, Select, ModalShell, PageLoadingBox, PageEmptyBox, formControlFocusClass } from '../../../components/index.js'
import { MyPageHeader, MyPagePanel } from '../../../components/mypage/MyPageUi.jsx'
import ReviewFormModal from '../../../components/review/ReviewFormModal.jsx'
import axiosInstance from '../../../api/axiosInstance.js'
import { createReview, updateReview } from '../../../api/reviewApi.js'
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
  PENDING: 'bg-surface-muted text-muted',
  PROCESSING: 'bg-surface-muted text-ink',
  COMPLETED: 'bg-brand/10 text-brand',
  BEFORE_SHIPMENT: 'bg-surface-muted text-ink',
  IN_TRANSIT: 'bg-surface-muted text-ink',
  DELIVERED: 'bg-brand/10 text-brand',
  PARTIAL_CANCELLED: 'bg-surface-muted text-muted',
  CANCELLED: 'bg-surface-muted text-muted',
  RETURN_REQUESTED: 'bg-surface-muted text-ink',
  RETURN_COMPLETED: 'bg-surface-muted text-muted',
  PARTIAL_RETURN_REQUESTED: 'bg-surface-muted text-ink',
  PARTIAL_RETURN_COMPLETED: 'bg-surface-muted text-muted',
}


function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-md px-3 py-1.5 text-body-sm font-semibold ${getOrderStatusClass(status)}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  )
}

function getItemSubtotal(item) {
  const unitPrice = Number(item.priceAtOrder ?? item.price ?? 0)
  const quantity = Number(item.quantity ?? 1)
  return unitPrice * quantity
}

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
    <ModalShell title="내 리뷰" titleId="review-view-modal-title" onClose={onClose} maxWidth="max-w-lg">
      {formattedDate && <p className="mb-4 text-body-sm text-muted">작성일 {formattedDate}</p>}

      <Button variant="outline" size="sm" onClick={onEdit} className="mb-4 flex items-center gap-1">
        <Edit2 className="size-3.5" aria-hidden="true" />
        수정
      </Button>

      {isLoading ? (
        <PageLoadingBox label="리뷰를 불러오는 중입니다." />
      ) : review ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-border-soft py-4">
            <img
              className="size-20 shrink-0 rounded-md object-cover"
              src={resolveImageUrl(context.imageUrl) || 'https://via.placeholder.com/100'}
              alt={context.productName}
            />
            <div className="min-w-0">
              <p className="font-semibold text-ink">{context.productName}</p>
            </div>
          </div>

          <div className="border-b border-border-soft pb-4">
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

          <div className="border-b border-border-soft pb-4">
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
                className="mt-2 max-h-48 max-w-xs rounded-md border border-border object-cover"
              />
            </div>
          )}
        </div>
      ) : null}
    </ModalShell>
  )
}

function TrackingModal({ order, onClose }) {
  return (
    <ModalShell title="배송 조회" onClose={onClose} maxWidth="max-w-md">
      <p className="text-body-sm text-muted">주문번호 #{order.orderId}</p>

      <div className="mt-6 rounded-md border border-border bg-surface-muted p-5">
        <p className="text-caption text-muted">운송장 번호</p>

        {order.trackingNumber ? (
          <p className="mt-2 text-xl font-bold text-ink">{order.trackingNumber}</p>
        ) : (
          <p className="mt-2 text-body-sm font-medium text-muted">
            아직 운송장 번호가 등록되지 않았습니다.
          </p>
        )}
      </div>
    </ModalShell>
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
    <ModalShell title="반품 신청" onClose={onClose} maxWidth="max-w-xl" bodyClassName="p-6">
      <form onSubmit={handleSubmit}>
        <p className="text-body-sm text-muted">반품 정보를 확인하고 사유를 입력해 주세요.</p>

        <div className="mt-6 grid gap-4 rounded-md border border-border bg-surface-muted p-5 text-body-sm">
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
          className={`mt-3 h-36 w-full resize-none border border-border p-4 text-body ${formControlFocusClass}`}
          placeholder="상세 사유를 입력해 주세요."
          value={detailReason}
          onChange={(event) => setDetailReason(event.target.value)}
        />

        {validationMessage && (
          <p className="mt-4 rounded border border-error-border bg-error-soft px-4 py-3 text-body-sm font-semibold text-error" role="alert">
            {validationMessage}
          </p>
        )}

        <div className="mt-8 flex justify-end gap-3 border-t border-border-soft pt-6">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            취소
          </Button>

          <Button type="submit" variant="primary" size="md">
            반품 신청
          </Button>
        </div>
      </form>
    </ModalShell>
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
    <ModalShell
      title={isAllCancel ? '전체 주문 취소' : '주문 취소'}
      onClose={onClose}
      maxWidth="max-w-xl"
      bodyClassName="p-6"
    >
      <p className="text-body-sm text-muted">취소할 주문 정보를 확인해 주세요.</p>

      <div className="mt-6 grid gap-4 rounded-md border border-border bg-surface-muted p-5 text-body-sm">
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

      <div className="mt-8 flex justify-end gap-3 border-t border-border-soft pt-6">
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
    </ModalShell>
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

function getOrderThumbnail(order) {
  const items = order.orderItems || []
  if (items.length > 0) {
    const first = items[0]
    return first.imageUrl || first.thumbnailImage || order.imageUrl
  }
  return order.imageUrl
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
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedDate = new Date(order.orderDate).toLocaleDateString('ko-KR')
  const totalAmount = getValidTotalPrice(order)
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
  const thumbnailUrl = getOrderThumbnail(order)

  return (
    <article className="overflow-hidden rounded-md border border-border bg-surface shadow-card">
      <button
        type="button"
        className="flex w-full items-center gap-4 p-5 text-left motion-safe-transition hover:bg-surface-muted/60"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted sm:size-20">
          {thumbnailUrl ? (
            <img
              className="h-full w-full object-cover"
              src={thumbnailUrl}
              alt=""
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-caption text-muted">
              이미지 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-body font-medium text-ink">
            주문번호 <span className="font-bold">#{order.orderId}</span>
            <span className="text-muted"> · {formattedDate}</span>
          </p>
          <p className="mt-2 line-clamp-1 text-body-sm text-muted">
            {getOrderProductSummary(order).productName}
          </p>
        </div>

        <div className="hidden shrink-0 sm:block">
          <OrderStatusBadge status={order.orderStatus} />
        </div>

        <div className="shrink-0 text-right">
          <p className="inline-flex items-baseline text-body-lg font-bold text-ink">
            <span>{totalAmount.toLocaleString()}</span>
            <span className="text-body font-medium">원</span>
          </p>
          <p className="mt-1 text-body-sm text-muted sm:hidden">
            {getOrderStatusLabel(order.orderStatus)}
          </p>
        </div>

        <ChevronDown
          className={`size-5 shrink-0 text-muted motion-safe-transition ${isExpanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <div className="mb-4 hidden sm:flex sm:justify-start">
            <OrderStatusBadge status={order.orderStatus} />
          </div>

          <div className="space-y-3">
            {orderItems.map((item, index) => {
              const imageUrl = item.imageUrl || item.thumbnailImage
              const itemSubtotal = getItemSubtotal(item)
              const isItemCancelled = item.status === 'CANCELLED'
              const productPath = item.productId ? `/shop/${item.productId}` : null

              const productInfo = (
                <>
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface">
                    {imageUrl ? (
                      <img
                        className="h-full w-full object-cover"
                        src={imageUrl}
                        alt=""
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-caption text-muted">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-ink">{item.productName}</p>
                    <p className="mt-1 text-body-sm text-muted">
                      수량 {item.quantity || 1}개
                    </p>
                    {item.status === 'CANCELLED' && (
                      <p className="mt-2 text-body-sm font-medium text-muted">주문 취소 완료</p>
                    )}
                    {item.status === 'RETURN_REQUESTED' && (
                      <p className="mt-2 text-body-sm font-medium text-muted">반품 신청 완료</p>
                    )}
                    {item.status === 'RETURN_COMPLETED' && (
                      <p className="mt-2 text-body-sm font-medium text-muted">반품 완료</p>
                    )}
                  </div>
                </>
              )

              return (
                <div
                  key={item.orderItemId ?? `${order.orderId}-${index}`}
                  className={`flex items-start gap-4 rounded-md bg-surface-muted p-4 ${isItemCancelled ? 'opacity-60' : ''}`}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      {productPath ? (
                        <Link
                          to={productPath}
                          className="flex min-w-0 flex-1 items-start gap-4 motion-safe-transition hover:opacity-90"
                        >
                          {productInfo}
                        </Link>
                      ) : (
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          {productInfo}
                        </div>
                      )}

                      <div className="shrink-0 text-right">
                        <span className={`text-ink ${isItemCancelled ? 'line-through' : ''}`}>
                          {itemSubtotal.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {canCancel && item.status === 'ORDERED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCancelItemClick(order, item)}
                        >
                          주문 취소
                        </Button>
                      )}

                      {canTrack && index === 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTrackingClick(order)}
                        >
                          배송 조회
                        </Button>
                      )}

                      {canReturnOrReview && item.status === 'ORDERED' && canWriteReview(order, item) && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onReviewClick(buildReviewContext(order, item))}
                        >
                          리뷰 작성
                        </Button>
                      )}

                      {canReturnOrReview && item.status === 'ORDERED' && item.hasReview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReviewClick(buildReviewContext(order, item))}
                        >
                          내 리뷰 보기
                        </Button>
                      )}

                      {canReturnOrReview && item.status === 'ORDERED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReturnClick(order, item)}
                        >
                          반품 신청
                        </Button>
                      )}

                      {canReturnOrReview && item.status === 'ORDERED' && item.productId && (
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
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" onClick={() => onDetailClick(order.orderId)}>
              주문 상세
            </Button>

            {canCancelAll && (
              <Button variant="outline" size="sm" onClick={() => onCancelClick(order)}>
                전체 주문취소
              </Button>
            )}

            {canReturnAll && (
              <Button variant="outline" size="sm" onClick={() => onReturnClick(order, null)}>
                전체 반품
              </Button>
            )}

            {canRepurchaseAll && (
              <Button variant="primary" size="sm" onClick={() => onRepurchaseAll(order)}>
                전체 재구매
              </Button>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

function MyOrders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

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

  const page = Number(searchParams.get('page')) || 1
  const statusGroup = searchParams.get('statusGroup') || 'ALL'
  const monthsParam = searchParams.get('months')
  const months = monthsParam ? Number(monthsParam) : null

  const updateFilters = ({ nextStatusGroup, nextMonths, nextPage = 1 }) => {
    const params = new URLSearchParams(searchParams)

    params.set('page', String(nextPage))

    if (nextStatusGroup !== undefined) {
      if (!nextStatusGroup || nextStatusGroup === 'ALL') {
        params.delete('statusGroup')
      } else {
        params.set('statusGroup', nextStatusGroup)
      }
    }

    if (nextMonths !== undefined) {
      if (nextMonths === null) {
        params.delete('months')
      } else {
        params.set('months', String(nextMonths))
      }
    }

    setSearchParams(params)
  }

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
    if (page !== 1) {
      updateFilters({ nextPage: 1 })
      return
    }

    fetchOrders({ targetPage: 1, nextStatusGroup: statusGroup, nextMonths: months })
  }

  const handleReset = () => {
    setSearchParams(new URLSearchParams({ page: '1' }))
  }

  useEffect(() => {
    fetchOrders({ targetPage: page, nextStatusGroup: statusGroup, nextMonths: months })
  }, [page, statusGroup, months])

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
      <MyPageHeader
        title="주문/배송 내역"
        description="주문 상태와 배송 진행을 확인할 수 있습니다."
      />

      <MyPagePanel className="mt-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-end gap-6">
          <Select
            id="order-status-filter"
            label="주문 상태"
            size="sm"
            className="min-w-36"
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'PENDING', label: '결제 대기' },
              { value: 'SHIPPING', label: '배송중' },
              { value: 'DELIVERED', label: '배송완료' },
              { value: 'CANCEL_RETURN', label: '취소/반품' },
            ]}
            value={statusGroup}
            onChange={(event) => updateFilters({
              nextStatusGroup: event.target.value,
              nextMonths: months,
              nextPage: 1,
            })}
          />

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
                  onClick={() => updateFilters({
                    nextMonths: period.value,
                    nextStatusGroup: statusGroup,
                    nextPage: 1,
                  })}
                >
                  {period.label}
                </Button>
              ))}
            </div>
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
      </MyPagePanel>

      <section className="mt-6 grid gap-4">
        {isLoading ? (
          <PageLoadingBox label="주문 내역을 불러오는 중입니다." />
        ) : orders.length === 0 ? (
          <PageEmptyBox title="주문 내역이 없습니다." />
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
            getPageHref={(p) => {
              const params = new URLSearchParams(searchParams)
              params.set('page', String(p))
              return `/mypage/orders?${params.toString()}`
            }}
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