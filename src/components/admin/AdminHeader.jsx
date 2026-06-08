import { Link, useNavigate, useLocation } from 'react-router-dom'
import dtoLogo from '../../assets/d-to-logo.png'
import { useAuthStore } from '../../store/useAuthStore.js'
import { adminMenuSections, isAdminSectionActive } from './adminNav.js'

const focusRingClass =
  'focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface'

const topNavLinkBase =
  'focus-ring focus-ring-inset inline-flex items-center whitespace-nowrap px-1 pt-2 pb-1 text-base font-medium transition-[color,box-shadow] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

function getTopNavLinkClass(isActive) {
  return `${topNavLinkBase} ${
    isActive
      ? 'font-semibold text-ink shadow-[inset_0_-2px_0_0_var(--color-brand)]'
      : 'text-muted'
  }`
}

const utilityLinkClass =
  `inline-flex items-center text-base font-medium text-muted transition-colors hover:text-ink ${focusRingClass}`

export default function AdminHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="relative z-40 border-b border-border-soft bg-surface">
      <div className="layout-container-header flex min-h-20 min-w-0 items-center gap-7 max-lg:flex-wrap max-lg:gap-x-6 max-lg:gap-y-3 max-lg:py-4">
        <Link
          className={`inline-flex shrink-0 items-center gap-3 rounded-md ${focusRingClass}`}
          to="/admin/dashboard"
          aria-label="관리자 홈으로 가기"
        >
          <img className="h-8 w-auto object-contain" src={dtoLogo} aria-hidden="true" alt="" />
          <span className="rounded-sm bg-surface-muted px-2 py-1 text-caption font-semibold text-ink">관리자</span>
        </Link>

        <nav className="min-w-0 flex-1 overflow-x-auto py-1" aria-label="관리자 상위 메뉴">
          <ul className="flex items-center gap-6 whitespace-nowrap px-0.5 max-sm:gap-4">
            {adminMenuSections.map((section) => {
              const isActive = isAdminSectionActive(section, location.pathname)

              return (
                <li key={section.id}>
                  <Link
                    className={getTopNavLinkClass(isActive)}
                    to={section.to}
                  >
                    {section.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <nav className="flex shrink-0 items-center gap-6 text-ink max-sm:gap-4" aria-label="관리자 계정 메뉴">
          <Link className={utilityLinkClass} to="/home">
            쇼핑몰
          </Link>
          <button
            className={`text-base font-bold text-danger transition-colors hover:text-danger/80 ${focusRingClass}`}
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  )
}