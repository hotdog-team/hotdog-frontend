import { Outlet } from 'react-router-dom'
import MyPageSidebar from '../components/mypage/MyPageSidebar.jsx'

export default function MyPageLayout() {
  return (
    <div className="layout-container-header mypage-layout bg-page pt-16 pb-20 text-ink">
      <div className="a11y-grid-sidebar grid grid-cols-sidebar gap-12 max-lg:grid-cols-1">
        <MyPageSidebar />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
