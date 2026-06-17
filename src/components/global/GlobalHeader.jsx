import { useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { fetchCategories } from '../../api/categoryApi.js'
import dtoLogo from '../../assets/d-to-logo.png'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useAccessibility } from '../../context/AccessibilityContext.jsx'
import SearchSuggestionPanel from '../search/SearchSuggestionPanel.jsx'
import InputClearButton from '../ui/InputClearButton.jsx'
import QuantitySelector from '../../features/shop/components/QuantitySelector.jsx'
import { useSearchNavigation } from '../../hooks/useSearchNavigation.js'
import { formControlUnderlineClass } from '../ui/formControlFocus.js'

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
  'focus-ring focus-ring-inset inline-flex items-center px-1 pt-2 pb-1 text-base transition-[color,box-shadow] hover:text-ink hover:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink'

function getCategoryIdFromPath(path) {
  const queryString = path.includes('?') ? path.slice(path.indexOf('?')) : ''
  return new URLSearchParams(queryString).get('categoryId')
}

function isCategoryNavActive(category, location) {
  const searchParams = new URLSearchParams(location.search)
  const categoryId = getCategoryIdFromPath(category.to)
  const currentCategoryId = searchParams.get('categoryId')

  if (currentCategoryId) {
    return String(categoryId) === String(currentCategoryId)
  }

  if (location.pathname === '/shop') {
    const hasMetaTags = searchParams.getAll('metaTagIds').length > 0
    const hasQuery = Boolean(searchParams.get('query')?.trim())
    if (hasMetaTags || hasQuery) {
      return false
    }
  }

  return false
}

function getCategoryNavLinkClass(isActive) {
  return `${categoryNavLinkBase} ${
    isActive
      ? 'font-bold text-ink shadow-[inset_0_-2px_0_0_var(--color-brand)]'
      : 'font-medium text-muted'
  }`
}

const SEARCH_PANEL_ID = 'global-header-search-panel'

