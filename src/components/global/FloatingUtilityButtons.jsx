import { useEffect, useState } from 'react'
import { ArrowUp, History } from 'lucide-react'
import { Link } from 'react-router-dom'

const buttonClass =
  'inline-flex size-11 items-center justify-center border border-gray-300 bg-surface text-ink shadow-card transition-colors hover:bg-surface-muted focus-ring'

export default function FloatingUtilityButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 max-sm:bottom-4 max-sm:right-4">
      {showScrollTop && (
        <button
          type="button"
          className={buttonClass}
          aria-label="맨 위로 이동"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="size-5" strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
      <Link to="/recent-products" className={buttonClass} aria-label="최근 본 상품">
        <History className="size-5" strokeWidth={2.25} aria-hidden="true" />
      </Link>
    </div>
  )
}
