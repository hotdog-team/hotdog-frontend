import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getOrderDetail, cancelOrderItems } from '../../../api/orderApi'
import CashPaymentModal from '../../payment/components/CashPaymentModal'
import OrderProgressSteps from '../../shop/components/OrderProgressSteps'
import { Button, getButtonClassName } from '../../../components/index.js'

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
}

function getDisplayOrderStatus({ orderStatus, paymentMethod, isAllItemsCancelled }) {
    if (isAllItemsCancelled || orderStatus === 'CANCELLED') {
        return 'CANCELLED'
    }

    if (orderStatus === 'PARTIAL_CANCELLED') {
        return paymentMethod === 'CASH' ? 'PENDING' : 'COMPLETED'
    }

    return orderStatus
}

function OrderStatusBadge({ status }) {
    return (
        <span
            className={`inline-flex rounded-md px-3 py-1.5 text-body-sm font-semibold ${ORDER_STATUS_CLASS[status] || 'bg-surface-muted text-muted'}`}
        >
            {ORDER_STATUS_LABEL[status] || status || '-'}
        </span>
    )
}

function getItemSubtotal(item) {
    const unitPrice = Number(item.priceAtOrder ?? item.price ?? 0)
    const quantity = Number(item.quantity ?? 1)
    return unitPrice * quantity
}

