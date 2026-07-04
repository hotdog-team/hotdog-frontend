import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import OrderProgressSteps from '../../shop/components/OrderProgressSteps'
import { getButtonClassName } from '../../../components/index.js'

export default function PaymentFailPage() {
    const [searchParams] = useSearchParams()

    const message =
        searchParams.get('message') || '결제가 취소되었거나 실패했습니다.'
    const code = searchParams.get('code')

    useEffect(() => {
        document.title = '결제 실패 | D-TO'
    }, [])

    return (
        <main className="layout-container flex flex-1 flex-col py-12">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-ink">결제</h1>
                    <p className="mt-3 text-body-sm text-muted">
                        결제 결과를 확인해 주세요.
                    </p>
                </div>
                <OrderProgressSteps currentStep="checkout" />
            </div>

            <section className="mx-auto w-full max-w-md rounded-md border border-border bg-surface px-6 py-10 text-center shadow-card max-sm:px-5 max-sm:py-8">
                <div
                    className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger"
                    aria-hidden="true"
                >
                    <CircleAlert className="size-7" strokeWidth={2.5} />
                </div>

                <h2 className="mb-2 text-2xl font-bold text-ink max-sm:text-xl">
                    결제가 완료되지 않았습니다
                </h2>

                <p className="mb-2 text-body-sm leading-relaxed text-muted" role="alert">
                    {message}
                </p>

                {code ? (
                    <p className="mb-6 text-caption text-muted">
                        오류 코드: {code}
                    </p>
                ) : (
                    <div className="mb-6" />
                )}

                <div className="rounded-md bg-surface-muted px-4 py-3 text-left text-caption leading-relaxed text-muted">
                    결제가 취소되었거나 승인에 실패했습니다.
                    <br />
                    장바구니에서 다시 시도하거나, 문제가 계속되면 고객센터로 문의해 주세요.
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <Link
                        to="/cart"
                        className={getButtonClassName({ variant: 'primary', size: 'md', fullWidth: true })}
                    >
                        장바구니로 돌아가기
                    </Link>
                    <Link
                        to="/mypage/orders"
                        className={getButtonClassName({ variant: 'outline', size: 'md', fullWidth: true })}
                    >
                        주문 내역 보기
                    </Link>
                    <Link
                        to="/"
                        className="mt-2 text-body-sm font-medium text-muted hover:text-ink hover:underline focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink"
                    >
                        홈으로 이동
                    </Link>
                </div>
            </section>
        </main>
    )
}
