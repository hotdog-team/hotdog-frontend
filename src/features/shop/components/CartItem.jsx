import Button from '../../../components/ui/Button.jsx'
import QuantitySelector from './QuantitySelector'
import { useNavigate } from 'react-router-dom'

export default function CartItem({
    item,
    checked,
    onSelect,
    onIncrease,
    onDecrease,
    onDelete,
}) {
    const navigate = useNavigate()

    const handleMoveDetail = () => {
        navigate(`/shop/${item.productId}`)
    }

    const discountAmount = item.discountRate
        ? Math.floor(item.price * (item.discountRate / 100))
        : 0;
    const discountedPrice = item.price - discountAmount;

    const subtotal = discountedPrice * item.quantity;

    const imageUrl =
        item.image?.trim() ||
        item.imageUrl?.trim() ||
        item.thumbnailImage?.trim() ||
        item.productImageUrl?.trim() ||
        item.thumbnailUrl?.trim()

    console.log({
        cartId: item.cartId,
        productId: item.productId,
        thumbnailImage: item.thumbnailImage,
    })

    return (
        <div className="grid grid-cols-[1fr_7rem_8rem_7rem] items-center border-b border-border py-6">
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onSelect}
                    aria-label={`${item.productName} 선택`}
                />
                <div
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted cursor-pointer"
                    onClick={handleMoveDetail}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-caption text-muted">
                            이미지 없음
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    {item.category && (
                        <span className="inline-block rounded bg-brand-soft px-2 py-1 text-caption font-medium text-brand">
                            {item.category}
                        </span>
                    )}

                    <h3
                        className="mt-2 truncate text-body font-bold text-ink cursor-pointer hover:text-brand"
                        onClick={handleMoveDetail}
                    >
                        {item.productName}
                    </h3>
                </div>
            </div>

            <div className="text-right flex flex-col justify-center">
                {item.discountRate > 0 ? (
                    <>
                        <span className="text-caption text-muted line-through">
                            ₩{item.price.toLocaleString()}
                        </span>
                        <span className="text-body-sm font-bold text-ink">
                            ₩{discountedPrice.toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="text-body-sm font-bold text-ink">
                        ₩{item.price.toLocaleString()}
                    </span>
                )}
            </div>

            <div className="flex justify-center">
                <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                />
            </div>

            <div className="text-right text-body font-bold text-ink">
                ₩{subtotal.toLocaleString()}
            </div>
        </div>
    )
}