import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ShieldCheck, ArrowRight } from 'lucide-react'

import { ProductCard, Button } from '../../../components/index.js'
import { useAuthStore } from '../../../store/useAuthStore.js'
import { useHomeProductsQuery } from '../../../hooks/queries/useProductQuery.js'
import useHomeRecommendations from '../../../hooks/useHomeRecommendations.js'
import { buildMetaTagListPath, buildRecommendListPath } from '../../../constants/profileMetaTags.js'
import useBookmarkedIds from '../../../hooks/useBookmarkedIds.js'
import { getHiddenIds } from '../../../utils/dislikeHiddenStorage.js'
import MainSlides from '../components/MainSlides.jsx'

const HOME_RECOMMEND_DISPLAY_COUNT = 12
const HOME_RECOMMEND_FETCH_SIZE = 20

function SectionHeader({ title, showMore = true, moreTo }) {
  return (
    <div className="flex gap-5 justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl leading-tight font-bold text-ink">{title}</h2>
      </div>
      {showMore && moreTo && (
        <Link className="shrink-0 text-sm font-medium text-ink hover:text-brand" to={moreTo}>
          전체 보기
        </Link>
      )}
    </div>
  )
}


function HomePage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ROLE_ADMIN'

  const { data: pageData } = useHomeProductsQuery({ size: HOME_RECOMMEND_FETCH_SIZE })
  const products = pageData?.content ?? []
  const recommendProducts = useMemo(() => {
    const hiddenIds = getHiddenIds()
    return products
      .filter((product) => !hiddenIds.has(Number(product.id)))
      .slice(0, HOME_RECOMMEND_DISPLAY_COUNT)
  }, [products])

  const { purposeProducts, personalizedProducts, purposeTagIds, merchandisingIds } = useHomeRecommendations()
  const bookmarkedIds = useBookmarkedIds()

  return (
    <>
        <MainSlides />

        {isAdmin && (
          <section className="layout-container mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-brand/20 bg-brand/5 px-8 py-6 shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <ShieldCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-brand">관리자 모드 활성화</h2>
                  <p className="mt-0.5 text-sm font-medium text-ink">
                    메타태그 등록, 이벤트 관리, 회원 조회는 관리자 센터에서 진행해 주세요.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => window.open('/admin', '_blank')}
                className="shrink-0 flex items-center gap-2"
              >
                관리자 센터로 이동 <ArrowRight size={18} strokeWidth={2.5} />
              </Button>
            </div>
          </section>
        )}

        <div className="pb-24">
          <section className="layout-container mt-16">
            <SectionHeader
              title="오늘의 맞춤 추천"
              moreTo={buildRecommendListPath({ title: '오늘의 맞춤 추천' })}
            />
            <div className="a11y-grid-4col grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {recommendProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={`/shop/${product.id}`}
                  initialBookmarked={bookmarkedIds.has(Number(product.id))}
                />
              ))}
            </div>
          </section>

          <section className="layout-container mt-24">
            <SectionHeader
              title="관심 분야 인기 상품"
              showMore={purposeTagIds.length > 0}
              moreTo={purposeTagIds.length > 0 ? buildMetaTagListPath({
                metaTagIds: purposeTagIds,
                sort: 'POPULAR',
                title: '관심 분야 인기 상품',
              }) : undefined}
            />
            <div className="a11y-grid-4col grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {purposeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={`/shop/${product.id}`}
                  initialBookmarked={bookmarkedIds.has(Number(product.id))}
                />
              ))}
            </div>
          </section>

          <section className="layout-container mt-24">
            <SectionHeader
              title="이런 상품은 어떠세요?"
              showMore={merchandisingIds.length > 0}
              moreTo={merchandisingIds.length > 0 ? buildMetaTagListPath({
                metaTagIds: merchandisingIds,
                sort: 'ATTENTION',
                title: '이런 상품은 어떠세요?',
              }) : undefined}
            />
            <div className="a11y-grid-4col grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {personalizedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={`/shop/${product.id}`}
                  initialBookmarked={bookmarkedIds.has(Number(product.id))}
                />
              ))}
            </div>
          </section>
        </div>
    </>
  )
}

export default HomePage