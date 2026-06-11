import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/mypage/profile', label: '내 정보 수정' },
    { to: '/mypage/settings', label: '개인 화면 설정' },
    { to: '/mypage/addresses', label: '내 배송지 관리' },
    { to: '/mypage/orders', label: '주문/배송 내역' },
    { to: '/mypage/bookmarks', label: '찜한 상품' },
    { to: '/mypage/cart', label: '내 장바구니' },
    { to: '/mypage/reviews', label: '내 리뷰' },
    { to: '/mypage/inquiries', label: '문의 내역' },
]

export default function MyPageSidebar() {
    return (
        <aside className="h-fit rounded-md border border-border bg-surface p-7" aria-label="마이페이지 메뉴">
            <h2 className="mb-8 text-body-lg font-medium">마이페이지</h2>
            <nav className="flex flex-col divide-y divide-border-soft">
                {navItems.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex w-full px-4 py-3.5 text-left text-body transition-colors ${isActive ? 'bg-surface-muted font-semibold text-ink' : 'text-body hover:bg-surface-muted'}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
