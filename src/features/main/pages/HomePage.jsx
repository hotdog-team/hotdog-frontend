import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowRight } from 'lucide-react'

import { ProductCard, Button } from '../../../components/index.js'
import { useAuthStore } from '../../../store/useAuthStore.js'
import { productCatalog } from '../../shop/data/catalog.js'

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
        <p className="mb-1 text-caption font-bold tracking-label text-brand">{eyebrow}</p>
        <h2 className="text-2xl leading-tight font-medium text-ink">{title}</h2>
      </div>
      <Link className="shrink-0 text-caption font-medium text-ink hover:text-brand" to="/shop">
        전체 보기
      </Link>
    </div>
  )
}

function ReviewCard({ product, copy }) {
  return (
    <article className="overflow-hidden rounded-md border border-border-soft bg-surface">
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <img className="h-full w-full object-cover" src={product.image} alt="" />
        <span className="absolute bottom-2 right-2 rounded-sm bg-navy/75 px-1.5 py-0.5 text-caption font-bold text-surface">
          +1
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="line-clamp-3 min-h-copy text-body-sm leading-snug text-foreground">{copy}</p>
        <div className="mt-4 flex items-center gap-3 border-t border-border-soft pt-3">
          <img className="object-cover rounded-sm size-8" src={product.image} alt="" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="truncate text-body-sm font-extrabold text-ink">{product.name}</h3>
            <p className="mt-0.5 text-caption font-semibold text-muted">
              <span className="text-brand">★ {product.rating}</span>
              <span className="mx-1" aria-hidden="true">|</span>
              <span>리뷰 {product.reviews}</span>
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
    <section className="w-full">
      <div className="relative h-hero w-full overflow-hidden bg-navy text-white max-sm:h-hero-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
              index === activeSlideIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--color-navy) 96%, transparent) 0%, color-mix(in srgb, var(--color-navy) 86%, transparent) 46%, color-mix(in srgb, var(--color-navy) 58%, transparent) 100%), url(${slide.image})`,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="layout-container relative z-10 h-full pt-12 pb-14 max-md:pt-10 max-sm:pt-8">
          <div className="max-w-prose">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
                  index === activeSlideIndex ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
                }`}
              >
                <p className="mb-5 inline-flex h-5 max-w-full items-center bg-brand px-3 text-caption font-bold tracking-label max-md:min-w-0 max-md:w-full">
                  {slide.label}
                </p>
                <h1 className="text-5xl leading-tight font-light tracking-label max-md:text-4xl max-sm:text-3xl">
                  {slide.title}
                </h1>
                <p className="mt-8 max-w-prose text-body leading-relaxed font-medium text-on-navy">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link className="inline-flex h-12 items-center justify-center rounded-sm bg-brand px-8 text-body-sm font-bold text-white hover:bg-brand-hover" to={slide.primaryCta.to}>
                    {slide.primaryCta.label}
                  </Link>
                  <Link className="inline-flex h-12 items-center justify-center rounded-sm border border-white/35 px-8 text-body-sm font-bold text-white hover:bg-surface/10" to={slide.secondaryCta.to}>
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
              className={`size-2 rounded-full transition-colors ${index === activeSlideIndex ? 'bg-brand' : 'bg-surface/45 hover:bg-surface/75'}`}
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
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ROLE_ADMIN'

  console.log("현재 스토어의 유저 정보:", user);
  const handleWishlistClick = (product) => {
  }
  const handleAddToCartClick = (product) => {
  }

  const homeProducts = productCatalog.slice(0, 6)

  return (
    <>
        <HeroBanner slides={heroSlides} />

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

        <section className="layout-container mt-16">
          <SectionHeader eyebrow="최신 상품" title="신규 입고" />
          <div className="a11y-grid-4col grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {homeProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                to={`/shop/${product.id}`}
                onWishlistClick={handleWishlistClick}
                onAddToCartClick={handleAddToCartClick}
              />
            ))}
          </div>
        </section>

        <section className="layout-container mt-16">
          <SectionHeader eyebrow="임직원 추천" title="베스트 셀러" />
          <div className="a11y-grid-4col grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {homeProducts.slice(4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                to={`/shop/${product.id}`}
                onWishlistClick={handleWishlistClick}
                onAddToCartClick={handleAddToCartClick}
              />
            ))}
          </div>
        </section>

        <section className="layout-container mt-24 border-t border-border-soft pt-12 pb-44 max-sm:pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-xl font-medium text-ink">생생한 구매 후기</h2>
            <span className="mx-auto mt-3 block h-0.5 w-16 bg-brand" aria-hidden="true" />
          </div>
          <div className="a11y-grid-5col grid grid-cols-5 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {homeProducts.slice(2).concat(homeProducts.slice(1, 2)).map((product, index) => (
              <ReviewCard key={`${product.id}-${index}`} product={product} copy={reviewCopy[index]} />
            ))}
          </div>
        </section>
    </>
  )
}

export default HomePage