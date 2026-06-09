import { useState, useEffect } from 'react'
import { Package, Search, Truck, XCircle, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders?page=0&size=20')

      if (typeof response.data === 'string' && response.data.includes('<html')) {
        throw new Error('인증 실패: 관리자 권한이 필요합니다.')
      }

      const payload = response.data.data || response.data
      setOrders(Array.isArray(payload) ? payload : (payload?.content || []))
      setTotalCount(payload?.totalElements || payload?.length || 0)
    } catch (err) {
      toast.error(err.message || '주문 목록을 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('이 주문을 취소 처리하시겠습니까?')) return

    try {
      await axiosInstance.post(`/api/orders/${orderId}/cancel`, { reason: '관리자 직권 취소' })
      toast.success('주문이 취소되었습니다.')
      fetchOrders()
    } catch (err) {
      toast.error('주문 취소 처리에 실패했습니다.')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="text-orange-500 bg-orange-500/10 px-2 py-1 rounded-sm text-xs font-bold">결제대기</span>
      case 'PAID': return <span className="text-blue-500 bg-blue-500/10 px-2 py-1 rounded-sm text-xs font-bold">결제완료</span>
      case 'SHIPPING': return <span className="text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-sm text-xs font-bold">배송중</span>
      case 'DELIVERED': return <span className="text-success bg-success/10 px-2 py-1 rounded-sm text-xs font-bold">배송완료</span>
      case 'CANCELLED': return <span className="text-error bg-error/10 px-2 py-1 rounded-sm text-xs font-bold">취소됨</span>
      default: return <span className="text-muted bg-surface-muted px-2 py-1 rounded-sm text-xs font-bold">{status || '상태없음'}</span>
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <Package className="text-brand" size={28} /> 주문 및 배송 관리
          </h1>
          <p className="mt-2 text-muted">전체 주문 내역을 확인하고 배송 상태 및 취소를 관리합니다.</p>
        </div>
        <p className="text-sm font-bold text-brand">전체 주문: {totalCount}건</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input type="text" placeholder="주문번호 또는 수령인 검색" className="w-full pl-10 p-3 border border-border-soft rounded-md focus:border-brand outline-none" />
        </div>
        <Button variant="secondary" size="md">검색</Button>
      </div>

      <div className="bg-surface border border-border-soft rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-muted border-b border-border-soft text-muted">
            <tr>
              <th className="p-4 font-semibold w-24">주문번호</th>
              <th className="p-4 font-semibold">주문명 (요약)</th>
              <th className="p-4 font-semibold">수령인</th>
              <th className="p-4 font-semibold">총 결제금액</th>
              <th className="p-4 font-semibold">상태</th>
              <th className="p-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-muted">조회된 주문 내역이 없습니다.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4 text-muted">#{order.id}</td>
                  <td className="p-4 font-bold text-ink truncate max-w-[200px]">{order.orderName || '상품 외 N건'}</td>
                  <td className="p-4 text-muted">{order.receiverName || '이름없음'}</td>
                  <td className="p-4 font-bold text-ink">{order.totalAmount?.toLocaleString()}원</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 text-right">
                    {order.status !== 'CANCELLED' && (
                      <button onClick={() => handleCancelOrder(order.id)} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors" title="주문 취소">
                        <XCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}