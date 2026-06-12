import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import {
    getCartItems,
    updateCartQuantity,
    deleteCartItem,
    deleteCartItems,
} from '../../../api/cartApi'

export default function CartPage() {
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const data = await getCartItems()
                setCartItems(data)
            } catch (error) {
                console.error(error)
                alert('장바구니 조회에 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchCartItems()
    }, [])

    const selectedCartItems = cartItems.filter((item) =>
        selectedItems.includes(item.cartId),
    )

    const totalPrice = selectedCartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    )

        const discountPrice = selectedCartItems.reduce(
            (sum, item) => {
                const itemDiscount = item.discountRate
                    ? Math.floor(item.price * (item.discountRate / 100))
                    : 0;

                return sum + (itemDiscount * item.quantity);
            },
            0,
        )
    const deliveryFee = 0
    const finalPrice = totalPrice - discountPrice + deliveryFee

    const handleOrder = () => {
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요.')
            return
        }

        navigate('/orders/checkout', {
            state: {
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

            setCartItems((prev) =>
                prev.filter((item) => item.cartId !== cartId)
            )
        } catch (error) {
            console.error(error)
            alert('상품 삭제에 실패했습니다.')
        }
    }

    const handleSelect = (cartId) => {
        setSelectedItems((prev) =>
            prev.includes(cartId)
                ? prev.filter((id) => id !== cartId)
                : [...prev, cartId],
        )
    }

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([])
            return
        }

        setSelectedItems(cartItems.map((item) => item.cartId))
    }

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) {
            alert('삭제할 상품을 선택해주세요.')
            return
        }

        try {
            await deleteCartItems(selectedItems)

            setCartItems((prev) =>
                prev.filter((item) => !selectedItems.includes(item.cartId)),
            )

            setSelectedItems([])
        } catch (error) {
            console.error(error)
            alert('선택 삭제에 실패했습니다.')
        }
    }

    if (loading) {
        return (
            <main className="layout-container py-12">
                <p className="text-body text-muted">장바구니를 불러오는 중입니다.</p>
            </main>
        )
    }

    return (
        <main className="layout-container py-12">
            <h1 className="text-3xl font-bold text-ink">장바구니</h1>
            <p className="mt-3 text-body-sm text-muted">
                장바구니에 {cartItems.length}개의 상품이 담겨 있습니다.
            </p>

            <div className="mt-8 grid grid-cols-[1fr_18rem] gap-8">
                <section>
                    <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                        <div className="mb-4 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-body-sm text-ink">
                                <input
                                    type="checkbox"
                                    checked={
                                        cartItems.length > 0 &&
                                        selectedItems.length === cartItems.length
                                    }
                                    onChange={handleSelectAll}
                                />
                                전체 선택
                            </label>

                            <button
                                type="button"
                                className="text-body-sm font-bold text-danger disabled:text-disabled-text"
                                onClick={handleBulkDelete}
                                disabled={selectedItems.length === 0}
                            >
                                선택 삭제
                            </button>
                        </div>
                        <div className="grid grid-cols-[1fr_7rem_8rem_7rem] border-b border-border pb-4 text-caption text-muted">
                            <span>상품 정보</span>
                            <span className="text-right">가격</span>
                            <span className="text-center">수량</span>
                            <span className="text-right">소계</span>
                        </div>

                        {cartItems.length > 0 ? (
                            <div>
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.cartId}
                                        item={item}
                                        checked={selectedItems.includes(item.cartId)}
                                        onSelect={() => handleSelect(item.cartId)}
                                        onIncrease={() => handleIncrease(item.cartId, item.quantity)}
                                        onDecrease={() => handleDecrease(item.cartId, item.quantity)}
                                        onDelete={() => handleDelete(item.cartId)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-body font-medium text-ink">
                                    장바구니에 담긴 상품이 없습니다.
                                </p>
                                <p className="mt-2 text-body-sm text-muted">
                                    원하는 상품을 장바구니에 담아보세요.
                                </p>
                            </div>
                        )}
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
                    disabled={selectedItems.length === 0}
                    onOrder={handleOrder}
                />
            </div>
        </main>
    )
}