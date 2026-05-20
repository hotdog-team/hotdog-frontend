import { Outlet } from 'react-router-dom'
import MyPageSidebar from '../components/mypage/MyPageSidebar.jsx'

export default function MyPageLayout() {
  return (
    <div className="layout-container-header bg-page pt-24 pb-28 text-ink">
      <div className="a11y-grid-sidebar grid grid-cols-sidebar gap-10 max-lg:grid-cols-1">
        <MyPageSidebar />
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
