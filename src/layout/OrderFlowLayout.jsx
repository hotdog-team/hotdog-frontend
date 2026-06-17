import { Outlet } from 'react-router-dom'

export default function OrderFlowLayout() {
    return (
        <div className="min-h-full w-full bg-surface-muted">
            <Outlet />
        </div>
    )
}
