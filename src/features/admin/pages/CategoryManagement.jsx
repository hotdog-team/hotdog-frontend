import { useState, useEffect } from 'react'
import { Layers, Plus, Trash2, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCategoryPayload, setNewCategoryPayload] = useState({ name: '', status: 'ACTIVE' })

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories')
      const data = response.data
      setCategories(Array.isArray(data) ? data : (data?.content ? data.content : []))
    } catch (err) {
      toast.error('카테고리 목록을 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryPayload.name.trim()) return

    try {
      await axiosInstance.post('/api/admin/categories', newCategoryPayload)
      toast.success('카테고리가 생성되었습니다.')
      setIsAddModalOpen(false)
      setNewCategoryPayload({ name: '', status: 'ACTIVE' })
      fetchCategories()
    } catch (err) {
      toast.error('카테고리 생성에 실패했습니다.')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('카테고리를 삭제하시겠습니까? 연결된 데이터가 있을 수 있습니다.')) return

    try {
      await axiosInstance.delete(`/api/categories/${id}`)
      toast.success('카테고리가 삭제되었습니다.')
      fetchCategories()
    } catch (err) {
      toast.error('카테고리 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <Layers className="text-blue-500" size={28} /> 카테고리 관리
          </h1>
          <p className="mt-2 text-muted">플랫폼의 5대 테마 및 하위 분류를 설정합니다.</p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} /> 카테고리 등록
        </Button>
      </div>

      <div className="bg-surface border border-border-soft rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-muted border-b border-border-soft text-muted">
            <tr>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold">카테고리명</th>
              <th className="p-4 font-semibold text-right w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {categories.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-muted">등록된 카테고리가 없습니다.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4 text-muted">#{cat.id}</td>
                  <td className="p-4 font-bold text-ink">{cat.name}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors" title="삭제">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-sm border border-border-soft">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-ink">새 카테고리 추가</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1">카테고리명</label>
                <input type="text" required value={newCategoryPayload.name} onChange={(e) => setNewCategoryPayload({...newCategoryPayload, name: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" placeholder="예: 건강" autoFocus />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">등록</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}