function GlobalHeader({
  categories,
  searchPlaceholder = '상품 검색',
  onSearchSubmit,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchContainerRef = useRef(null)
  const [apiCategories, setApiCategories] = useState(DEFAULT_CATEGORIES)
  const headerCategories = useMemo(() => categories ?? apiCategories, [apiCategories, categories])
  const { settings, setSettings, save } = useAccessibility();
  const { executeSearch, logAndSaveSearch, userId } = useSearchNavigation()

  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

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

  useEffect(() => {
    setIsUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isSearchPanelOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (searchContainerRef.current?.contains(event.target)) {
        return
      }
      setIsSearchPanelOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchPanelOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchPanelOpen])

  const submitSearch = async () => {
    const nextSearchValue = searchValue.trim()

    if (!nextSearchValue) {
      window.alert('검색어를 입력해 주세요.')
      return
    }

    if (onSearchSubmit) {
      onSearchSubmit(nextSearchValue)
      setIsSearchPanelOpen(false)
      return
    }

    setIsSearchPanelOpen(false)
    await executeSearch(nextSearchValue)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await submitSearch()
  }

  const handleSearchFocus = () => {
    if (!searchValue.trim()) {
      setIsSearchPanelOpen(true)
    }
  }

  const handleSearchChange = (event) => {
    const nextValue = event.target.value
    setSearchValue(nextValue)
    setIsSearchPanelOpen(!nextValue.trim())
  }

  const handleLogout = () => {
    logout()
    navigate('/home', { replace: true })
  }

  const handleFontSizeDecrease = () => {
    if (settings.fontSizeStep <= 1) return
    const next = { ...settings, fontSizeStep: settings.fontSizeStep - 1 }
    setSettings(next)
    save(next).catch(() => {})
  }

  const handleFontSizeIncrease = () => {
    if (settings.fontSizeStep >= 5) return
    const next = { ...settings, fontSizeStep: settings.fontSizeStep + 1 }
    setSettings(next)
    save(next).catch(() => {})
  }

  return (
    <header className="relative z-40 border-b border-border-soft bg-surface">
      <div className="layout-container-header flex min-h-20 min-w-0 items-center gap-7 max-lg:flex-wrap max-lg:gap-x-6 max-lg:gap-y-3 max-lg:py-4">
        <Link
          className={`inline-flex shrink-0 items-center rounded-md ${focusRingClass}`}
          to="/home"
          aria-label="메인으로 가기"
        >
          <img className="h-8.5 w-auto object-contain" src={dtoLogo} aria-hidden="true" alt=""/>
        </Link>

        <nav className="min-w-0 shrink-0 overflow-x-auto py-1" aria-label="상품 카테고리">
          <ul className="flex items-center gap-8 whitespace-nowrap px-0.5 max-sm:gap-5">
            {headerCategories.map((category) => {
              const isTabActive = isCategoryNavActive(category, location)

              return (
                <li key={category.label}>
                  <NavLink
                    className={getCategoryNavLinkClass(isTabActive)}
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
          <div ref={searchContainerRef} className="group relative">
            <input
              id="global-header-search"
              className={`h-9 w-full py-0 pl-1 text-sm font-medium text-ink placeholder:text-muted ${searchValue.trim() ? 'pr-18' : 'pr-11'} ${formControlUnderlineClass}`}
              name="search"
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue}
              role="combobox"
              aria-expanded={isSearchPanelOpen}
              aria-controls={SEARCH_PANEL_ID}
              aria-autocomplete="list"
              autoComplete="off"
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onClick={handleSearchFocus}
            />
            {searchValue.trim() ? (
              <InputClearButton
                className="absolute top-1/2 right-10 -translate-y-1/2"
                label="검색어 지우기"
                onClick={() => {
                  setSearchValue('')
                  setIsSearchPanelOpen(true)
                }}
              />
            ) : null}
            <button
              type="submit"
              className={`absolute top-1/2 right-1 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-muted group-focus-within:text-brand hover:bg-surface-muted hover:text-brand ${focusRingClass}`}
              aria-label="검색"
            >
              <Search className="size-5" strokeWidth={2.75} aria-hidden="true" />
            </button>
            {isSearchPanelOpen && !searchValue.trim() && (
              <SearchSuggestionPanel
                id={SEARCH_PANEL_ID}
                userId={userId}
                onKeywordNavigate={logAndSaveSearch}
                onClose={() => setIsSearchPanelOpen(false)}
              />
            )}
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-6 text-ink max-sm:gap-4" aria-label="사용자 메뉴">
          {isAuthenticated ? (
            <>
              <Link
                className={`inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-muted ${focusRingClass}`}
                to="/mypage/bookmarks"
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
                      <p className="m-0 text-caption font-bold text-muted">이메일</p>
                      <p className="m-0 mt-1 truncate text-body-sm font-semibold text-ink">
                        {user?.email || '이메일 정보 없음'}
                      </p>
                    </div>
                    <div className="border-b border-border-soft px-4 py-3">
                      <p className="m-0 text-caption font-bold text-muted">글자 크기 조절</p>
                      <QuantitySelector
                        className="mt-2"
                        quantity={settings.fontSizeStep > 0 ? settings.fontSizeStep : 1}
                        min={1}
                        max={5}
                        ariaLabel="글자 크기 조절"
                        valueLabel="글자 크기"
                        onDecrease={handleFontSizeDecrease}
                        onIncrease={handleFontSizeIncrease}
                      />
                    </div>
                    <div className="py-1">
                      <Link
                        to="/mypage/profile"
                        className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        내 프로필
                      </Link>
                      <Link
                        to="/mypage/orders"
                        className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}                        
                      >
                        내 주문/배송 내역
                      </Link>
                      <Link
                          to="/mypage/settings"
                          className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                      >
                        개인 화면 설정
                      </Link>
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
            </>
          ) : (
            <Link
              to="/login"
              className={`rounded-sm px-3 py-1.5 text-sm font-bold text-ink hover:bg-surface-muted ${focusRingClass}`}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default GlobalHeader