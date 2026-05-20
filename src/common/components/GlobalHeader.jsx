import { useEffect, useMemo, useState } from 'react'
import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { fetchCategories } from '../../api/categoryApi'
import dtoLogo from '../../assets/d-to-logo.png'
import { useAuthStore } from '../../store/useAuthStore'

const DEFAULT_CATEGORIES = [
  { label: '건강', to: '/shop?categoryId=health' },
  { label: '교육', to: '/shop?categoryId=education' },
  { label: '여행', to: '/shop?categoryId=travel' },
  { label: '선물', to: '/shop?categoryId=gift' },
  { label: '가전', to: '/shop?categoryId=appliance' },
]

const focusRingClass =
  'focus-ring rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface'

const categoryNavLinkBase =
  'focus-ring focus-ring-inset inline-flex items-center px-1 pt-2 pb-1 text-base font-medium transition-[color,box-shadow] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

function getCategoryIdFromPath(path) {
  const queryString = path.includes('?') ? path.slice(path.indexOf('?')) : ''
  return new URLSearchParams(queryString).get('categoryId')
}

function isCategoryNavActive(category, location, fallbackLabel) {
  const categoryId = getCategoryIdFromPath(category.to)
  const currentCategoryId = new URLSearchParams(location.search).get('categoryId')

  if (currentCategoryId) {
    return categoryId === currentCategoryId
  }

  if (location.pathname === '/shop') {
    return category.label === fallbackLabel
  }

  return false
}

function getCategoryNavLinkClass(isActive) {
  return `${categoryNavLinkBase} ${
    isActive
      ? 'font-semibold text-ink shadow-[inset_0_-2px_0_0_var(--color-brand)]'
      : 'text-muted'
  }`
}

function GlobalHeader({
  activeCategory = '건강',
  categories,
  searchPlaceholder = '상품을 검색해 보세요',
  onSearchSubmit,
}) {
  const location = useLocation()
  const { pathname, search } = location
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [apiCategories, setApiCategories] = useState(DEFAULT_CATEGORIES)
  const headerCategories = useMemo(() => categories ?? apiCategories, [apiCategories, categories])
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (categories) {
      return undefined
    }

    let isMounted = true

    async function loadCategories() {
      try {
        const categoryResponse = await fetchCategories()
        const nextCategories = Array.isArray(categoryResponse)
          ? categoryResponse
              .filter((category) => category?.name && category?.id != null)
              .map((category) => ({
                label: category.name,
                to: `/shop?categoryId=${encodeURIComponent(category.id)}`,
              }))
          : []

        if (isMounted && nextCategories.length > 0) {
          setApiCategories(nextCategories)
        }
      } catch {
        if (isMounted) {
          setApiCategories(DEFAULT_CATEGORIES)
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [categories])

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const searchValue = formData.get('search')?.toString().trim() ?? ''

    if (onSearchSubmit) {
      onSearchSubmit(searchValue)
      return
    }

    if (searchValue) {
      const nextSearchParams = new URLSearchParams()
      const categoryId = new URLSearchParams(search).get('categoryId')

      if (categoryId) {
        nextSearchParams.set('categoryId', categoryId)
      }

      nextSearchParams.set('query', searchValue)
      nextSearchParams.set('sort', 'weight')
      nextSearchParams.set('page', '0')
      navigate(`/shop?${nextSearchParams.toString()}`)
    }
  }

  const handleSearchFocus = () => {
    if (pathname !== '/shop') {
      navigate('/shop')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="relative z-40 border-b border-border-soft bg-surface">
      <div className="layout-container-header flex min-h-20 min-w-0 items-center gap-7 max-lg:flex-wrap max-lg:gap-x-6 max-lg:gap-y-3 max-lg:py-4">
        <Link
          className={`inline-flex shrink-0 items-center rounded-md ${focusRingClass}`}
          to="/home"
          aria-label="메인으로 가기"
        >
          <img className="h-8 w-auto object-contain" src={dtoLogo} aria-hidden="true" alt=""/>
        </Link>

        <nav className="min-w-0 shrink-0 overflow-x-auto py-1" aria-label="상품 카테고리">
          <ul className="flex items-center gap-8 whitespace-nowrap px-0.5 max-sm:gap-5">
            {headerCategories.map((category) => {
              const isTabActive = isCategoryNavActive(category, location, activeCategory)

              return (
                <li key={category.label}>
                  <NavLink
                    className={getCategoryNavLinkClass(isTabActive)}
                    isActive={() => isTabActive}
                    to={category.to}
                  >
                    {category.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <form
          className="ml-auto w-full min-w-64 max-w-copy max-lg:order-last max-lg:max-w-none max-sm:min-w-0"
          role="search"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="global-header-search">
            상품 검색
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <input
              id="global-header-search"
              className="h-9 w-full rounded-sm border border-transparent bg-surface-muted pr-4 pl-12 text-sm font-medium text-ink outline-none placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-3 focus:ring-brand/15"
              name="search"
              type="search"
              placeholder={searchPlaceholder}
              onFocus={handleSearchFocus}
              onClick={handleSearchFocus}
            />
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-6 text-ink max-sm:gap-4" aria-label="사용자 메뉴">
          <Link
            className={`inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-muted ${focusRingClass}`}
            to="/wishlist"
            aria-label="찜 목록"
          >
            <Heart className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <Link
            className={`inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-muted ${focusRingClass}`}
            to="/cart"
            aria-label="장바구니"
          >
            <ShoppingCart className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <div className="relative">
            <button
              className={`inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-muted ${focusRingClass}`}
              type="button"
              aria-label="유저 메뉴"
              aria-controls="global-header-user-menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsUserMenuOpen((current) => !current)}
            >
              <User className="size-5" strokeWidth={2.4} aria-hidden="true" />
            </button>

            {isUserMenuOpen && (
              <div
                id="global-header-user-menu"
                className="absolute top-full right-0 z-50 mt-3 w-60 rounded-md border border-border-soft bg-surface py-2 text-left text-ink shadow-card-hover"
                role="menu"
                aria-label="유저 메뉴"
              >
                <div className="border-b border-border-soft px-4 py-3">
                  <p className="m-0 text-caption font-bold tracking-wide text-muted uppercase">이메일</p>
                  <p className="m-0 mt-1 truncate text-body-sm font-semibold text-ink">
                    employee@d-to.example
                  </p>
                </div>
                <div className="py-1">
                  <button
                    className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted"
                    type="button"
                    role="menuitem"
                  >
                    프로필
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted"
                    type="button"
                    role="menuitem"
                  >
                    설정
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm font-bold text-danger hover:bg-danger-soft"
                    onClick={handleLogout}
                    type="button"
                    role="menuitem"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default GlobalHeader
