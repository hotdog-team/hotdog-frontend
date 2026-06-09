import { useState, useEffect } from 'react'
import { ShieldCheck, Ban, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import axiosInstance from '../../../api/axiosInstance.js'

export default function MemberManagement() {
  const [members, setMembers] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/members?page=0&size=20')
        const payload = response.data.data || response.data;
        setMembers(Array.isArray(payload) ? payload : (payload?.content ? payload.content : []))
        setTotalCount(payload?.totalElements || payload?.length || 0)
      } catch (err) {
        toast.error('회원 목록을 불러오는 데 실패했습니다.')
      }
    }
  useEffect(() => {
    fetchMembers()
  }, [])

  const handleUpdateStatus = async (id, currentRole, newStatus) => {
    const actionText = newStatus === 'SUSPENDED' ? '정지' : '활성'
    if (!window.confirm(`해당 회원을 ${actionText} 처리하시겠습니까?`)) return

    try {
      await axiosInstance.patch(`/api/admin/members/${id}`, {
        role: currentRole,
        status: newStatus
      })
      toast.success(`회원이 ${actionText} 처리되었습니다.`)
      fetchMembers()
    } catch (err) {
      toast.error('상태 변경에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <ShieldCheck className="text-orange-500" size={28} /> 회원 및 판매자 관리
          </h1>
          <p className="mt-2 text-muted">가입된 회원 목록을 조회하고 권한 및 상태(ACTIVE, SUSPENDED)를 관리합니다.</p>
        </div>
        <p className="text-sm font-bold text-brand">조회된 회원: {totalCount}명</p>
      </div>

      <div className="bg-surface border border-border-soft rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-muted border-b border-border-soft text-muted">
            <tr>
              <th className="p-4 font-semibold">이름</th>
              <th className="p-4 font-semibold">이메일</th>
              <th className="p-4 font-semibold">권한</th>
              <th className="p-4 font-semibold">상태</th>
              <th className="p-4 font-semibold text-right">제재 액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {members.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-muted">가입된 회원이 없습니다.</td></tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4 font-medium text-ink">{member.name}</td>
                  <td className="p-4 text-muted">{member.email}</td>
                  <td className="p-4">
                    <span className="bg-surface-muted px-2 py-1 rounded-sm text-xs font-bold text-ink">{member.role || 'ROLE_USER'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-sm text-xs font-bold ${member.status === 'ACTIVE' ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>
                      {member.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {member.status === 'ACTIVE' ? (
                      <button onClick={() => handleUpdateStatus(member.id, member.role, 'SUSPENDED')} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors" title="이용 정지">
                        <Ban size={18} />
                      </button>
                    ) : (
                      <button onClick={() => handleUpdateStatus(member.id, member.role, 'ACTIVE')} className="text-success hover:bg-success/10 p-2 rounded-md transition-colors" title="정지 해제">
                        <CheckCircle size={18} />
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