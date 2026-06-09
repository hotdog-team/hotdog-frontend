import { useState, useEffect } from 'react'
import { Tags, Plus, Trash2, Edit2, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function MetaTagManagement() {
  const [tags, setTags] = useState([])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newTagPayload, setNewTagPayload] = useState({ name: '', type: 'CATEGORY', status: 'ACTIVE' })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState({ id: null, name: '', type: 'CATEGORY', status: 'ACTIVE' })

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/api/tags')
      const data = response.data
      setTags(Array.isArray(data) ? data : (data.content || []))
    } catch (err) {
      toast.error('메타태그 목록을 불러오는 데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  // 등록
  const handleAddTag = async (e) => {
    e.preventDefault()
    if (!newTagPayload.name.trim()) return

    try {
      await axiosInstance.post('/api/admin/tags', newTagPayload)
      toast.success('태그가 성공적으로 등록되었습니다.')
      setIsAddModalOpen(false)
      setNewTagPayload({ name: '', type: 'CATEGORY', status: 'ACTIVE' })
      fetchTags()
    } catch (err) {
      toast.error('태그 등록에 실패했습니다. (DB 시퀀스 확인 필요)')
    }
  }

  // 수정
  const handleUpdateTag = async (e) => {
    e.preventDefault()
    if (!editingTag.name.trim()) return

    try {
      await axiosInstance.patch(`/api/admin/tags/${editingTag.id}`, {
        name: editingTag.name,
        type: editingTag.type
      })
      toast.success('태그가 성공적으로 수정되었습니다.')
      setIsEditModalOpen(false)
      fetchTags()
    } catch (err) {
      toast.error('태그 수정에 실패했습니다.')
    }
  }

  // 삭제
  const handleDeleteTag = async (id) => {
    if (!window.confirm('정말 이 태그를 삭제하시겠습니까?')) return

    try {
      await axiosInstance.delete(`/api/admin/tags/${id}`)
      toast.success('태그가 삭제되었습니다.')
      fetchTags()
    } catch (err) {
      toast.error('태그 삭제에 실패했습니다.')
    }
  }

  const TagTypeOptions = () => (
    <>
      <option value="CATEGORY">카테고리 (CATEGORY)</option>
      <option value="PURPOSE">목적/용도 (PURPOSE)</option>
      <option value="MERCHANDISING">MD추천 (MERCHANDISING)</option>
      <option value="POPULARITY">인기도 (POPULARITY)</option>
      <option value="AGE_PREFERENCE">연령대 (AGE_PREFERENCE)</option>
      <option value="OCCUPATION">직업군 (OCCUPATION)</option>
      <option value="RELEASE_OR_UPDATE">출시/업데이트 (RELEASE_OR_UPDATE)</option>
      <option value="SEASONAL">시즌성 (SEASONAL)</option>
    </>
  )

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <Tags className="text-brand" size={28} /> 메타태그 관리
          </h1>
          <p className="mt-2 text-muted">추천 로직에 사용할 비가시적 메타태그를 생성하고 관리합니다.</p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} /> 새 태그 등록
        </Button>
      </div>

      <div className="bg-surface border border-border-soft rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-muted border-b border-border-soft text-muted">
            <tr>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold">태그명</th>
              <th className="p-4 font-semibold">타입</th>
              <th className="p-4 font-semibold text-right w-32">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {tags.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-muted">등록된 메타태그가 없습니다.</td></tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4 text-muted">#{tag.id}</td>
                  <td className="p-4 font-bold text-ink">{tag.name}</td>
                  <td className="p-4 text-muted">
                    <span className="bg-surface-muted px-2 py-1 rounded-sm text-xs">{tag.type}</span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingTag({ id: tag.id, name: tag.name, type: tag.type, status: tag.status })
                        setIsEditModalOpen(true)
                      }}
                      className="text-muted hover:text-brand p-2 rounded-md transition-colors"
                      title="수정"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteTag(tag.id)} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors" title="삭제">
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
              <h2 className="text-xl font-bold text-ink">새 메타태그 등록</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleAddTag} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1">태그 타입</label>
                <select
                  value={newTagPayload.type}
                  onChange={(e) => setNewTagPayload({...newTagPayload, type: e.target.value})}
                  className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none bg-white"
                >
                  <TagTypeOptions />
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1">태그명</label>
                <input type="text" required value={newTagPayload.name} onChange={(e) => setNewTagPayload({...newTagPayload, name: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" placeholder="예: 워킹맘" autoFocus />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">생성</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-sm border border-border-soft">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-ink">메타태그 수정</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24}/></button>
            </div>
            <form onSubmit={handleUpdateTag} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-1">태그 타입</label>
                <select
                  value={editingTag.type}
                  onChange={(e) => setEditingTag({...editingTag, type: e.target.value})}
                  className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none bg-white"
                >
                  <TagTypeOptions />
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-1">태그명</label>
                <input type="text" required value={editingTag.name} onChange={(e) => setEditingTag({...editingTag, name: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" autoFocus />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">저장</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}