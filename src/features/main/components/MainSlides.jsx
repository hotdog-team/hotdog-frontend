import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pause, Play } from 'lucide-react'

const CAROUSEL_INTERVAL = 7000

export const heroSlides = [
  {
    id: 'workspace',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
    label: '임직원 전용',
    title: '업무에 필요한 것, 한곳에서',
    description: '임직원 전용 할인가로 테크, 생활용품, 웰니스 상품을 구매해 보세요.',
    primaryCta: { label: '쇼핑하기', to: '/shop' },
    secondaryCta: { label: '혜택 보기', to: '/benefits' },
  },
  {
    id: 'wellness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
    label: '건강 · 웰니스',
    title: '하루하루 쌓아가는 건강',
    description: '홈트레이닝, 스트레칭, 데스크 케어까지 임직원 혜택가로 만나보세요.',
    primaryCta: { label: '건강 상품 보기', to: '/shop?category=health' },
    secondaryCta: { label: '추천 혜택', to: '/benefits' },
  },
  {
    id: 'tech',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    label: '테크 · 업무용품',
    title: '일하는 환경이 달라집니다',
    description: '회의, 집중 업무, 이동 중에도 편하게 쓸 수 있는 업무용 디바이스를 골랐습니다.',
    primaryCta: { label: '테크 상품 보기', to: '/shop?category=tech' },
    secondaryCta: { label: '신규 입고', to: '/shop' },
  },
  {
    id: 'gift',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1600&q=80',
    label: '선물 추천',
    title: '고민 없이 고르는 선물',
    description: '동료나 가족에게 전하기 좋은 선물 상품을 D-TO 전용 가격으로 준비했습니다.',
    primaryCta: { label: '선물 보기', to: '/shop?category=gift' },
    secondaryCta: { label: '베스트 셀러', to: '/shop' },
  },
]

export default function MainSlides({ slides = heroSlides }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const activeSlide = slides[activeSlideIndex]
  const sectionRef = useRef(null)

  useEffect(() => {
    if (slides.length < 2 || isPaused) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, CAROUSEL_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [slides.length, isPaused])

  if (!activeSlide) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className="w-full"
      aria-roledescription="carousel"
      aria-label="메인 배너"
    >
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
          <div className="relative h-full max-w-prose">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1}번째 배너: ${slide.title}`}
                aria-hidden={index !== activeSlideIndex}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
                  index === activeSlideIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <p className="mb-5 inline-flex h-5 max-w-full items-center bg-brand px-3 text-caption font-bold tracking-label max-md:min-w-0 max-md:w-full">
                  {slide.label}
                </p>
                <h1 className="text-5xl leading-tight font-bold max-md:text-4xl max-sm:text-3xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-prose text-body leading-relaxed font-medium text-on-navy">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-sm bg-brand px-8 text-body-sm font-bold text-white hover:bg-brand-hover"
                    to={slide.primaryCta.to}
                  >
                    {slide.primaryCta.label}
                  </Link>
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-sm border border-white/35 px-8 text-body-sm font-bold text-white hover:bg-surface/10"
                    to={slide.secondaryCta.to}
                  >
                    {slide.secondaryCta.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-0 bottom-6 left-0 z-20 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={isPaused ? '배너 자동 재생' : '배너 자동 재생 일시정지'}
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex size-6 items-center justify-center rounded-full bg-surface text-brand transition-colors hover:bg-surface/40"
          >
            {isPaused
              ? <Play className="size-3" fill="currentColor" stroke="none" aria-hidden="true" />
              : <Pause className="size-3" fill="currentColor" stroke="none" aria-hidden="true" />
            }
          </button>
          <div role="tablist" aria-label="배너 슬라이드 선택">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                role="tab"
                type="button"
                aria-label={`${index + 1}번째 배너: ${slide.title}`}
                aria-selected={index === activeSlideIndex}
                onClick={() => setActiveSlideIndex(index)}
                className={`mx-1 size-2 rounded-full transition-colors ${index === activeSlideIndex ? 'bg-brand' : 'bg-surface/45 hover:bg-surface/75'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
