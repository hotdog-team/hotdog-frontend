import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox, Button, PageLoadingBox, PageEmptyBox } from '../../../components/index.js'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import OrderProgressSteps from '../components/OrderProgressSteps'
import {
  getCartItems,
  updateCartQuantity,
  deleteCartItem,
  deleteCartItems,
} from '../../../api/cartApi'
import { resolveDeliveryFee } from '../utils/resolveDeliveryFee.js'

function CartToolbar({
  cartCount,
  selectedCount,
  isAllSelected,
  onSelectAll,
  onBulkDelete,
  disableBulkDelete,
  selectAllId = 'cart-select-all',
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Checkbox
        id={selectAllId}
        variant="brand"
        size="md"
        checked={cartCount > 0 && isAllSelected}
        onChange={onSelectAll}
        label={(
          <span className="font-semibold text-ink">
            전체 선택
            {' '}
            <span className="font-normal text-muted">
              ({selectedCount} / {cartCount})
            </span>
          </span>
        )}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onBulkDelete}
        disabled={disableBulkDelete}
      >
        선택 삭제
      </Button>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isToolbarPinned, setIsToolbarPinned] = useState(false)

  const toolbarSentinelRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchCartItems = async () => {
      try {
        const data = await getCartItems()
        if (cancelled) return
        setCartItems(data)
      } catch (error) {
        if (cancelled) return
        console.error(error)
        setFetchFailed(true)
        alert('장바구니 조회에 실패했습니다.')
        navigate(-1)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCartItems()

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    const sentinel = toolbarSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsToolbarPinned(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [cartItems.length, loading])

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(Number(item.cartId)),
  )

  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const discountPrice = selectedCartItems.reduce((sum, item) => {
    const itemDiscount = item.discountRate
      ? Math.floor(item.price * (item.discountRate / 100))
      : 0

    return sum + (itemDiscount * item.quantity)
  }, 0)

  const deliveryFee = resolveDeliveryFee(selectedCartItems)
  const finalPrice = totalPrice - discountPrice + deliveryFee

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.')
      return
    }

    navigate('/orders/checkout', {
      state: {
        type: 'cart',
        cartItemIds: selectedItems,
      },
    })
  }

  const handleIncrease = async (cartId, quantity) => {
    try {
      await updateCartQuantity(cartId, quantity + 1)

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      )
    } catch (error) {
      console.error(error)
      alert('수량 변경에 실패했습니다.')
    }
  }

  const handleDecrease = async (cartId, quantity) => {
    if (quantity <= 1) return

    try {
      await updateCartQuantity(cartId, quantity - 1)

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      )
    } catch (error) {
      console.error(error)
      alert('수량 변경에 실패했습니다.')
    }
  }

  const handleDelete = async (cartId) => {
    try {
      await deleteCartItem(cartId)

      setCartItems((prev) => prev.filter((item) => item.cartId !== Number(cartId)))
      setSelectedItems((prev) => prev.filter((id) => id !== Number(cartId)))
    } catch (error) {
      console.error(error)
      alert('상품 삭제에 실패했습니다.')
    }
  }

  const handleSelect = (cartId) => {
    const normalizedId = Number(cartId)
    setSelectedItems((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((id) => id !== normalizedId)
        : [...prev, normalizedId],
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
      return
    }

    setSelectedItems(cartItems.map((item) => Number(item.cartId)))
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.')
      return
    }

    try {
      await deleteCartItems(selectedItems)

      setCartItems((prev) =>
        prev.filter((item) => !selectedItems.includes(Number(item.cartId))),
      )

      setSelectedItems([])
    } catch (error) {
      console.error(error)
      alert('선택 삭제에 실패했습니다.')
    }
  }

  if (loading || fetchFailed) {
    return (
      <main className="layout-container py-12">
        <PageLoadingBox label="장바구니를 불러오는 중입니다." />
      </main>
    )
  }

  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length

  return (
    <main className="layout-container py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">장바구니</h1>
          <p className="mt-3 text-body-sm text-muted">
            장바구니에 {cartItems.length}개의 상품이 담겨 있습니다.
          </p>
        </div>
        <OrderProgressSteps currentStep="cart" />
      </div>

      <div ref={toolbarSentinelRef} className="mt-8 h-px" aria-hidden="true" />

      {isToolbarPinned && <div className="h-14" aria-hidden="true" />}

      {isToolbarPinned && cartItems.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-30 border-b border-border bg-surface shadow-sm">
          <div className="layout-container py-3">
            <CartToolbar
              selectAllId="cart-select-all-pinned"
              cartCount={cartItems.length}
              selectedCount={selectedItems.length}
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              onBulkDelete={handleBulkDelete}
              disableBulkDelete={selectedItems.length === 0}
            />
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-8 lg:gap-y-4">
          <div className="lg:col-span-2">
            {isToolbarPinned ? (
              <div className="h-10" aria-hidden="true" />
            ) : (
              <CartToolbar
                cartCount={cartItems.length}
                selectedCount={selectedItems.length}
                isAllSelected={isAllSelected}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                disableBulkDelete={selectedItems.length === 0}
              />
            )}
          </div>

          <section className="min-w-0">
            <div className="rounded-md border border-border bg-surface p-5 shadow-card sm:p-6">
              <div>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cartId}
                    item={item}
                    checked={selectedItems.includes(Number(item.cartId))}
                    onSelect={() => handleSelect(item.cartId)}
                    onIncrease={() => handleIncrease(item.cartId, item.quantity)}
                    onDecrease={() => handleDecrease(item.cartId, item.quantity)}
                    onDelete={() => handleDelete(item.cartId)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-8 text-body-sm font-medium text-ink hover:text-brand"
              onClick={() => navigate('/home')}
            >
              ← 쇼핑 계속하기
            </button>
          </section>

          <CartSummary
            totalPrice={totalPrice}
            discountPrice={discountPrice}
            deliveryFee={deliveryFee}
            finalPrice={finalPrice}
            selectedCount={selectedItems.length}
            disabled={selectedItems.length === 0}
            isToolbarPinned={isToolbarPinned}
            onOrder={handleOrder}
          />
        </div>
      )}

      {cartItems.length === 0 && (
        <div className="mt-8">
          <PageEmptyBox
            title="장바구니에 담긴 상품이 없습니다."
            description="원하는 상품을 장바구니에 담아보세요."
            action={(
              <Button type="button" variant="outline" size="md" onClick={() => navigate('/shop')}>
                쇼핑 계속하기
              </Button>
            )}
          />
        </div>
      )}
    </main>
  )
}
