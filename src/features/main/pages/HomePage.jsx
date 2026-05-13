import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobalFooter, GlobalHeader, ProductCard } from '../../../common/components'

const HERO_CAROUSEL_INTERVAL = 5000

const heroSlides = [
  {
    id: 'workspace',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
    label: '임직원 전용',
    title: '업무 공간의 품격을 높이세요',
    description: '임직원만을 위한 특별한 가격으로 프리미엄 테크, 라이프스타일, 웰니스 필수템을 만나보세요.',
    primaryCta: { label: '지금 쇼핑하기', to: '/shop' },
    secondaryCta: { label: '혜택 보기', to: '/benefits' },
  },
  {
    id: 'wellness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
    label: '웰니스 추천',
    title: '오늘의 루틴을 더 편안하게',
    description: '건강한 근무 리듬을 위한 홈트레이닝, 회복, 데스크 웰니스 아이템을 임직원 혜택가로 만나보세요.',
    primaryCta: { label: '건강 상품 보기', to: '/shop?category=health' },
    secondaryCta: { label: '추천 혜택', to: '/benefits' },
  },
  {
    id: 'tech',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    label: '스마트 워크',
    title: '몰입을 돕는 테크 셋업',
    description: '회의, 집중, 이동 업무까지 매끄럽게 연결하는 업무용 디바이스를 엄선했습니다.',
    primaryCta: { label: '테크 상품 보기', to: '/shop?category=tech' },
    secondaryCta: { label: '신규 입고', to: '/shop' },
  },
  {
    id: 'gift',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1600&q=80',
    label: '선물 큐레이션',
    title: '감사의 마음을 더 세련되게',
    description: '동료와 가족에게 전하기 좋은 프리미엄 선물 아이템을 D-TO 전용 조건으로 준비했습니다.',
    primaryCta: { label: '선물 둘러보기', to: '/shop?category=gift' },
    secondaryCta: { label: '베스트 셀러', to: '/shop' },
  },
]

const products = [
  {
    id: 1,
    name: 'Eco-Grip Performance Mat',
    category: '건강',
    price: '$89.00',
    rating: '4.8',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 2,
    name: 'ProWork Multi-Sync Device',
    category: '테크',
    price: '$1,199.00',
    rating: '4.8',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 3,
    name: 'Precision Brew System',
    category: '가전',
    price: '$349.00',
    rating: '4.8',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 4,
    name: 'Exec Commuter Backpack',
    category: '여행',
    price: '$155.00',
    rating: '4.8',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 5,
    name: 'FocusFlow NC Headphones',
    category: '테크',
    price: '$320.00',
    rating: '4.8',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 6,
    name: 'Signature Series Watch',
    category: '선물',
    price: '$195.00',
    rating: '4.8',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80',
  },
]

const reviewCopy = [
  '소음도 거의 없고 내부 출력도 디자인이 깔끔해서 사무실 어디에나 잘 어울려요. 매일 아침 플랜에 손이 갑니다.',
  '회의 선명도가 기대 이상이에요. 여러 기기랑 동시에 연결해서 쓰니까 작업 흐름이 훨씬 편해집니다.',
  '그립감이 너무 좋고 매트 청소도 쉬워서 요가일 때 정말 편해요. 재질도 탄탄해서 오래 쓸 듯합니다.',
  '디자인이 세련되어서 정장에도 캐주얼에도 다 잘 어울려요. 선물용으로 샀는데 받는 분이 너무 좋아하셨어요.',
  '노이즈 캔슬링 기능이 정말 탁월해요. 시끄러운 카페에서도 집중해서 일할 수 있게 해줍니다.',
]

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="flex gap-5 justify-between items-end mb-8">
      <div>
        <p className="mb-1 text-[12px] font-bold tracking-[0.08em] text-[#ff4b11]">{eyebrow}</p>
        <h2 className="text-[22px] leading-tight font-medium text-[#071431]">{title}</h2>
      </div>
      <Link className="shrink-0 text-[13px] font-medium text-[#071431] hover:text-[#ff4b11]" to="/shop">
        전체 보기
      </Link>
    </div>
  )
}

