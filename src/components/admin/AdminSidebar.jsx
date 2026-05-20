import { NavLink, useLocation } from 'react-router-dom'
import { getAdminSectionByPath } from './adminNav.js'

export default function AdminSidebar() {
  const { pathname } = useLocation()
  const section = getAdminSectionByPath(pathname)
  const items = section?.sidebar

  if (!items?.length) {
    return null
  }

  return (
    <aside className="h-fit rounded-md border border-border bg-surface p-7" aria-label={`${section.label} 하위 메뉴`}>
      <h2 className="mb-8 text-body-lg font-medium">{section.label}</h2>
      <nav className="flex flex-col divide-y divide-border-soft">
        {items.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex w-full px-4 py-3.5 text-left text-body transition-colors ${
                isActive ? 'bg-surface-muted font-semibold text-ink' : 'text-body hover:bg-surface-muted'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