export default function OrderDetailPage() {
    const { orderId } = useParams()
    const location = useLocation()
    const isFreshOrder = location.state?.fromCheckout === true

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isCashModalOpen, setIsCashModalOpen] = useState(false)

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await getOrderDetail(orderId)
                setOrder(data)
            } catch (error) {
                console.error(error)
                alert('주문 상세 조회에 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetail()
    }, [orderId])

    if (loading) {
        return (
            <main className="layout-container py-12">
                <p className="text-body text-muted">
                    주문 정보를 불러오는 중입니다.
                </p>
            </main>
        )
    }

    if (!order) {
        return (
            <main className="layout-container py-12">
                <p className="text-body text-muted">
                    주문 정보를 찾을 수 없습니다.
                </p>
            </main>
        )
    }

    const orderItems = order.orderItems || []
    const orderStatus = order.orderStatus || '-'
    const paymentMethod = order.paymentMethod || '-'
    const deliveryFee = order.deliveryFee || 0

    const activeOrderItems = orderItems.filter(
        (item) => item.status !== 'CANCELLED',
    )

    const activeTotalPrice = activeOrderItems.reduce(
        (sum, item) => sum + getItemSubtotal(item),
        0,
    )

    const finalTotalAmount = activeTotalPrice + deliveryFee

    const isAllItemsCancelled =
        orderItems.length > 0 && activeOrderItems.length === 0

    const displayOrderStatus = getDisplayOrderStatus({
        orderStatus,
        paymentMethod,
        isAllItemsCancelled,
    })

    const isOrderCancelled = displayOrderStatus === 'CANCELLED'
    const canCancelOrder =
        ['PENDING', 'PROCESSING', 'COMPLETED', 'BEFORE_SHIPMENT'].includes(displayOrderStatus) &&
        activeOrderItems.length > 0

    const paymentMethodText =
        paymentMethod === 'CASH'
            ? '무통장 입금'
            : paymentMethod === 'CARD'
                ? '카드 결제'
                : paymentMethod === 'MOBILE_PAY'
                    ? '모바일 결제'
                    : '-'

    const formattedOrderDate = order.orderDate
        ? order.orderDate.replace('T', ' ').slice(0, 16)
        : null

    const handleCancelOrder = async () => {
        if (!canCancelOrder) return
        if (!window.confirm('주문을 취소하시겠습니까?')) return

        try {
            const cancelTargetItemIds = activeOrderItems.map((item) => item.orderItemId)

            await cancelOrderItems(order.orderId, cancelTargetItemIds)
            alert('주문이 취소되었습니다.')

            const data = await getOrderDetail(orderId)
            setOrder(data)
        } catch (error) {
            console.error('주문 취소 실패:', error)
            alert('주문 취소에 실패했습니다.')
        }
    }

    const handleCancelOrderItem = async (orderItemId) => {
        if (isOrderCancelled) return
        if (!window.confirm('해당 상품을 취소하시겠습니까?')) return

        try {
            await cancelOrderItems(order.orderId, [orderItemId])
            alert('상품이 취소되었습니다.')

            const data = await getOrderDetail(orderId)
            setOrder(data)
        } catch (error) {
            console.error('상품 취소 실패:', error)
            alert('상품 취소에 실패했습니다.')
        }
    }

    return (
        <main className="layout-container py-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-ink">
                        {isFreshOrder ? '주문 완료' : '주문 상세'}
                    </h1>
                    <p className="mt-3 text-body-sm text-muted">
                        {isOrderCancelled
                            ? '주문이 취소되었습니다.'
                            : isFreshOrder
                                ? '주문이 접수되었습니다. 아래에서 주문 내역을 확인해주세요.'
                                : '주문 상품과 배송 정보를 확인할 수 있습니다.'}
                    </p>
                    <p className="mt-3 text-body font-medium text-ink">
                        주문번호 <span className="font-bold">#{order.orderId}</span>
                        {formattedOrderDate ? (
                            <span className="text-muted">
                                {' '}
                                ·
                                {' '}
                                {formattedOrderDate}
                            </span>
                        ) : null}
                    </p>
                </div>
                <OrderProgressSteps currentStep="complete" />
            </div>

            <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_18rem]">
                <section className="space-y-6">
                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-ink">주문 상태</h2>
                                <div className="mt-3">
                                    <OrderStatusBadge status={displayOrderStatus} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {displayOrderStatus === 'PENDING' && paymentMethod === 'CASH' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsCashModalOpen(true)}
                                    >
                                        입금 계좌 확인
                                    </Button>
                                )}

                                {canCancelOrder && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelOrder}
                                    >
                                        전체 주문 취소
                                    </Button>
                                )}
                            </div>
                        </div>

                        {displayOrderStatus === 'PENDING' && paymentMethod === 'CASH' && (
                            <div className="mt-5 rounded-md bg-surface-muted px-4 py-4">
                                <p className="text-body-sm font-semibold text-ink">
                                    무통장 입금 안내
                                </p>
                                <p className="mt-2 text-body-sm text-muted">
                                    주문일로부터 3일 이내 입금이 확인되지 않을 경우 주문이 자동 취소됩니다.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">
                            주문 상품
                        </h2>

                        {isAllItemsCancelled ? (
                            <div className="mt-8 py-12 text-center">
                                <p className="text-body font-medium text-ink">
                                    모든 주문 상품이 취소되었습니다.
                                </p>
                                <p className="mt-2 text-body-sm text-muted">
                                    다른 상품을 둘러보시겠어요?
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {orderItems.map((item) => {
                                    const quantity = Number(item.quantity ?? 1)
                                    const itemSubtotal = getItemSubtotal(item)
                                    const imageUrl = item.thumbnailImage || item.imageUrl
                                    const productPath = item.productId ? `/shop/${item.productId}` : null
                                    const isItemCancelled = item.status === 'CANCELLED'
                                    const canCancelItem =
                                        !isOrderCancelled &&
                                        !isItemCancelled &&
                                        ['PENDING', 'COMPLETED', 'PARTIAL_CANCELLED'].includes(orderStatus)

                                    const itemClassName = [
                                        'flex items-start gap-4 rounded-md bg-surface-muted p-4 motion-safe-transition',
                                        isItemCancelled ? 'opacity-60' : 'hover:opacity-90',
                                    ].join(' ')

                                    const itemContent = (
                                        <>
                                            <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface">
                                                {imageUrl?.trim() ? (
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

                                            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-ink">{item.productName}</p>
                                                    <p className="mt-1 text-body-sm text-muted">
                                                        수량 {quantity}개
                                                    </p>
                                                    {isItemCancelled && (
                                                        <p className="mt-2 text-body-sm font-medium text-muted">
                                                            주문 취소 완료
                                                        </p>
                                                    )}
                                                    {canCancelItem && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => handleCancelOrderItem(item.orderItemId)}
                                                        >
                                                            상품 취소
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <span className={`text-ink ${isItemCancelled ? 'line-through' : ''}`}>
                                                        {itemSubtotal.toLocaleString()}원
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )

                                    if (productPath && !isItemCancelled) {
                                        return (
                                            <Link
                                                key={item.orderItemId || item.productId}
                                                to={productPath}
                                                className={`${itemClassName} focus-ring focus-ring-inset`}
                                                aria-label={`${item.productName} 상세 보기`}
                                            >
                                                {itemContent}
                                            </Link>
                                        )
                                    }

                                    return (
                                        <div
                                            key={item.orderItemId || item.productId}
                                            className={itemClassName}
                                        >
                                            {itemContent}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-md border border-border bg-surface shadow-card">
                        <div className="p-5 sm:p-6">
                            <h2 className="text-xl font-bold text-ink">배송 정보</h2>

                            <div className="mt-5">
                                <p className="text-body font-bold text-ink">
                                    {order.receiverName || '-'}
                                </p>
                                <p className="mt-1 text-body-sm text-muted">
                                    {order.receiverPhone || '-'}
                                </p>
                                <p className="mt-2 text-body-sm leading-relaxed text-ink">
                                    {order.deliveryAddress || '-'}
                                </p>
                                {order.requestMessage && (
                                    <p className="mt-4 border-t border-border pt-4 text-body-sm text-muted">
                                        <span className="font-medium text-ink">배송 메모</span>
                                        <span className="mt-1 block">{order.requestMessage}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/home"
                        className="inline-block text-body-sm font-medium text-ink hover:text-brand"
                    >
                        ← 쇼핑 계속하기
                    </Link>
                </section>

                <div className="w-full lg:sticky lg:top-8 lg:z-10 lg:self-start">
                    <aside className="h-fit w-full rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">결제 금액</h2>

                        <div className="mt-6 space-y-4 text-body-sm">
                            <div className="flex justify-between gap-4">
                                <span className="shrink-0">결제 수단</span>
                                <span className="text-right text-ink">{paymentMethodText}</span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="shrink-0">상품 금액</span>
                                <span className="text-right text-ink">
                                    {activeTotalPrice.toLocaleString()}원
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="shrink-0">총 배송비</span>
                                <span className="text-right text-ink">
                                    {deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-border pt-5">
                            <p className="text-body font-medium">최종 결제 금액</p>
                            <p className="mt-2 text-right">
                                <span className="text-2xl font-bold text-brand">
                                    {finalTotalAmount.toLocaleString()}
                                </span>
                                <span className="ml-0.5 text-body-lg font-medium text-brand">원</span>
                            </p>
                        </div>

                        <Link
                            to="/mypage/orders"
                            className={getButtonClassName({
                                variant: 'outline',
                                size: 'md',
                                fullWidth: true,
                                className: 'mt-6 h-12',
                            })}
                        >
                            주문 목록 보기
                        </Link>
                    </aside>
                </div>
            </div>

            {isCashModalOpen && (
                <CashPaymentModal
                    totalAmount={finalTotalAmount}
                    onClose={() => setIsCashModalOpen(false)}
                    onConfirm={() => setIsCashModalOpen(false)}
                />
            )}
        </main>
    )
}
