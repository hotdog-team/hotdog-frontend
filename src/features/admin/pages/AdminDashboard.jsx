import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Users, ShoppingBag, MessageSquareWarning, CircleDollarSign, Tags, Layers, ShieldCheck, Gavel, ArrowRight } from 'lucide-react'
import axiosInstance from '../../../api/axiosInstance.js'

function StatCard({ icon, title, value, colorClass }) {
  return (
    <div className="flex items-start gap-4 rounded-md border border-border-soft bg-surface p-6 shadow-sm">
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-caption font-bold tracking-label text-muted uppercase">{title}</h3>
        <p className="mt-1 text-3xl font-medium text-ink">{value}</p>
      </div>
    </div>
  )
}

function ActionCard({ to, icon, title, description, colorClass, hoverClass }) {
  return (
    <Link
      to={to}
      className={`group flex flex-col items-start gap-4 rounded-md border border-border-soft bg-surface p-6 text-left transition-all hover:shadow-md ${hoverClass}`}
    >
      <div className={`rounded-lg p-3 transition-colors ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-body font-bold text-ink group-hover:text-brand transition-colors">{title}</h4>
        <p className="mt-1 text-caption text-muted">{description}</p>
      </div>
      <div className="mt-2 flex items-center text-caption font-bold text-brand opacity-0 transition-opacity group-hover:opacity-100">
        바로가기 <ArrowRight size={16} className="ml-1" />
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalMembers: 0, todayOrders: 0, pendingInquiries: 0, totalRevenue: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/dashboard/stats')
        setStats(response.data)
      } catch (err) {
        toast.error('통계 데이터를 불러오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <div className="layout-container py-20 text-center">
        <p className="text-body font-bold text-muted">데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* 1. 헤더 영역 */}
      <div className="flex gap-5 justify-between items-end border-b border-border-soft pb-6">
        <div>
          <p className="mb-1 text-caption font-bold tracking-label text-brand">운영 총괄</p>
          <h1 className="text-3xl leading-tight font-medium text-ink">플랫폼 대시보드</h1>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-medium text-ink">실시간 운영 지표</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CircleDollarSign size={24} strokeWidth={2.5} />}
            title="플랫폼 총 거래액"
            value={`${stats.totalRevenue?.toLocaleString() || 0}원`}
            colorClass="bg-green-500/10 text-green-600"
          />
          <StatCard
            icon={<Users size={24} strokeWidth={2.5} />}
            title="총 가입 회원"
            value={`${stats.totalMembers?.toLocaleString() || 0}명`}
            colorClass="bg-brand/10 text-brand"
          />
          <StatCard
            icon={<ShoppingBag size={24} strokeWidth={2.5} />}
            title="오늘의 전체 주문"
            value={`${stats.todayOrders?.toLocaleString() || 0}건`}
            colorClass="bg-blue-500/10 text-blue-500"
          />
          <StatCard
            icon={<MessageSquareWarning size={24} strokeWidth={2.5} />}
            title="미답변 문의"
            value={`${stats.pendingInquiries?.toLocaleString() || 0}건`}
            colorClass="bg-error/10 text-error"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-ink">관리자 주요 업무</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            to="/admin/meta-tags"
            icon={<Tags size={24} />}
            title="메타태그 관리"
            description="상품 추천 및 검색용 태그 등록"
            colorClass="bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white"
            hoverClass="hover:border-brand"
          />

          <ActionCard
            to="/admin/categories"
            icon={<Layers size={24} />}
            title="카테고리 관리"
            description="5대 테마 및 하위 분류 설정"
            colorClass="bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
            hoverClass="hover:border-blue-500"
          />

          <ActionCard
            to="/admin/members"
            icon={<ShieldCheck size={24} />}
            title="회원 및 판매자 관리"
            description="이용 정지, 탈퇴 및 권한 처리"
            colorClass="bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"
            hoverClass="hover:border-orange-500"
          />

          <ActionCard
            to="/admin/moderation"
            icon={<Gavel size={24} />}
            title="콘텐츠 모니터링"
            description="부적절 상품 및 악성 리뷰 관리"
            colorClass="bg-error/10 text-error group-hover:bg-error group-hover:text-white"
            hoverClass="hover:border-error"
          />
        </div>
      </section>
    </div>
  )
}