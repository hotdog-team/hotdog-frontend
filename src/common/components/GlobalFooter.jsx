import { Link } from 'react-router-dom'

const DEFAULT_LINKS = [
  { label: '이용약관', to: '/terms' },
  { label: '개인정보처리방침', to: '/privacy' },
  { label: '고객지원', to: '/support' },
]

function GlobalFooter({
  copyright = '© 2026 D-TO EMPLOYEE EXCLUSIVE STORE. CORPORATE WELLNESS & EDUCATION PARTNERS.',
  links = DEFAULT_LINKS,
}) {
  return (
    <footer className="border-t border-gray-300 bg-gray-100">
      <div className="layout-container-header flex min-h-17 items-center justify-between gap-8 py-5 max-md:flex-col max-md:items-start max-md:gap-4">
        <p className="m-0 text-xs leading-5 tracking-tight text-gray-500 uppercase font-medium">{copyright}</p>

        <nav className="flex shrink-0 items-center gap-9 whitespace-nowrap text-xs font-medium text-gray-400 max-sm:flex-wrap max-sm:gap-x-5 max-sm:gap-y-2" aria-label="푸터 링크">
          {links.map((link) => (
            <Link className="hover:text-brand" key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default GlobalFooter;