function ReviewCard({ product, copy }) {
  return (
    <article className="overflow-hidden rounded-md border border-[#dfe6ef] bg-white">
      <div className="relative aspect-square overflow-hidden bg-[#f2f5f8]">
        <img className="object-cover w-full h-full" src={product.image} alt={product.name} />
        <span className="absolute right-2 bottom-2 rounded-sm bg-[#071431]/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
          +1
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="line-clamp-3 min-h-[54px] text-[12px] leading-[1.5] text-[#2f3a4b]">{copy}</p>
        <div className="mt-4 flex items-center gap-3 border-t border-[#edf1f5] pt-3">
          <img className="object-cover rounded-sm size-8" src={product.image} alt="" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="truncate text-[11px] font-extrabold text-[#071431]">{product.name}</h3>
            <p className="mt-0.5 text-[10px] font-semibold text-[#7b8798]">
              <span className="text-[#ff4b11]">★ {product.rating}</span>
              <span className="mx-1">|</span>
              리뷰 {product.reviews}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

function HeroBanner({ slides }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const activeSlide = slides[activeSlideIndex]

  useEffect(() => {
    if (slides.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, HERO_CAROUSEL_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [slides.length])

  if (!activeSlide) {
    return null
  }

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="relative h-[383px] w-full overflow-hidden bg-[#071431] text-white max-sm:h-[470px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
              index === activeSlideIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(3, 17, 43, 0.96) 0%, rgba(3, 17, 43, 0.86) 46%, rgba(3, 17, 43, 0.58) 100%), url(${slide.image})`,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="relative z-10 mx-auto h-full max-w-[1110px] px-[72px] pt-[72px] pb-14 max-md:px-8 max-md:pt-12 max-sm:px-6">
          <div className="max-w-[520px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
                  index === activeSlideIndex ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
                }`}
              >
                <p className="mb-5 inline-flex h-5 min-w-[460px] items-center bg-[#ff4b11] px-3 text-[11px] font-bold tracking-[0.08em] max-sm:min-w-0 max-sm:w-full">
                  {slide.label}
                </p>
                <h1 className="text-[48px] leading-[1.12] font-light tracking-[0.04em] max-md:text-[40px] max-sm:text-[34px]">
                  {slide.title}
                </h1>
                <p className="mt-8 max-w-[490px] text-[15px] leading-[1.7] font-medium text-[#d7e1ef]">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link className="inline-flex h-12 items-center justify-center rounded-sm bg-[#ff4b11] px-8 text-[14px] font-bold text-white hover:bg-[#e8430d]" to={slide.primaryCta.to}>
                    {slide.primaryCta.label}
                  </Link>
                  <Link className="inline-flex h-12 items-center justify-center rounded-sm border border-white/35 px-8 text-[14px] font-bold text-white hover:bg-white/10" to={slide.secondaryCta.to}>
                    {slide.secondaryCta.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 bottom-6 left-0 z-20 flex justify-center gap-2" aria-label="배너 슬라이드 위치">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`size-2 rounded-full transition-colors ${index === activeSlideIndex ? 'bg-[#ff4b11]' : 'bg-white/45 hover:bg-white/75'}`}
              type="button"
              aria-label={`${index + 1}번째 배너 보기`}
              aria-current={index === activeSlideIndex ? 'true' : undefined}
              onClick={() => setActiveSlideIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <div className="min-h-svh bg-[#fbfaf9] text-[#071431]">
      <GlobalHeader />

      <main>
        <HeroBanner slides={heroSlides} />

        <section className="mx-auto mt-16 w-full max-w-[1110px] px-6 max-sm:px-4">
          <SectionHeader eyebrow="최신 상품" title="신규 입고" />
          <div className="grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-[1110px] px-6 max-sm:px-4">
          <SectionHeader eyebrow="임직원 추천" title="베스트 셀러" />
          <div className="grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {products.slice(4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-[1110px] border-t border-[#dfe6ef] px-6 pt-12 pb-44 max-sm:px-4 max-sm:pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-[24px] font-medium text-[#071431]">생생한 구매 후기</h2>
            <span className="mx-auto mt-3 block h-0.5 w-16 bg-[#ff4b11]" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-5 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {products.slice(2).concat(products.slice(1, 2)).map((product, index) => (
              <ReviewCard key={`${product.id}-${index}`} product={product} copy={reviewCopy[index]} />
            ))}
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  )
}

export default HomePage
