import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    getCheckoutFromCart,
    getCheckoutDirect,
} from '../../../api/checkoutApi'
import { getAddresses } from '../../../api/addressApi'
import { createOrder } from '../../../api/orderApi'
import CheckoutAddressPickerModal from '../components/CheckoutAddressPickerModal'
import OrderProgressSteps from '../components/OrderProgressSteps'
import CashPaymentModal from '../../payment/components/CashPaymentModal'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { SHIPPING_MEMO_OPTIONS } from '../constants/shippingMemoOptions.js'
import { resolveDeliveryFee } from '../utils/resolveDeliveryFee.js'
import OrderCheckoutFooter from '../components/OrderCheckoutFooter.jsx'
import { Button, Select, PageLoadingBox, PageErrorBox, formControlFocusClass } from '../../../components/index.js'

const EMPTY_CART_ITEM_IDS = []

function enrichCheckoutItems(data, fallbackImageUrl) {
    if (!data?.items?.length || !fallbackImageUrl) {
        return data
    }

    return {
        ...data,
        items: data.items.map((item) => ({
            ...item,
            imageUrl: item.imageUrl ?? item.image ?? fallbackImageUrl,
        })),
    }
}

export default function CheckoutPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const routeState = location.state ?? {}
    const {
        type,
        productId,
        quantity,
    } = routeState
    const cartItemIds = routeState.cartItemIds ?? EMPTY_CART_ITEM_IDS
    const cartItemIdsKey = cartItemIds.join(',')

    const [checkoutData, setCheckoutData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchFailed, setFetchFailed] = useState(false)

    const [addresses, setAddresses] = useState([])
    const [address, setAddress] = useState(null)

    const [paymentMethod, setPaymentMethod] = useState('CARD')
    const [shippingMemo, setShippingMemo] = useState('')
    const [customMemo, setCustomMemo] = useState('')

    const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false)
    const [isCashModalOpen, setIsCashModalOpen] = useState(false)

    const refreshAddresses = async () => {
        const addressData = await getAddresses()
        setAddresses(addressData)
        return addressData
    }

    useEffect(() => {
        const isDirect = type === 'direct' && productId
        const isCart = (Array.isArray(cartItemIds) && cartItemIds.length > 0) || type === 'cart'

        if (!isDirect && !isCart) {
            setLoading(false)
            alert('주문 정보가 없습니다.')
            navigate(-1)
            return undefined
        }

        let cancelled = false
        setLoading(true)
        setFetchFailed(false)

        const fetchCheckout = async () => {
            try {
                let data
                if (isDirect) {
                    data = await getCheckoutDirect(productId, quantity)
                    data = enrichCheckoutItems(data, routeState.imageUrl)
                } else {
                    data = await getCheckoutFromCart(cartItemIds)
                }

                if (cancelled) return

                setCheckoutData(data)

                const addressData = await refreshAddresses()
                if (cancelled) return

                const defaultAddress =
                    addressData.find((item) => item.isDefault) || addressData[0]

                setAddress(defaultAddress)
            } catch (error) {
                if (cancelled) return
                console.error(error)
                setFetchFailed(true)
                alert('주문서 조회에 실패했습니다.')
                navigate(-1)
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchCheckout()

        return () => {
            cancelled = true
        }
    }, [type, productId, quantity, cartItemIdsKey, navigate])

    if (loading || fetchFailed) {
        return (
            <main className="layout-container py-12">
                <PageLoadingBox label="주문 정보를 불러오는 중입니다." />
            </main>
        )
    }

    if (!checkoutData) {
        return (
            <main className="layout-container py-12">
                <PageErrorBox title="주문 정보를 불러올 수 없습니다." />
            </main>
        )
    }

    const orderItems = checkoutData.items || []

    const { originalTotalAmount, totalDiscountAmount } = orderItems.reduce((acc, item) => {
        const price = Number(item.unitPrice ?? item.price ?? item.salePrice ?? 0)
        const qty = Number(item.quantity ?? 1)
        const discountRate = Number(item.discountRate ?? 0)
        const itemDiscount = Math.floor(price * (discountRate / 100))

        return {
            originalTotalAmount: acc.originalTotalAmount + (price * qty),
            totalDiscountAmount: acc.totalDiscountAmount + (itemDiscount * qty),
        }
    }, { originalTotalAmount: 0, totalDiscountAmount: 0 })

    const deliveryFee = resolveDeliveryFee(orderItems)
    const productTotalAmount = originalTotalAmount - totalDiscountAmount
    const finalTotalAmount = productTotalAmount + deliveryFee
    const requestMessage = shippingMemo === 'custom' ? customMemo : shippingMemo

    const handlePayment = async () => {
        if (!address) {
            alert('배송지를 선택해주세요.')
            return
        }

        try {
            const orderRequest = {
                cartItemIds,
                orderItems: checkoutData.items.map((item) => ({
                    productId: item.productId,
                    source: item.source || 'INTERNAL',
                    quantity: Number(item.quantity ?? 1),
                })),
                receiverName: address.receiverName,
                receiverPhone: address.receiverPhone,
                deliveryAddress: `(${address.zipCode}) ${address.baseAddress} ${address.detailAddress}`,
                requestMessage,
                totalAmount: finalTotalAmount,
                deliveryFee,
                paymentMethod,
            }

            const orderId = await createOrder(orderRequest)
            navigate(`/mypage/orders/${orderId}`, { state: { fromCheckout: true } })
        } catch (error) {
            console.error('주문 생성 실패:', error)
            alert('주문 생성에 실패했습니다.')
        }
    }

    const handleTossPayment = async () => {
        if (!address) {
            alert('배송지를 선택해주세요.')
            return
        }

        try {
            const orderRequest = {
                orderItems: checkoutData.items.map((item) => ({
                    productId: item.productId,
                    source: item.source || 'INTERNAL',
                    quantity: Number(item.quantity ?? 1),
                })),
                receiverName: address.receiverName,
                receiverPhone: address.receiverPhone,
                deliveryAddress: `(${address.zipCode}) ${address.baseAddress} ${address.detailAddress}`,
                requestMessage,
                totalAmount: finalTotalAmount,
                deliveryFee,
                paymentMethod: 'CARD',
            }

            const orderId = await createOrder(orderRequest)

            const tossPayments = await loadTossPayments(
                import.meta.env.VITE_TOSS_CLIENT_KEY,
            )

            await tossPayments.requestPayment('카드', {
                amount: finalTotalAmount,
                orderId: `ORDER-${orderId}-${Date.now()}`,
                orderName:
                    checkoutData.items.length > 1
                        ? `${checkoutData.items[0].productName} 외 ${checkoutData.items.length - 1}건`
                        : checkoutData.items[0].productName,
                customerName: address.receiverName,
                successUrl: `${window.location.origin}/payment/success?localOrderId=${orderId}`,
                failUrl: `${window.location.origin}/payment/fail`,
            })
        } catch (error) {
            console.error('토스 결제 요청 실패:', error)
            alert('결제 요청에 실패했습니다.')
        }
    }

    const handleClickPayment = () => {
        if (!address) {
            alert('배송지를 선택해주세요.')
            return
        }

        if (finalTotalAmount <= 0) {
            handlePayment()
            return
        }

        if (paymentMethod === 'CASH') {
            setIsCashModalOpen(true)
            return
        }

        if (paymentMethod === 'CARD') {
            handleTossPayment()
            return
        }

        handlePayment()
    }

    return (
        <>
            {isAddressPickerOpen && (
                <CheckoutAddressPickerModal
                    addresses={addresses}
                    selectedAddress={address}
                    onClose={() => setIsAddressPickerOpen(false)}
                    onSelect={setAddress}
                    onAddressesChange={refreshAddresses}
                />
            )}

            {isCashModalOpen && (
                <CashPaymentModal
                    totalAmount={finalTotalAmount}
                    onClose={() => setIsCashModalOpen(false)}
                    onConfirm={handlePayment}
                />
            )}

            <main className="layout-container py-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-ink">주문서</h1>
                        <p className="mt-3 text-body-sm text-muted">
                            주문 상품과 배송 정보를 확인해주세요.
                        </p>
                    </div>
                    <OrderProgressSteps currentStep="checkout" />
                </div>

                <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_18rem]">
                    <section className="space-y-6">
                        <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                            <h2 className="text-xl font-bold text-ink">
                                주문 상품
                            </h2>

                            <div className="mt-5 space-y-3">
                                {orderItems.map((item) => {
                                    const price = Number(item.unitPrice ?? item.price ?? item.salePrice ?? 0)
                                    const qty = Number(item.quantity ?? 1)
                                    const discountRate = Number(item.discountRate ?? 0)
                                    const discountAmount = Math.floor(price * (discountRate / 100))
                                    const discountedPrice = price - discountAmount
                                    const itemSubtotal = discountedPrice * qty
                                    const imageUrl = item.imageUrl ?? item.image
                                    const itemKey = `${item.productId}-${item.cartId ?? 'direct'}`
                                    const productPath = item.productId ? `/shop/${item.productId}` : null
                                    const itemClassName = 'flex items-start gap-4 rounded-md bg-surface-muted p-4 motion-safe-transition hover:opacity-90'

                                    const itemContent = (
                                      <>
                                            <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface">
                                                {imageUrl?.trim() ? (
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={imageUrl}
                                                        alt={item.productName}
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
                                                    <p className="mt-1 text-body-sm text-muted">수량 {qty}개</p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    {discountRate > 0 ? (
                                                        <>
                                                            <span className="block text-caption text-muted line-through">
                                                                {(price * qty).toLocaleString()}원
                                                            </span>
                                                            <span className="text-ink">
                                                                {itemSubtotal.toLocaleString()}원
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-ink">
                                                            {(price * qty).toLocaleString()}원
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                      </>
                                    )

                                    if (productPath) {
                                        return (
                                            <Link
                                                key={itemKey}
                                                to={productPath}
                                                className={`${itemClassName} focus-ring focus-ring-inset`}
                                                aria-label={`${item.productName} 상세 보기`}
                                            >
                                                {itemContent}
                                            </Link>
                                        )
                                    }

                                    return (
                                        <div key={itemKey} className={itemClassName}>
                                            {itemContent}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-md border border-border bg-surface shadow-card">
                            <div className="p-5">
                                {address ? (
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-body font-bold text-ink">
                                                {address.receiverName}
                                                {address.addressName ? (
                                                    <span className="ml-1 font-medium text-muted">
                                                        ({address.addressName})
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p className="mt-1 text-body-sm text-muted">
                                                {address.receiverPhone}
                                            </p>
                                            <p className="mt-2 text-body-sm leading-relaxed text-ink">
                                                ({address.zipCode}) {address.baseAddress} {address.detailAddress}
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="shrink-0"
                                            onClick={() => setIsAddressPickerOpen(true)}
                                        >
                                            변경
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-body-sm text-muted">
                                            등록된 배송지가 없습니다.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsAddressPickerOpen(true)}
                                        >
                                            배송지 추가
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-border px-5 py-4">
                                <Select
                                    id="shipping-memo"
                                    label="배송 메모"
                                    labelVisuallyHidden
                                    size="sm"
                                    options={SHIPPING_MEMO_OPTIONS.map((option) => ({
                                        value: option.value,
                                        label: option.label,
                                    }))}
                                    value={shippingMemo}
                                    onChange={(event) => setShippingMemo(event.target.value)}
                                />

                                {shippingMemo === 'custom' && (
                                    <textarea
                                        value={customMemo}
                                        onChange={(event) => setCustomMemo(event.target.value)}
                                        className={`mt-3 min-h-24 w-full rounded-md border border-border px-4 py-3 text-body-sm ${formControlFocusClass}`}
                                        placeholder="배송 요청사항을 입력해주세요."
                                    />
                                )}
                            </div>
                        </div>

                        <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                            <h2 className="text-xl font-bold text-ink">
                                결제 방식
                            </h2>

                            <div className="mt-5 space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CARD"
                                        checked={paymentMethod === 'CARD'}
                                        onChange={(event) => setPaymentMethod(event.target.value)}
                                    />
                                    카드 결제
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CASH"
                                        checked={paymentMethod === 'CASH'}
                                        onChange={(event) => setPaymentMethod(event.target.value)}
                                    />
                                    무통장 입금
                                </label>
                            </div>

                            <p className="mt-4 text-caption text-muted">
                                카드 결제는 토스페이먼츠 결제창을 통해 진행됩니다.
                            </p>
                        </div>
                    </section>

                    <div className="w-full lg:sticky lg:top-8 lg:z-10 lg:self-start">
                    <aside className="h-fit w-full rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">
                            결제 금액
                        </h2>

                        <div className="mt-6 space-y-4 text-body-sm">
                            <div className="flex justify-between">
                                <span>상품 금액</span>
                                <span className="text-ink">
                                    {originalTotalAmount.toLocaleString()}원
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>총 배송비</span>
                                <span className="text-ink">
                                    {deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}
                                </span>
                            </div>

                            {totalDiscountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span>할인</span>
                                    <span>
                                        -{totalDiscountAmount.toLocaleString()}원
                                    </span>
                                </div>
                            )}
                        </div>

                        <OrderCheckoutFooter
                            amount={finalTotalAmount}
                            actionLabel="결제하기"
                            onAction={handleClickPayment}
                        />
                    </aside>
                    </div>
                </div>
            </main>
        </>
    )
}
