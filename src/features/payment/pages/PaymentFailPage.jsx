import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentFailPage() {
    const [searchParams] = useSearchParams()

    const message =
        searchParams.get('message') || '결제가 취소되었거나 실패했습니다.'

    return (
        <main className="layout-container py-12">
            <h1 className="text-3xl font-bold text-ink">
                결제 실패
            </h1>

            <p className="mt-3 text-body-sm text-muted">
                {message}
            </p>

            <Link
                to="/cart"
                className="mt-6 inline-block rounded-md bg-brand px-5 py-3 text-body-sm font-bold text-white"
            >
                장바구니로 돌아가기
            </Link>
        </main>
    )
}