import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { confirmPayment } from '../../../api/paymentApi'

export default function PaymentSuccessPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [message, setMessage] = useState('결제 승인 중입니다.')
    const hasConfirmed = useRef(false)

    useEffect(() => {
        if (hasConfirmed.current) return

        hasConfirmed.current = true

        const approvePayment = async () => {
            const paymentKey = searchParams.get('paymentKey')
            const tossOrderId = searchParams.get('orderId')
            const amount = Number(searchParams.get('amount'))
            const orderId = Number(searchParams.get('localOrderId'))

            if (!paymentKey || !tossOrderId || !amount || !orderId) {
                alert('결제 승인 정보가 올바르지 않습니다.')
                navigate('/cart')
                return
            }

            try {
                await confirmPayment({
                    paymentKey,
                    tossOrderId,
                    orderId,
                    amount,
                    paymentMethod: 'CARD',
                })

                setMessage('결제가 완료되었습니다.')

                navigate(`/mypage/orders/${orderId}`, {
                    replace: true,
                    state: { fromCheckout: true },
                })
            } catch (error) {
                console.error('결제 승인 실패:', error)

                alert('결제 승인에 실패했습니다.')

                navigate(`/mypage/orders/${orderId}`, {
                    replace: true,
                    state: { fromCheckout: true },
                })
            }
        }

        approvePayment()
    }, [searchParams, navigate])

    return (
        <main className="layout-container py-12">
            <p className="text-body text-muted">{message}</p>
        </main>
    )
}