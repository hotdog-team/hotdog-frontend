import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button, Checkbox } from '../../../components/index.js'
import axiosInstance from '../../../api/axiosInstance.js'

export default function MyPageCart() {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const navigate = useNavigate();

  // 1. 장바구니 조회 (GET)
  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get('/api/carts')
      const data = response.data?.data || response.data || []
      setCartItems(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error('장바구니 목록을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const handleQuantityUpdate = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      return toast.warn('최소 수량은 1개입니다.');
    }

    try {
      await axiosInstance.patch(`/api/carts/${cartId}`, { quantity: newQuantity });
      fetchCartItems();
    } catch (err) {
      toast.error('수량 변경에 실패했습니다.');
    }
  }

  const handleSelectItem = (cartId) => {
    setSelectedIds((prev) =>
      prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]
    )
  }

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(cartItems.map((item) => item.cartId || item.id))
    } else {
      setSelectedIds([])
    }
  }

  // 2. 단건 삭제 (DELETE /api/carts/{cartId})
  const handleDeleteSingle = async (cartId) => {
    if (!window.confirm('해당 상품을 장바구니에서 삭제하시겠습니까?')) return

    try {
      await axiosInstance.delete(`/api/carts/${cartId}`)
      toast.success('상품이 삭제되었습니다.')
      setSelectedIds((prev) => prev.filter((id) => id !== cartId))
      fetchCartItems()
    } catch (err) {
      toast.error('삭제에 실패했습니다.')
    }
  }

  // 3. 다건 선택 삭제 (DELETE /api/carts/bulk)
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return toast.warn('삭제할 상품을 선택해 주세요.')
    }
    if (!window.confirm(`선택하신 ${selectedIds.length}개 상품을 삭제하시겠습니까?`)) return

    try {
      await axiosInstance.delete('/api/carts/bulk', {
        data: { cartIds: selectedIds }
      })
      toast.success('선택한 상품이 삭제되었습니다.')
      setSelectedIds([])
      fetchCartItems()
    } catch (err) {
      toast.error('선택 삭제에 실패했습니다.')
    }
  }

  const selectedTotalPrice = cartItems
    .filter(item => selectedIds.includes(item.cartId || item.id))
    .reduce((acc, item) => {
      const discountAmount = item.discountRate ? Math.floor(item.price * (item.discountRate / 100)) : 0;
      const displayPrice = item.salePrice ?? (item.price - discountAmount);
      return acc + (displayPrice * item.quantity);
    }, 0);

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      return toast.warn('결제할 상품을 선택해 주세요.');
    }

    if (selectedTotalPrice <= 0) {
      return toast.warn('결제 금액이 0원 이하인 상품은 주문할 수 없습니다.');
    }

    navigate('/orders/checkout', {
      state: {
        type: 'cart',
        cartItemIds: selectedIds,
      }
    });
  }

  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length

  if (isLoading) {
    return <div className="flex h-40 items-center justify-center font-bold text-ink">로딩 중...</div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">내 장바구니</h2>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleDeleteSelected}
          className="font-bold text-error border-error/50 hover:bg-error/10"
        >
          선택 삭제
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <p className="text-lg font-medium">장바구니에 담긴 상품이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 border-b border-border-soft pb-4 mb-4">
              <Checkbox
                id="select-all"
                variant="brand"
                size="md"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                label={<span className="font-bold text-sm">전체 선택</span>}
              />
            </div>

            <ul className="divide-y divide-border-soft">
              {cartItems.map((item) => {
                const itemId = item.cartId || item.id;
                const discountAmount = item.discountRate ? Math.floor(item.price * (item.discountRate / 100)) : 0;
                const displayPrice = item.salePrice ?? (item.price - discountAmount);
                const hasDiscount = item.price > displayPrice;

                return (
                  <li key={itemId} className="flex items-center gap-6 py-6">
                    <Checkbox
                      id={`check-${itemId}`}
                      variant="brand"
                      size="md"
                      checked={selectedIds.includes(itemId)}
                      onChange={() => handleSelectItem(itemId)}
                    />

                    <Link to={`/shop/${item.productId}`} className="flex items-center gap-6 flex-1 hover:opacity-80 transition-opacity">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border-soft bg-surface-muted">
                        <img
                          src={item.thumbnailImage || item.imageUrl || item.thumbnail}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-ink">{item.productName}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          {hasDiscount && (
                            <span className="text-sm text-muted line-through">{item.price?.toLocaleString()}원</span>
                          )}
                          <span className="text-sm font-bold text-brand">{displayPrice.toLocaleString()}원</span>
                        </div>
                      </div>
                    </Link>

                    {/* 수량 및 개별 삭제 */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 border border-border-soft rounded-lg px-2 py-1">
                        <button
                          onClick={() => handleQuantityUpdate(itemId, item.quantity, -1)}
                          className="text-muted hover:text-brand font-bold px-2"
                        >-</button>
                        <span className="font-bold text-ink w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityUpdate(itemId, item.quantity, 1)}
                          className="text-muted hover:text-brand font-bold px-2"
                        >+</button>
                      </div>

                      <div className="text-right w-24">
                        <p className="text-xl font-extrabold text-ink">
                          {(displayPrice * item.quantity).toLocaleString()}원
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteSingle(itemId)}
                        className="text-muted hover:text-error transition-colors p-2 rounded-md hover:bg-error/10"
                        aria-label="상품 삭제"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 border-t border-border-soft pt-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">선택 상품 총 금액</p>
                <p className="text-3xl font-extrabold text-brand">
                  {selectedTotalPrice.toLocaleString()}원
                </p>
              </div>
              <Button type="button" variant="primary" size="lg" className="w-48 font-bold" onClick={handleCheckout}>
                결제하기
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}