import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const linkClass = 'hover:text-ink transition-colors'

export default function ShopBreadcrumb({ items }) {
  return (
    <nav aria-label="현재 위치">
      <ol className="shop-breadcrumb flex list-none items-center gap-1 p-0 m-0 text-body-sm text-muted">
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <li aria-hidden="true">
                <ChevronRight className="size-3.5 shrink-0 text-border" strokeWidth={2} />
              </li>
            )}
            <li
              className={item.isCurrent ? (item.className ?? 'truncate text-ink font-medium') : undefined}
              aria-current={item.isCurrent ? 'page' : undefined}
            >
              {item.to ? (
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
