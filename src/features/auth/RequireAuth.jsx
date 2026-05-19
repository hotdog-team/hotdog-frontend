import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

function RequireAuth() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />
    }

    return <Outlet />
}
export default RequireAuth;