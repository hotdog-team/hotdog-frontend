import { CircleHelp, SlidersHorizontal, Sparkles, TextCursorInput } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategoryByCode, quickCategories } from '../data/catalog'

function EmptySearchResultsPage({ getCategoryPath = (categoryCode) => `/shop?categoryId=${encodeURIComponent(categoryCode)}`, query }) {
  return (
    <section className="layout-container pt-16 pb-28 text-center">
      <div className="mx-auto grid size-24 place-items-center rounded-xl border border-border-soft bg-surface text-muted">
        <CircleHelp className="size-10" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h1 className="mt-10 text-2xl font-medium text-brand">'{query}'에 대한 검색 결과가 없습니다.</h1>
      <p className="mt-5 text-body leading-7 text-muted">입력하신 검색어와 일치하는 상품을 찾을 수 없습니다.<br />검색어를 다시 확인하시거나 아래의 검색 팁을 참고해 보세요.</p>

      <div className="mt-16 grid grid-cols-3 gap-6 text-left max-md:grid-cols-1">
        {[
          [TextCursorInput, '오타 확인', '입력하신 검색어의 철자가 정확한지 다시 한번 확인해 주세요.'],
          [Sparkles, '일반적인 단어 사용', '너무 구체적인 모델명보다는 브랜드나 카테고리 명칭을 사용해 보세요.'],
          [SlidersHorizontal, '키워드 줄이기', '여러 개의 검색어 대신 한두 개의 핵심 키워드로만 검색해 보세요.'],
        ].map(([Icon, title, description]) => (
          <article className="min-h-card border border-border-soft bg-surface p-8" key={title}>
            <Icon className="size-7 text-ink" aria-hidden="true" />
            <h2 className="mt-8 text-body-lg font-medium text-ink">{title}</h2>
            <p className="mt-4 text-body leading-6 text-muted">{description}</p>
          </article>
        ))}
      </div>

      <section className="mt-16 text-left">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-medium text-ink">추천 카테고리</h2>
          <Link className="border-b border-ink pb-1 text-body font-medium" to="/shop">전체 카테고리 보기</Link>
        </div>
        <div className="grid grid-cols-4 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1">
          {quickCategories.map((category) => (
            <Link className="text-center" to={getCategoryPath(category.categoryCode)} key={category.categoryCode}>
              <div className="relative aspect-card border border-ink bg-placeholder">
                <span className="absolute bottom-2 left-2 bg-navy px-3 py-1 text-body-sm font-medium text-white">{getCategoryByCode(category.categoryCode)?.label.toUpperCase() ?? category.label}</span>
              </div>
              <span className="mt-3 block text-body font-medium">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </section>
  )
}

export default EmptySearchResultsPage
