import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, LoaderCircle } from 'lucide-react'
import { confirmPayment } from '../../../api/paymentApi'
import OrderProgressSteps from '../../shop/components/OrderProgressSteps'
import { Button } from '../../../components/index.js'

export default function PaymentSuccessPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('processing')
    const [errorMessage, setErrorMessage] = useState('')
    const [orderId, setOrderId] = useState(null)
    const hasConfirmed = useRef(false)

    useEffect(() => {
        document.title = '결제 승인 | D-TO'
    }, [])

    useEffect(() => {
        if (hasConfirmed.current) return

        hasConfirmed.current = true

        const approvePayment = async () => {
            const paymentKey = searchParams.get('paymentKey')
            const tossOrderId = searchParams.get('orderId')
            const amount = Number(searchParams.get('amount'))
            const localOrderId = Number(searchParams.get('localOrderId'))

            setOrderId(Number.isFinite(localOrderId) ? localOrderId : null)

            if (!paymentKey || !tossOrderId || !amount || !localOrderId) {
                setStatus('error')
                setErrorMessage('결제 승인 정보가 올바르지 않습니다.')
                return
            }

            try {
                await confirmPayment({
                    paymentKey,
                    tossOrderId,
                    orderId: localOrderId,
                    amount,
                    paymentMethod: 'CARD',
                })

                setStatus('success')

                window.setTimeout(() => {
                    navigate(`/mypage/orders/${localOrderId}`, {
                        replace: true,
                        state: { fromCheckout: true },
                    })
                }, 1200)
            } catch (error) {
                console.error('결제 승인 실패:', error)
                setStatus('error')
                setErrorMessage(
                    error?.response?.data?.message
                    || '결제 승인에 실패했습니다. 주문 내역에서 상태를 확인해 주세요.',
                )
            }
        }

        approvePayment()
    }, [searchParams, navigate])

    const goToOrder = () => {
        if (!orderId) {
            navigate('/mypage/orders', { replace: true })
            return
        }

        navigate(`/mypage/orders/${orderId}`, {
            replace: true,
            state: { fromCheckout: true },
        })
    }

    return (
        <main className="layout-container flex flex-1 flex-col py-12">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-ink">결제</h1>
                </div>
                <OrderProgressSteps currentStep="complete" />
            </div>

            <section className="mx-auto w-full max-w-md rounded-md border border-border bg-surface px-6 py-10 text-center shadow-card max-sm:px-5 max-sm:py-8">
                {status === 'processing' && (
                    <>
                        <div
                            className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand"
                            aria-hidden="true"
                        >
                            <LoaderCircle className="size-7 animate-spin" strokeWidth={2.5} />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-ink max-sm:text-xl">
                            결제 승인 중
                        </h2>
                        <p className="text-body-sm leading-relaxed text-muted" role="status" aria-live="polite">
                            결제를 안전하게 확인하고 있습니다.
                            <br />
                            잠시만 기다려 주세요.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div
                            className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-brand text-white"
                            aria-hidden="true"
                        >
                            <Check className="size-7" strokeWidth={2.5} />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-ink max-sm:text-xl">
                            결제가 완료되었습니다
                        </h2>
                        <p className="mb-6 text-body-sm leading-relaxed text-muted" role="status" aria-live="polite">
                            주문이 정상적으로 접수되었습니다.
                            <br />
                            주문 상세 페이지로 이동합니다.
                        </p>
                        <Button type="button" variant="primary" size="md" fullWidth onClick={goToOrder}>
                            주문 상세 보기
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div
                            className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger"
                            aria-hidden="true"
                        >
                            <span className="text-2xl font-bold" aria-hidden="true">!</span>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-ink max-sm:text-xl">
                            결제 승인에 실패했습니다
                        </h2>
                        <p className="mb-6 text-body-sm leading-relaxed text-muted" role="alert">
                            {errorMessage}
                        </p>
                        <div className="flex flex-col gap-2">
                            {orderId ? (
                                <Button type="button" variant="primary" size="md" fullWidth onClick={goToOrder}>
                                    주문 내역 확인
                                </Button>
                            ) : null}
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                fullWidth
                                onClick={() => navigate('/cart', { replace: true })}
                            >
                                장바구니로 돌아가기
                            </Button>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}
