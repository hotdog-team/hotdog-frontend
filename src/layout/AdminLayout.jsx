import { Outlet, useLocation } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import { getAdminSectionByPath } from '../components/admin/adminNav.js'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const hasSidebar = Boolean(getAdminSectionByPath(pathname)?.sidebar?.length)

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-page text-foreground">
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>
      <AdminHeader />
      <main id="main-content" className="flex-1">
        <div className="layout-container-header bg-page pt-10 pb-28 text-ink">
          <div
            className={
              hasSidebar
                ? 'a11y-grid-sidebar grid grid-cols-sidebar gap-10 max-lg:grid-cols-1'
                : 'min-w-0'
            }
          >
            <AdminSidebar />
            <section className="min-w-0">
              <Outlet />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
