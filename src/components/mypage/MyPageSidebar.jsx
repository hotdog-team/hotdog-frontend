import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/mypage/profile', label: '내 정보 수정' },
  { to: '/mypage/settings', label: '개인 화면 설정' },
  { to: '/mypage/addresses', label: '내 배송지 관리' },
  { to: '/mypage/orders', label: '주문/배송 내역' },
  { to: '/mypage/bookmarks', label: '찜한 상품' },
  { to: '/mypage/reviews', label: '내 리뷰' },
  { to: '/mypage/inquiries', label: '문의 내역' },
]

const navLinkClass =
  'focus-ring block w-full px-4 py-3.5 text-left text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

export default function MyPageSidebar() {
  return (
    <aside className="h-fit rounded-lg border border-border bg-surface py-8 px-6 lg:sticky lg:top-24" aria-label="마이페이지 메뉴">
      <h2 className="mb-4 px-1 text-xl font-semibold text-ink">마이페이지</h2>
      <nav className="flex flex-col divide-y divide-border-soft">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? 'bg-surface-muted font-semibold text-ink' : 'font-medium text-muted hover:bg-surface-muted hover:text-ink'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
