import { CircleHelp, SlidersHorizontal, Sparkles, TextCursorInput } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategoryByCode, quickCategories } from '../data/catalog'

function EmptySearchResultsPage({ getCategoryPath = (categoryCode) => `/shop?categoryId=${encodeURIComponent(categoryCode)}`, query }) {
  return (
    <section className="mx-auto w-full max-w-[1110px] px-6 pt-16 pb-28 text-center max-sm:px-4">
      <div className="mx-auto grid size-24 place-items-center rounded-xl border border-[#dfe6ef] bg-white text-[#516985]">
        <CircleHelp className="size-10" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h1 className="mt-10 text-[28px] font-medium text-[#ff4b11]">'{query}'에 대한 검색 결과가 없습니다.</h1>
      <p className="mt-5 text-[16px] leading-7 text-[#657186]">입력하신 검색어와 일치하는 상품을 찾을 수 없습니다.<br />검색어를 다시 확인하시거나 아래의 검색 팁을 참고해 보세요.</p>

      <div className="mt-16 grid grid-cols-3 gap-6 text-left max-md:grid-cols-1">
        {[
          [TextCursorInput, '오타 확인', '입력하신 검색어의 철자가 정확한지 다시 한번 확인해 주세요.'],
          [Sparkles, '일반적인 단어 사용', '너무 구체적인 모델명보다는 브랜드나 카테고리 명칭을 사용해 보세요.'],
          [SlidersHorizontal, '키워드 줄이기', '여러 개의 검색어 대신 한두 개의 핵심 키워드로만 검색해 보세요.'],
        ].map(([Icon, title, description]) => (
          <article className="min-h-[180px] border border-[#dfe6ef] bg-white p-8" key={title}>
            <Icon className="size-7 text-[#071431]" aria-hidden="true" />
            <h2 className="mt-8 text-[20px] font-medium text-[#071431]">{title}</h2>
            <p className="mt-4 text-[15px] leading-6 text-[#657186]">{description}</p>
          </article>
        ))}
      </div>

      <section className="mt-16 text-left">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-[24px] font-medium text-[#071431]">추천 카테고리</h2>
          <Link className="border-b border-[#071431] pb-1 text-[15px] font-medium" to="/shop">전체 카테고리 보기</Link>
        </div>
        <div className="grid grid-cols-4 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1">
          {quickCategories.map((category) => (
            <Link className="text-center" to={getCategoryPath(category.categoryCode)} key={category.categoryCode}>
              <div className="relative aspect-[1.32/1] border border-[#071431] bg-[#d9d9d9]">
                <span className="absolute bottom-2 left-2 bg-[#071431] px-3 py-1 text-[14px] font-medium text-white">{getCategoryByCode(category.categoryCode)?.label.toUpperCase() ?? category.label}</span>
              </div>
              <span className="mt-3 block text-[15px] font-medium">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </section>
  )
}

export default EmptySearchResultsPage
