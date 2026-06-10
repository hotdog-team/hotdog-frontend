import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getCheckoutFromCart } from '../../../api/checkoutApi'
import { getAddresses } from '../../../api/addressApi'

export default function CheckoutPage() {
    const location = useLocation()
    const cartItemIds = location.state?.cartItemIds || []

    const [checkoutData, setCheckoutData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [address, setAddress] = useState(null)

    useEffect(() => {
        const fetchCheckout = async () => {
            try {
                const data = await getCheckoutFromCart(cartItemIds)
                console.log('주문서 조회 결과:', data)
                setCheckoutData(data)

                const addressData = await getAddresses()
                console.log('배송지 조회 결과:', addressData)

                const defaultAddress =
                    addressData.find((item) => item.isDefault) || addressData[0]

                setAddress(defaultAddress)
            } catch (error) {
                console.error(error)
                alert('주문서 조회에 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        if (cartItemIds.length > 0) {
            fetchCheckout()
        } else {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <main className="layout-container py-12">
                <p className="text-body text-muted">
                    주문 정보를 불러오는 중입니다.
                </p>
            </main>
        )
    }

    const orderItems = checkoutData?.items || []
    const totalAmount = checkoutData?.totalAmount || 0

    return (


        <main className="layout-container py-12">
            <h1 className="text-3xl font-bold text-ink">주문서</h1>
            <p className="mt-3 text-body-sm text-muted">
                주문 상품과 배송 정보를 확인해주세요.
            </p>

            <div className="mt-8 grid grid-cols-[1fr_18rem] gap-8">
                <section className="space-y-6">
                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">주문 상품</h2>

                        <div className="mt-5 border-t border-border pt-5">
                            {orderItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="grid grid-cols-[1fr_6rem_8rem] items-center gap-4"
                                >
                                    <div>
                                        <p className="font-bold text-ink">{item.productName}</p>
                                        <p className="mt-1 text-body-sm text-muted">
                                            수량 {item.quantity}개
                                        </p>
                                    </div>

                                    <p className="text-right text-body-sm text-muted">
                                        {item.quantity}개
                                    </p>
                                    <p className="text-right font-bold text-ink">
                                        {(item.totalPrice || item.price * item.quantity).toLocaleString()}원
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">배송지 정보</h2>

                        <div className="mt-5 space-y-3">
                            <input
                                value={address?.receiverName || ''}
                                readOnly
                                className="w-full rounded-md border border-border px-4 py-3 text-body-sm"
                            />
                            <input
                                value={address?.receiverPhone || ''}
                                readOnly
                                className="w-full rounded-md border border-border px-4 py-3 text-body-sm"
                            />
                            <input
                                value={
                                    address
                                        ? `(${address.zipCode}) ${address.baseAddress}`
                                        : ''
                                }
                                readOnly
                                className="w-full rounded-md border border-border px-4 py-3 text-body-sm"
                            />
                            <input
                                value={address?.detailAddress || ''}
                                readOnly
                                className="w-full rounded-md border border-border px-4 py-3 text-body-sm"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <h2 className="text-xl font-bold text-ink">배송 요청사항</h2>

                        <textarea
                            className="mt-5 min-h-28 w-full rounded-md border border-border px-4 py-3 text-body-sm"
                            placeholder="배송 요청사항을 입력해주세요."
                        />
                    </div>
                </section>

                <aside className="h-fit rounded-md border border-border bg-surface p-6 shadow-card">
                    <h2 className="text-xl font-bold text-ink">결제 금액</h2>

                    <div className="mt-6 space-y-4 text-body-sm">
                        <div className="flex justify-between text-muted">
                            <span>상품 금액</span>
                            <strong className="text-ink">
                                {totalAmount.toLocaleString()}원
                            </strong>
                        </div>

                        <div className="flex justify-between text-muted">
                            <span>배송비</span>
                            <strong className="text-ink">무료</strong>
                        </div>

                        <div className="mt-6 border-t border-border pt-5">
                            <div className="flex items-center justify-between">
                                <span className="text-body-lg font-bold text-ink">
                                    최종 결제 금액
                                </span>
                                <strong className="text-2xl font-bold text-ink">
                                    {totalAmount.toLocaleString()}원
                                </strong>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="mt-6 w-full rounded-md bg-brand py-4 text-body font-bold text-white hover:opacity-90"
                    >
                        결제하기
                    </button>
                </aside>
            </div>
        </main>
    )
}