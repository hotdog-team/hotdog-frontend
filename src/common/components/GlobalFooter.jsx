import { Link } from 'react-router-dom'

const DEFAULT_LINKS = [
  { label: '이용약관', to: '/terms' },
  { label: '개인정보처리방침', to: '/privacy' },
  { label: '고객 지원', to: '/support' },
]

function GlobalFooter({
  copyright = '© 2026 D-TO EMPLOYEE EXCLUSIVE STORE. CORPORATE WELLNESS & EDUCATION PARTNERS.',
  links = DEFAULT_LINKS,
}) {
  return (
    <footer className="border-t border-[#e1e7f0] bg-[#f6f7f9]">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1110px] items-center justify-between gap-8 px-6 py-5 max-md:flex-col max-md:items-start max-md:gap-4 max-sm:px-4">
        <p className="m-0 text-[11px] leading-5 font-extrabold tracking-[0.04em] text-[#071431] uppercase">{copyright}</p>

        <nav className="flex shrink-0 items-center gap-9 whitespace-nowrap text-[11px] font-medium text-[#9aa9bf] max-sm:flex-wrap max-sm:gap-x-5 max-sm:gap-y-2" aria-label="푸터 링크">
          {links.map((link) => (
            <Link className="hover:text-[#071431]" key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default GlobalFooter
