import { useState } from 'react'
import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import dtoLogo from '../../assets/d-to-logo.png'

const DEFAULT_CATEGORIES = [
  { label: '건강', to: '/shop?category=health' },
  { label: '교육', to: '/shop?category=education' },
  { label: '여행', to: '/shop?category=travel' },
  { label: '선물', to: '/shop?category=gift' },
  { label: '가전', to: '/shop?category=appliance' },
]

function GlobalHeader({
  activeCategory = '건강',
  categories = DEFAULT_CATEGORIES,
  searchPlaceholder = '상품을 검색해 보세요',
  onSearchSubmit,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!onSearchSubmit) {
      return
    }

    const formData = new FormData(event.currentTarget)
    onSearchSubmit(formData.get('search')?.toString().trim() ?? '')
  }

  return (
    <header className="border-b border-[#e1e7f0] bg-white">
      <div className="mx-auto flex min-h-[79px] w-full max-w-[1250px] items-center gap-7 px-6 max-lg:max-w-none max-lg:flex-wrap max-lg:gap-x-6 max-lg:gap-y-3 max-lg:py-4 max-sm:px-4">
        <Link className="inline-flex shrink-0 items-center" to="/" aria-label="D-TO 홈">
          <img className="h-[31px] w-auto object-contain" src={dtoLogo} alt="D-TO" />
        </Link>

        <nav className="min-w-0 shrink-0 overflow-x-auto" aria-label="상품 카테고리">
          <ul className="flex items-center gap-8 whitespace-nowrap max-sm:gap-5">
            {categories.map((category) => {
              const isActive = category.label === activeCategory

              return (
                <li key={category.label}>
                  <NavLink
                    className={`relative inline-flex h-[55px] items-center text-[15px] font-medium transition-colors hover:text-[#071431] max-lg:h-9 ${
                      isActive ? 'text-[#071431]' : 'text-[#657186]'
                    }`}
                    to={category.to}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {category.label}
                    {isActive && (
                      <span className="absolute right-0 bottom-2 left-0 h-0.5 rounded-full bg-[#071431] max-lg:bottom-0" aria-hidden="true" />
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <form className="ml-auto w-full max-w-[394px] min-w-[260px] max-lg:order-last max-lg:max-w-none max-sm:min-w-0" role="search" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="global-header-search">
            상품 검색
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#7f94b2]" strokeWidth={2.25} aria-hidden="true" />
            <input
              id="global-header-search"
              className="h-[36px] w-full rounded-[3px] border border-transparent bg-[#f1f5fa] pr-4 pl-12 text-sm font-medium text-[#071431] outline-none placeholder:text-[#6f8199] focus:border-[#ff4b11] focus:bg-white focus:ring-3 focus:ring-[#ff4b11]/15"
              name="search"
              type="search"
              placeholder={searchPlaceholder}
            />
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-6 text-[#071431] max-sm:gap-4" aria-label="사용자 메뉴">
          <Link className="inline-flex size-8 items-center justify-center rounded-full hover:bg-[#f1f5fa]" to="/wishlist" aria-label="찜 목록">
            <Heart className="size-[21px]" strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <Link className="inline-flex size-8 items-center justify-center rounded-full hover:bg-[#f1f5fa]" to="/cart" aria-label="장바구니">
            <ShoppingCart className="size-[21px]" strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <div className="relative">
            <button
              className="inline-flex size-8 items-center justify-center rounded-full hover:bg-[#f1f5fa]"
              type="button"
              aria-label="유저 메뉴"
              aria-controls="global-header-user-menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsUserMenuOpen((current) => !current)}
            >
              <User className="size-[21px]" strokeWidth={2.4} aria-hidden="true" />
            </button>

            {isUserMenuOpen && (
              <div
                id="global-header-user-menu"
                className="absolute top-[calc(100%+10px)] right-0 z-50 w-[240px] rounded-md border border-[#dfe6ef] bg-white py-2 text-left text-[#071431] shadow-[0_12px_28px_rgba(7,20,49,0.14)]"
                role="menu"
                aria-label="유저 메뉴"
              >
                <div className="border-b border-[#edf1f5] px-4 py-3">
                  <p className="m-0 text-[11px] font-bold tracking-[0.08em] text-[#7b8798] uppercase">이메일</p>
                  <p className="m-0 mt-1 truncate text-[13px] font-semibold text-[#071431]">employee@d-to.example</p>
                </div>
                <div className="py-1">
                  <button className="block w-full px-4 py-2.5 text-left text-[14px] font-medium hover:bg-[#f1f5fa]" type="button" role="menuitem">
                    프로필
                  </button>
                  <button className="block w-full px-4 py-2.5 text-left text-[14px] font-medium hover:bg-[#f1f5fa]" type="button" role="menuitem">
                    설정
                  </button>
                  <button className="block w-full px-4 py-2.5 text-left text-[14px] font-bold text-[#bc210e] hover:bg-[#fff2ee]" type="button" role="menuitem">
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
