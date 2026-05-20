import { useLocation } from 'react-router-dom'
import { adminNavLabelsByPath } from '../../../components/admin/adminNav.js'

export default function AdminPlaceholderPage() {
  const { pathname } = useLocation()
  const title = adminNavLabelsByPath[pathname] ?? '관리자'

  return (
    <>
      <h1 className="text-3xl font-medium">{title}</h1>
      <p className="mt-4 text-body-lg text-body">페이지 준비 중입니다.</p>
    </>
  )
}
