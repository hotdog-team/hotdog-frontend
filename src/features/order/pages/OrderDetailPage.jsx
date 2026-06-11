import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderDetail, cancelOrderItems } from '../../../api/orderApi'
import CashPaymentModal from '../../payment/components/CashPaymentModal'

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
            className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${ORDER_STATUS_CLASS[status] || 'bg-gray-100 text-gray-600'}`}
        >
            {ORDER_STATUS_LABEL[status] || status || '-'}
        </span>
    )
}

export default function OrderDetailPage() {
    const { orderId } = useParams()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isCashModalOpen, setIsCashModalOpen] = useState(false)

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const data = await getOrderDetail(orderId)
                console.log('주문 상세 조회 결과:', data)
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
                    주문 상세 정보를 불러오는 중입니다.
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
        (item) => item.status !== 'CANCELLED'
    )

    const activeTotalPrice = activeOrderItems.reduce(
        (sum, item) =>
            sum +
            (item.priceAtOrder || item.totalPrice || item.price || 0) *
            (item.quantity || 1),
        0
    )

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

    const statusText = ORDER_STATUS_LABEL[displayOrderStatus] || displayOrderStatus

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
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-caption text-muted">
                        주문번호 #{order.orderId}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-ink">
                        주문 상세
                    </h1>

                    <p className="mt-3 text-body-sm text-muted">
                        주문 상품과 배송 정보를 확인할 수 있습니다.
                    </p>

                    {order.orderDate && (
                        <p className="mt-2 text-caption text-muted">
                            주문일시 {order.orderDate.replace('T', ' ').slice(0, 16)}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-3">

                    <Link
                        to="/mypage/orders"
                        className="rounded-md border border-border px-5 py-3 text-body-sm font-bold text-ink"
                    >
                        주문 목록
                    </Link>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-[1fr_18rem] gap-8">
                <section className="space-y-6">
                    <div className="mt-5 rounded-md bg-surface-muted p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    현재 주문 상태
                                </p>
                                <div className="mt-2">
                                    <OrderStatusBadge status={displayOrderStatus} />
                                </div>
                            </div>

                            {displayOrderStatus === 'PENDING' &&
                                paymentMethod === 'CASH' && (
                                    <button
                                        type="button"
                                        onClick={() => setIsCashModalOpen(true)}
                                        className="rounded border border-orange-500 px-4 py-2 text-sm font-bold text-orange-500 hover:bg-orange-50"
                                    >
                                        입금 계좌 확인
                                    </button>
                                )}
                        </div>

                        {isOrderCancelled && (
                            <p className="mt-4 text-sm font-bold text-gray-500">
                                주문 취소 완료
                            </p>
                        )}

                        {displayOrderStatus === 'PENDING' &&
                            paymentMethod === 'CASH' && (
                                <div className="mt-5 rounded-md border border-yellow-300 bg-yellow-50 p-4">
                                    <p className="font-bold text-yellow-800">
                                        무통장 입금 안내
                                    </p>

                                    <p className="mt-2 text-body-sm text-yellow-700">
                                        주문일로부터 3일 이내 입금이 확인되지 않을 경우
                                        주문이 자동 취소됩니다.
                                    </p>
                                </div>
                            )}
                    </div>

                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">
                            주문 상품 ({orderItems.length})
                        </h2>

                        <div className="mt-5 border-t border-border pt-5">
                            {orderItems.map((item) => {
                                const itemPrice =
                                    item.totalPrice ||
                                    item.priceAtOrder ||
                                    item.price ||
                                    0

                                const isItemCancelled = item.status === 'CANCELLED'
                                const canCancelItem =
                                    !isOrderCancelled &&
                                    !isItemCancelled &&
                                    ['PENDING', 'COMPLETED', 'PARTIAL_CANCELLED'].includes(orderStatus)

                                return (
                                    <div
                                        key={item.orderItemId || item.productId}
                                        className="grid grid-cols-[5rem_1fr_8rem] items-start gap-4 border-b border-border py-4 last:border-b-0"
                                    >
                                        {item.thumbnailImage || item.imageUrl ? (
                                            <img
                                                src={item.thumbnailImage || item.imageUrl}
                                                alt={item.productName}
                                                className="h-16 w-16 rounded border object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded border text-xs text-blue-600">
                                                이미지 없음
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-bold text-ink">
                                                {item.productName}
                                            </p>

                                            {item.description && (
                                                <p className="mt-1 line-clamp-2 text-body-sm text-muted">
                                                    {item.description}
                                                </p>
                                            )}

                                            <p className="mt-1 text-body-sm text-muted">
                                                수량 {item.quantity}개
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-right font-bold text-ink">
                                                {itemPrice.toLocaleString()}원
                                            </p>

                                            {isItemCancelled ? (
                                                <span className="text-sm font-medium text-gray-500">
                                                    주문 취소 완료
                                                </span>
                                            ) : canCancelItem ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelOrderItem(item.orderItemId)}
                                                    className="rounded border border-red-500 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                                                >
                                                    주문 취소
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })}

                            {isAllItemsCancelled && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <p className="text-lg font-bold text-ink">
                                        모든 주문 상품이 취소되었습니다.
                                    </p>

                                    <p className="mt-2 text-body-sm text-muted">
                                        다른 상품을 둘러보시겠어요?
                                    </p>

                                    <Link
                                        to="/"
                                        className="mt-5 rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                                    >
                                        쇼핑 계속하기
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">배송 정보</h2>

                        <div className="mt-5 space-y-3 text-body-sm">
                            <p>
                                <span className="text-muted">받는 사람</span>
                                <br />
                                <strong>{order.receiverName || '-'}</strong>
                            </p>

                            <p>
                                <span className="text-muted">연락처</span>
                                <br />
                                <strong>{order.receiverPhone || '-'}</strong>
                            </p>

                            <p>
                                <span className="text-muted">배송지</span>
                                <br />
                                <strong>{order.deliveryAddress || '-'}</strong>
                            </p>

                            <p>
                                <span className="text-muted">요청사항</span>
                                <br />
                                <strong>
                                    {order.requestMessage || '요청사항 없음'}
                                </strong>
                            </p>
                        </div>
                    </div>

                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">결제 정보</h2>

                        <div className="mt-5 space-y-4 text-body-sm">
                            <div className="flex justify-between text-muted">
                                <span>결제 수단</span>
                                <strong className="text-ink">
                                    {paymentMethodText}
                                </strong>
                            </div>

                            <div className="flex justify-between text-muted">
                                <span>상품 금액</span>
                                <strong className="text-ink">
                                    {activeTotalPrice.toLocaleString()}원
                                </strong>
                            </div>

                            <div className="flex justify-between text-muted">
                                <span>배송비</span>
                                <strong className="text-ink">
                                    {deliveryFee.toLocaleString()}원
                                </strong>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between">
                                    <span className="font-bold text-ink">
                                        총 결제 금액
                                    </span>
                                    <strong className="text-xl font-bold text-ink">
                                        {(activeTotalPrice + deliveryFee).toLocaleString()}원
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {isCashModalOpen && (
                <CashPaymentModal
                    totalAmount={activeTotalPrice + deliveryFee}
                    onClose={() => setIsCashModalOpen(false)}
                    onConfirm={() => setIsCashModalOpen(false)}
                />
            )}
        </main>
    )
}
