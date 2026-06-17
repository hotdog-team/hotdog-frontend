import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance.js'
import { useAuthStore } from '../../store/useAuthStore.js'

const ADMIN_ROLE = 'ROLE_ADMIN'

export default function RequireAdmin() {
  const setUser = useAuthStore((state) => state.setUser)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    const verifyAdmin = async () => {
      try {
        const { data } = await axiosInstance.get('/api/members/me')
        if (cancelled) return

        const currentUser = useAuthStore.getState().user ?? {}
        const nextUser = {
          email: data.email ?? currentUser.email,
          name: data.name ?? currentUser.name,
          role: data.role ?? currentUser.role,
        }
        setUser(nextUser)

        setStatus(nextUser.role === ADMIN_ROLE ? 'allowed' : 'denied')
      } catch {
        if (!cancelled) setStatus('denied')
      }
    }

    verifyAdmin()

    return () => {
      cancelled = true
    }
  }, [setUser])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page text-body text-muted" role="status">
        관리자 권한을 확인하는 중입니다…
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
