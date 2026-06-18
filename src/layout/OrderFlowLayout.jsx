import { Outlet } from 'react-router-dom'

export default function OrderFlowLayout() {
    return (
        <div className="flex flex-1 flex-col w-full bg-surface-muted">
            <Outlet />
        </div>
    )
}
