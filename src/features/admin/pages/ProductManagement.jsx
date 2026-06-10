import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Plus, Edit2, Trash2, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function ProductManagement() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    categoryId: 1, name: '', brand: '', price: 0, discountRate: 0, stockQuantity: 0,
    deliveryFee: 3000, shortDescription: '', altText: '', imageUrl: ''
  })
  const [selectedTagIds, setSelectedTagIds] = useState([])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [editProductData, setEditProductData] = useState({
    categoryId: 1, name: '', brand: '', price: 0, discountRate: 0, stockQuantity: 0,
    deliveryFee: 3000, shortDescription: '', altText: '', imageUrl: ''
  })
  const [editSelectedTagIds, setEditSelectedTagIds] = useState([])

  const fetchProducts = async () => {
    try{
      const response = await axiosInstance.get('/api/products?page=0&size=20&sort=latest')
      if (typeof response.data === 'string' && response.data.includes('<html')) throw new Error('인증 실패')
      const payload = response.data.data || response.data
      setProducts(Array.isArray(payload) ? payload : (payload?.content || []))
      setTotalCount(payload?.totalElements || payload?.length || 0)
    } catch (err) {
      toast.error(err.message || '상품 목록을 불러오는 데 실패했습니다.')
    }
  }

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/api/tags')
      const data = response.data
      setAvailableTags(Array.isArray(data) ? data : (data.content || []))
    } catch (err) {
      console.error('태그 목록 로드 실패', err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchTags()
  }, [])

  const visibleTags = availableTags.filter(tag =>
    tag.type !== 'CATEGORY' && tag.type !== 'POPULARITY' && tag.type !== 'RELEASE_OR_UPDATE'
  )

  // 등록 로직
  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...newProduct,
        metaTagIds: selectedTagIds
      }

      await axiosInstance.post('/api/admin/products', payload)

      toast.success('상품 등록이 완료되었습니다.')
      setIsAddModalOpen(false)
      setNewProduct({ categoryId: 1, name: '', brand: '', price: 0, discountRate: 0, stockQuantity: 0, deliveryFee: 3000, shortDescription: '', altText: '', imageUrl: '' });
      setSelectedTagIds([])
      fetchProducts()
    } catch (err) {
      toast.error('상품 등록에 실패했습니다.')
    }
  }

  // 삭제 로직
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`)
      toast.success('상품이 삭제 처리되었습니다.')
      fetchProducts()
    } catch (err) {
      toast.error('상품 삭제에 실패했습니다.')
    }
  }

  //수정 로직
  const handleOpenEditModal = async (product) => {
    try {
      const res = await axiosInstance.get(`/api/products/${product.id}`)
      const detail = res.data?.data || res.data?.result || res.data || {};

      setEditProductData({
        categoryId: detail.categoryId || product.categoryId || 1,
        name: detail.name || product.name || '',
        brand: detail.brand || product.brand || '',
        price: detail.originPrice || detail.price || product.price || 0,
        discountRate: detail.discountRate !== undefined ? detail.discountRate : (product.discountRate || 0),
        stockQuantity: detail.stockQuantity || 0,
        deliveryFee: detail.deliveryFee || 0,
        shortDescription: detail.shortDescription || '',
        altText: detail.altText || '',
        imageUrl: detail.imageUrl || ''
      })

      const existingTags = Array.isArray(detail.metaTagIds) ? detail.metaTagIds : [];
      setEditSelectedTagIds(existingTags);

      setEditingProductId(product.id)
      setIsEditModalOpen(true)
    } catch (err) {
      toast.error('상세 정보를 불러오지 못했습니다.')
    }
  }

  // 수정 완료 로직
  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const validTagIds = editSelectedTagIds.filter(tagId => {
        const tagInfo = availableTags.find(t => t.id === tagId);
        if (!tagInfo) return false;
        return tagInfo.type !== 'CATEGORY' &&
               tagInfo.type !== 'POPULARITY' &&
               tagInfo.type !== 'RELEASE_OR_UPDATE';
      });

      const payload = {
        ...editProductData,
        metaTagIds: validTagIds
      }

      await axiosInstance.put(`/api/admin/products/${editingProductId}`, payload)
      toast.success('상품 정보가 수정되었습니다.')
      setIsEditModalOpen(false)
      fetchProducts()
    } catch (err) {
      toast.error('상품 수정에 실패했습니다.')
    }
  }

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  const toggleEditTag = (tagId) => {
    setEditSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  const getProductStatusBadge = (status) => {
    switch (status) {
      case 'ON_SALE': return <span className="text-success bg-success/10 px-2 py-1 rounded-sm text-xs font-bold">판매중</span>
      case 'SOLD_OUT': return <span className="text-error bg-error/10 px-2 py-1 rounded-sm text-xs font-bold">품절</span>
      case 'DELETED': return <span className="text-muted bg-surface-muted px-2 py-1 rounded-sm text-xs font-bold">삭제됨</span>
      default: return <span className="text-muted bg-surface-muted px-2 py-1 rounded-sm text-xs font-bold">{status || '상태없음'}</span>
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <ShoppingBag className="text-blue-500" size={28} /> 등록 상품 관리
          </h1>
          <p className="mt-2 text-muted">플랫폼에 등록된 전체 상품을 조회하고 상태 및 재고를 관리합니다.</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            className="flex items-center gap-2 border-[#03C75A] text-[#03C75A] hover:bg-[#03C75A]/10 transition-colors"
            onClick={() => navigate('/admin/products/naver')}
          >
            <Search size={20} /> 네이버 상품 가져오기
          </Button>
          <Button variant="primary" size="md" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} /> 새 상품 등록
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input type="text" placeholder="상품명 또는 브랜드 검색" className="w-full pl-10 p-3 border border-border-soft rounded-md focus:border-brand outline-none" />
        </div>
        <Button variant="secondary" size="md">검색</Button>
      </div>

      <div className="bg-surface border border-border-soft rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-muted border-b border-border-soft text-muted">
            <tr>
              <th className="p-4 font-semibold w-20">ID</th>
              <th className="p-4 font-semibold">상품명</th>
              <th className="p-4 font-semibold">판매가</th>
              <th className="p-4 font-semibold">상태</th>
              <th className="p-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {products.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-muted">등록된 상품이 없습니다.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4 text-muted">#{product.id}</td>
                  <td className="p-4 font-bold text-ink">
                    <div className="truncate max-w-[250px]">{product.name}</div>
                    <div className="text-xs text-muted font-normal mt-0.5">{product.brand || '브랜드 없음'}</div>
                  </td>
                  <td className="p-4 text-ink">
                    {product.discountRate > 0 ? (
                      <div className="space-y-1">
                        <div className="font-bold text-blue-600">
                          {Math.floor(product.price * (1 - product.discountRate / 100)).toLocaleString()}원
                        </div>
                        <div className="text-xs text-muted flex items-center gap-1.5 font-normal">
                          <span className="line-through">{product.price?.toLocaleString()}원</span>
                          <span className="text-error bg-error/10 px-1 rounded-sm font-bold">{product.discountRate}% ↓</span>
                        </div>
                      </div>
                    ) : (
                      <span className="font-bold">{product.price?.toLocaleString()}원</span>
                    )}
                  </td>
                  <td className="p-4">{getProductStatusBadge(product.status)}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenEditModal(product)} className="text-muted hover:text-ink p-2 transition-colors" title="수정">
                      <Edit2 size={18} />
                    </button>
                    {product.status !== 'DELETED' && (
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-error hover:bg-error/10 p-2 rounded-md transition-colors" title="삭제">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 등록 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-2xl border border-border-soft max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">새 상품 상세 등록</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24}/></button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">상품명 *</label>
                    <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">카테고리 ID *</label>
                    <input type="number" required value={newProduct.categoryId} onChange={(e) => setNewProduct({...newProduct, categoryId: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">브랜드</label>
                    <input type="text" value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">짧은 설명</label>
                    <input type="text" value={newProduct.shortDescription} onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">원가 (정가) *</label>
                    <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">할인율 (%)</label>
                    <input type="number" min="0" max="100" value={newProduct.discountRate} onChange={(e) => setNewProduct({...newProduct, discountRate: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div className="p-3 bg-surface-muted rounded-md border border-border-soft flex justify-between items-center">
                    <span className="text-sm font-bold text-muted">최종 판매가</span>
                    <span className="text-lg font-bold text-brand">
                      {Math.floor(newProduct.price * (1 - newProduct.discountRate / 100)).toLocaleString()} 원
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">초기 재고 (개) *</label>
                    <input type="number" required value={newProduct.stockQuantity} onChange={(e) => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">배송비 (원)</label>
                    <input type="number" value={newProduct.deliveryFee} onChange={(e) => setNewProduct({...newProduct, deliveryFee: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">대체 텍스트 (Alt Text)</label>
                    <input type="text" value={newProduct.altText} onChange={(e) => setNewProduct({...newProduct, altText: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-border-soft pt-4">
                <label className="block text-sm font-bold text-ink mb-1">상품 이미지 URL</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-border-soft">
                <label className="block text-sm font-bold text-ink mb-2">메타태그 연결 (다중 선택 가능)</label>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.length === 0 ? (
                    <span className="text-sm text-muted">등록된 메타태그가 없습니다. 먼저 태그를 등록해주세요.</span>
                  ) : (
                    visibleTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                          selectedTagIds.includes(tag.id)
                            ? 'bg-brand text-white border-brand'
                            : 'bg-surface border-border-soft text-muted hover:border-brand hover:text-brand'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-2 border-t border-border-soft mt-6">
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">상품 등록 및 태그 매핑</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-2xl border border-border-soft max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">상품 정보 수정</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted hover:text-error"><XCircle size={24}/></button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">상품명 *</label>
                    <input type="text" required value={editProductData.name} onChange={(e) => setEditProductData({...editProductData, name: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">카테고리 ID *</label>
                    <input type="number" required value={editProductData.categoryId} onChange={(e) => setEditProductData({...editProductData, categoryId: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">브랜드</label>
                    <input type="text" value={editProductData.brand} onChange={(e) => setEditProductData({...editProductData, brand: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">짧은 설명</label>
                    <input type="text" value={editProductData.shortDescription} onChange={(e) => setEditProductData({...editProductData, shortDescription: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">원가 (원) *</label>
                    <input type="number" required value={editProductData.price} onChange={(e) => setEditProductData({...editProductData, price: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">할인율 (%)</label>
                    <input type="number" min="0" max="100" value={editProductData.discountRate} onChange={(e) => setEditProductData({...editProductData, discountRate: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div className="p-3 bg-surface-muted rounded-md border border-border-soft flex justify-between items-center">
                    <span className="text-sm font-bold text-muted">최종 판매가</span>
                    <span className="text-lg font-bold text-brand">
                      {Math.floor(editProductData.price * (1 - editProductData.discountRate / 100)).toLocaleString()} 원
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">초기 재고 (개) *</label>
                    <input type="number" required value={editProductData.stockQuantity} onChange={(e) => setEditProductData({...editProductData, stockQuantity: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">배송비 (원)</label>
                    <input type="number" value={editProductData.deliveryFee} onChange={(e) => setEditProductData({...editProductData, deliveryFee: Number(e.target.value)})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">대체 텍스트 (Alt Text)</label>
                    <input type="text" value={editProductData.altText} onChange={(e) => setEditProductData({...editProductData, altText: e.target.value})} className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-border-soft pt-4">
                <label className="block text-sm font-bold text-ink mb-1">상품 이미지 URL</label>
                <input
                  type="text"
                  value={editProductData.imageUrl}
                  onChange={(e) => setEditProductData({...editProductData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-border-soft">
                <label className="block text-sm font-bold text-ink mb-2">메타태그 다시 연결 (다중 선택 가능)</label>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.length === 0 ? (
                    <span className="text-sm text-muted">등록된 메타태그가 없습니다.</span>
                  ) : (
                    visibleTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleEditTag(tag.id)}
                        className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                          editSelectedTagIds.includes(tag.id)
                            ? 'bg-brand text-white border-brand'
                            : 'bg-surface border-border-soft text-muted hover:border-brand hover:text-brand'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-2 border-t border-border-soft mt-6">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>취소</Button>
                <Button type="submit" variant="primary">변경사항 저장</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}