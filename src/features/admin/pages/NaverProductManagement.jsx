import { useState, useEffect } from 'react'
import { Search, Plus, ExternalLink, XCircle, ShoppingBag, Image as ImageIcon, CheckSquare } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function NaverProductManagement() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedProducts, setSelectedProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productsToRegister, setProductsToRegister] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/categories')
        const data = response.data
        setCategories(Array.isArray(data) ? data : (data?.content || []))
      } catch (err) {
        toast.error('카테고리 목록을 불러오는 데 실패했습니다.')
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setSelectedProducts([])
    try {
      const response = await axiosInstance.get(`/api/admin/products/naver/search?query=${query}&page=${page}&size=20`)
      const items = response.data.items || response.data || []
      setTotalCount(response.data.total || 0)
      setSearchResults(items)
      setCurrentPage(page)

      if (items.length === 0) toast.info('검색 결과가 없습니다.')
    } catch (err) {
      toast.error('상품 검색에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const cleanHtmlTags = (str) => {
    return str ? str.replace(/<[^>]*>?/gm, '') : ''
  }

  const handleToggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.find((p) => p.productId === product.productId)
      if (isSelected) return prev.filter((p) => p.productId !== product.productId)
      return [...prev, product]
    })
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts([...searchResults])
    } else {
      setSelectedProducts([])
    }
  }

  const openRegisterModal = (products) => {
    setProductsToRegister(products)
    setIsModalOpen(true)
    if (categories.length > 0) setSelectedCategoryId(categories[0].id)
  }

  const handleRegisterProduct = async (e) => {
    e.preventDefault()
    if (!selectedCategoryId) {
      toast.warning('카테고리를 선택해주세요.')
      return
    }

    setIsSubmitting(true)

    const bulkPayload = productsToRegister.map(prod => ({
      categoryId: parseInt(selectedCategoryId),
      name: cleanHtmlTags(prod.title),
      price: parseInt(prod.lprice),
      imageUrl: prod.image,
      brand: prod.brand || '브랜드 없음',
      discountRate: 0,
      deliveryFee: 3000,
      stockQuantity: 100, // 임의의 초기 재고
      shortDescription: prod.mallName,
      description: `네이버 쇼핑 연동 상품 - 링크: ${prod.link}`,
      specInfo: '',
      altText: cleanHtmlTags(prod.title),
      metaTagIds: [] 
    }))

    try {
      await axiosInstance.post('/api/admin/products/bulk', bulkPayload)

      toast.success(`${productsToRegister.length}개 상품이 성공적으로 일괄 등록되었습니다!`)
      setIsModalOpen(false)
      setProductsToRegister([])
      setSelectedProducts([])
    } catch (err) {
      toast.error('일괄 등록에 실패했습니다. 관리자에게 문의하세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border-soft pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
            <ShoppingBag className="text-brand" size={28} /> 네이버 상품 연동
          </h1>
          <p className="mt-2 text-muted">네이버 쇼핑에서 상품을 검색하고 일괄로 플랫폼에 등록합니다.</p>
        </div>
      </div>

      <div className="bg-surface p-6 border border-border-soft rounded-lg shadow-sm">
        <form onSubmit={(e) => handleSearch(e, 1)} className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색할 상품명이나 키워드를 입력하세요 (예: 기계식 키보드)"
            className="flex-1 p-3 border border-border-soft rounded-md focus:border-brand outline-none"
            autoFocus
          />
          <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-32 flex justify-center items-center gap-2">
            {isLoading ? '검색 중...' : <><Search size={20} /> 검색</>}
          </Button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="flex justify-between items-center bg-surface p-4 border border-border-soft rounded-lg shadow-sm">
          <div className="text-sm font-bold text-ink">
            검색 결과: <span className="text-brand">{totalCount.toLocaleString()}</span>개 상품 발견
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-ink hover:text-brand transition-colors">
              <input
                type="checkbox"
                className="w-5 h-5 accent-brand cursor-pointer"
                checked={searchResults.length > 0 && selectedProducts.length === searchResults.length}
                onChange={handleSelectAll}
              />
              전체 선택 ({selectedProducts.length}/{searchResults.length})
            </label>
            <Button
              variant="primary"
              onClick={() => openRegisterModal(selectedProducts)}
              disabled={selectedProducts.length === 0}
              className="flex items-center gap-2"
            >
              <CheckSquare size={18} /> 선택한 {selectedProducts.length}개 상품 등록
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((product) => {
          const isSelected = selectedProducts.some((p) => p.productId === product.productId)

          return (
            <div
              key={product.productId}
              className={`relative bg-surface border rounded-lg shadow-sm overflow-hidden flex flex-col transition-all ${isSelected ? 'border-brand ring-2 ring-brand/20' : 'border-border-soft hover:border-brand/50'
                }`}
            >
              <div className="absolute top-3 left-3 z-10 bg-white/80 rounded-md p-1 backdrop-blur-sm shadow-sm">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-brand cursor-pointer"
                  checked={isSelected}
                  onChange={() => handleToggleProduct(product)}
                />
              </div>

              <div
                className="h-48 bg-surface-muted flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => handleToggleProduct(product)}
              >
                {product.image ? (
                  <img src={product.image} alt="상품 이미지" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-muted/50" />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-ink mb-1 line-clamp-2" title={cleanHtmlTags(product.title)}>
                  {cleanHtmlTags(product.title)}
                </h3>
                <p className="text-sm text-muted mb-4">{product.mallName} | {product.brand || '브랜드 없음'}</p>

                <div className="mt-auto flex items-end justify-between">
                  <span className="text-lg font-bold text-brand">
                    {parseInt(product.lprice).toLocaleString()}원
                  </span>
                  <div className="flex gap-2">
                    <a href={product.link} target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-brand bg-surface-muted rounded-md transition-colors" title="네이버 쇼핑에서 보기">
                      <ExternalLink size={18} />
                    </a>
                    <Button variant="primary" size="sm" onClick={() => openRegisterModal([product])} className="flex items-center gap-1">
                      <Plus size={16} /> 등록
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {searchResults.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-6 pb-2">
          <Button
            variant="secondary"
            disabled={currentPage === 1 || isLoading}
            onClick={() => handleSearch(null, currentPage - 1)}
          >
            이전 페이지
          </Button>
          <span className="font-bold text-ink">
            {currentPage} 페이지
          </span>
          <Button
            variant="secondary"
            disabled={searchResults.length < 20 || isLoading}
            onClick={() => handleSearch(null, currentPage + 1)}
          >
            다음 페이지
          </Button>
        </div>
      )}

      {isModalOpen && productsToRegister.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-surface p-6 rounded-lg shadow-xl w-full max-w-md border border-border-soft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ink">
                {productsToRegister.length > 1 ? `${productsToRegister.length}개 상품 일괄 등록` : '상품 등록 확인'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-error" disabled={isSubmitting}>
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleRegisterProduct} className="space-y-4">
              {productsToRegister.length > 1 ? (
                <div className="bg-brand/10 text-brand p-4 rounded-md font-bold text-center border border-brand/20">
                  선택한 {productsToRegister.length}개의 상품을 아래 카테고리로 일괄 등록합니다.
                </div>
              ) : (
                <div className="flex gap-4 bg-surface-muted p-4 rounded-md border border-border-soft">
                  <img src={productsToRegister[0].image} alt="썸네일" className="w-16 h-16 object-cover rounded-md border border-border-soft" />
                  <div>
                    <p className="text-sm font-bold text-ink line-clamp-2">{cleanHtmlTags(productsToRegister[0].title)}</p>
                    <p className="text-sm text-brand font-bold mt-1">{parseInt(productsToRegister[0].lprice).toLocaleString()}원</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-ink mb-2">공통 카테고리 선택 <span className="text-error">*</span></label>
                <select
                  required
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full p-2 border border-border-soft rounded-md focus:border-brand outline-none bg-white"
                  disabled={isSubmitting}
                >
                  <option value="" disabled>카테고리를 선택하세요</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>취소</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? '등록 중...' : '내 쇼핑몰에 등록'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}