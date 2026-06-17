import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const CAROUSEL_INTERVAL = 7000
const SLIDE_TRANSITION_MS = 280
const SCROLL_STEP = 2
const DRAG_THRESHOLD = 48
const SWIPE_DETECT_THRESHOLD = 8
const SLIDE_GAP_CLASS = 'gap-3'
const LOOP_BUFFER = 4
const SLIDE_WIDTH_SCALE = 1.2

export const heroSlides = [
  {
    id: 'workspace',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=800&q=80',
    title: '데스크테리어의 시작',
    subtitle: '일의 효율을 높이는 오피스 아이템 ~25% 쿠폰',
    to: '/shop',
  },
  {
    id: 'wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    title: '가뿐하게 시작하는 하루',
    subtitle: '홈트부터 릴렉싱 케어까지 단독 특가',
    to: '/shop?categoryId=health',
  },
  {
    id: 'tech',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    title: '일하는 환경의 진화',
    subtitle: '스마트 오피스를 위한 고성능 테크 기기 모음전',
    to: '/shop',
  },
  {
    id: 'gift',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
    title: '마음을 전하는 가장 쉬운 방법',
    subtitle: '센스 있는 선물 추천, D-TO 단독 혜택가',
    to: '/shop?categoryId=gift',
  },
  {
    id: 'education',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80',
    title: '성장하는 나를 위한 투자',
    subtitle: '자기계발 클래스 & 스마트 학습 기기 특가 지원',
    to: '/shop?categoryId=education',
  },
  {
    id: 'travel',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    title: '설레는 여정의 동반자',
    subtitle: '캐리어부터 트래블 필수품까지 한눈에 보기',
    to: '/shop?categoryId=travel',
  },
  {
    id: 'appliance',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    title: '머무는 공간을 더 아름답게',
    subtitle: '삶의 질을 높이는 감성 리빙 & 디자인 가전',
    to: '/shop?categoryId=appliance',
  },
  {
    id: 'desk-care',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    title: '온전한 몰입을 위한 공간',
    subtitle: '인체공학 체어 & 프리미엄 조명 브랜드 연합전',
    to: '/shop',
  },
  {
    id: 'season-sale',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    title: '놓치면 아쉬운 이번 주 기회',
    subtitle: '매주 업데이트되는 한정 수량 오늘끝딜',
    to: '/shop?sort=SALES',
  },
  {
    id: 'new-arrival',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    title: '가장 먼저 만나는 트렌드',
    subtitle: '따끈따끈하게 입고된 이번 주 신규 브랜드',
    to: '/shop?sort=LATEST',
  },
  {
    id: 'member-benefit',
    image: 'https://images.unsplash.com/photo-1577387196112-579d95312c6d?auto=format&fit=crop&w=800&q=80',
    title: '오직 D-TO에서만',
    subtitle: '웰컴 혜택부터 전용 더블 할인 쿠폰팩까지',
    to: '/shop?list=recommend',
  },
]



function getVisibleSlideCount(viewportWidth) {
  if (viewportWidth >= 1280) {
    return 3.15
  }
  if (viewportWidth >= 768) {
    return 2.35
  }
  if (viewportWidth >= 480) {
    return 1.6
  }
  return 1.02
}

function buildLoopSlides(slides, bufferSize = LOOP_BUFFER) {
  if (slides.length <= 1) {
    return slides
  }

  const buffer = Math.min(bufferSize, slides.length)
  const startClones = slides.slice(-buffer).map((slide, index) => ({
    ...slide,
    id: `${slide.id}-clone-start-${index}`,
  }))
  const endClones = slides.slice(0, buffer).map((slide, index) => ({
    ...slide,
    id: `${slide.id}-clone-end-${index}`,
  }))

  return [...startClones, ...slides, ...endClones]
}

function getLoopBuffer(slideCount) {
  return Math.min(LOOP_BUFFER, slideCount)
}

function getRealIndex(loopIndex, slideCount, buffer) {
  if (slideCount <= 1) {
    return 0
  }

  return ((loopIndex - buffer) % slideCount + slideCount) % slideCount
}

function SlideCard({ slide, isActive, shouldSuppressClick }) {
  const content = (
    <>
      <img
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
        src={slide.image}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-4 left-4 z-10 px-5 pb-5 pt-16 text-white">
        <div className="max-w-[60%]">
          <h2 className="line-clamp-2 text-3xl font-semibold leading-[1.25] break-keep">{slide.title}</h2>
          <p className="mt-2 line-clamp-2 text-body-lg leading-[1.45] break-keep text-white/95">
            {slide.subtitle}
          </p>
        </div>
      </div>
    </>
  )

  const className = `relative block h-full w-full overflow-hidden bg-navy text-left ${
    slide.to ? 'transition-opacity hover:opacity-95' : ''
  }`

  const handleClick = (event) => {
    if (shouldSuppressClick?.()) {
      event.preventDefault()
    }
  }

  if (slide.to) {
    return (
      <Link
        to={slide.to}
        className={className}
        tabIndex={isActive ? 0 : -1}
        draggable={false}
        onClick={handleClick}
        onDragStart={(event) => event.preventDefault()}
      >
        {content}
      </Link>
    )
  }

  return <article className={className}>{content}</article>
}

function SlideProgressBar({ slideCount, activeIndex, isPaused, progressKey, scrollStep = 1 }) {
  const progressFrom = (activeIndex / slideCount) * 100
  const progressTo = Math.min(100, ((activeIndex + scrollStep) / slideCount) * 100)

  return (
    <div
      className="h-0.5 flex-1 overflow-hidden bg-border-soft"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={slideCount}
      aria-valuenow={activeIndex + 1}
      aria-label="배너 진행 상태"
    >
      <div
        key={progressKey}
        className={`h-full bg-ink main-slide-progress-fill ${isPaused ? 'is-paused' : ''}`}
        style={{
          '--progress-from': `${progressFrom}%`,
          '--progress-to': `${progressTo}%`,
          '--slide-progress-duration': `${CAROUSEL_INTERVAL}ms`,
        }}
      />
    </div>
  )
}

export default function MainSlides({ slides = heroSlides }) {
  const loopBuffer = getLoopBuffer(slides.length)
  const loopSlides = useMemo(() => buildLoopSlides(slides, LOOP_BUFFER), [slides])
  const canLoop = slides.length > 1
  const [loopIndex, setLoopIndex] = useState(() => (canLoop ? loopBuffer : 0))
  const [isPaused, setIsPaused] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [enableTransition, setEnableTransition] = useState(true)
  const [slideStep, setSlideStep] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)
  const [trackInset, setTrackInset] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const insetMeasureRef = useRef(null)
  const dragStartX = useRef(0)
  const activePointerId = useRef(null)
  const isJumpingRef = useRef(false)
  const suppressClickRef = useRef(false)
  const hasSwipeGestureRef = useRef(false)
  const dragOffsetRef = useRef(0)

  const realIndex = getRealIndex(loopIndex, slides.length, loopBuffer)

  const bumpProgress = useCallback(() => {
    setProgressKey((current) => current + 1)
  }, [])

  const jumpToLoopIndex = useCallback((nextLoopIndex) => {
    isJumpingRef.current = true
    setEnableTransition(false)
    setLoopIndex(nextLoopIndex)
    bumpProgress()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnableTransition(true)
        isJumpingRef.current = false
      })
    })
  }, [bumpProgress])

  const moveBy = useCallback((delta) => {
    if (slides.length === 0) {
      return
    }

    if (!canLoop) {
      setLoopIndex(0)
      return
    }

    setEnableTransition(true)
    setLoopIndex((current) => current + delta)
    bumpProgress()
  }, [bumpProgress, canLoop, slides.length])

  useEffect(() => {
    slides.forEach((slide) => {
      const image = new Image()
      image.src = slide.image
    })
  }, [slides])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const insetMeasure = insetMeasureRef.current
    if (!viewport || !track) {
      return undefined
    }

    const updateStep = () => {
      const styles = window.getComputedStyle(track)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      const visibleCount = getVisibleSlideCount(viewport.clientWidth)
      const gapCount = Math.max(0, Math.ceil(visibleCount) - 1)
      const nextSlideWidth = ((viewport.clientWidth - gap * gapCount) / visibleCount) * SLIDE_WIDTH_SCALE
      const nextInset = insetMeasure
        ? insetMeasure.getBoundingClientRect().left - viewport.getBoundingClientRect().left
        : 0

      setSlideWidth(nextSlideWidth)
      setSlideStep(nextSlideWidth + gap)
      setTrackInset(Math.max(0, nextInset))
    }

    updateStep()
    const observer = new ResizeObserver(updateStep)
    observer.observe(viewport)
    if (insetMeasure) {
      observer.observe(insetMeasure)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!canLoop || isPaused || isDragging) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      moveBy(SCROLL_STEP)
    }, CAROUSEL_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [canLoop, isDragging, isPaused, moveBy])

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== 'transform' || !canLoop || isJumpingRef.current) {
      return
    }

    const slideCount = slides.length

    if (loopIndex < loopBuffer) {
      jumpToLoopIndex(loopIndex + slideCount)
      return
    }

    if (loopIndex >= loopBuffer + slideCount) {
      jumpToLoopIndex(loopIndex - slideCount)
    }
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    suppressClickRef.current = false
    hasSwipeGestureRef.current = false
    activePointerId.current = event.pointerId
    dragStartX.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDragging || activePointerId.current !== event.pointerId) {
      return
    }

    const delta = event.clientX - dragStartX.current
    if (Math.abs(delta) > SWIPE_DETECT_THRESHOLD) {
      hasSwipeGestureRef.current = true
    }

    dragOffsetRef.current = delta
    setDragOffset(delta)
  }

  const finishDrag = (event) => {
    if (!isDragging || activePointerId.current !== event.pointerId) {
      return
    }

    if (hasSwipeGestureRef.current) {
      suppressClickRef.current = true

      const offset = dragOffsetRef.current
      if (offset <= -DRAG_THRESHOLD) {
        moveBy(SCROLL_STEP)
      } else if (offset >= DRAG_THRESHOLD) {
        moveBy(-SCROLL_STEP)
      }
    }

    dragOffsetRef.current = 0
    setDragOffset(0)
    setIsDragging(false)
    activePointerId.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const shouldSuppressClick = useCallback(() => suppressClickRef.current, [])

  if (slides.length === 0) {
    return null
  }

  const translateX = slideStep > 0
    ? trackInset - loopIndex * slideStep + dragOffset
    : trackInset

  const transitionClass = enableTransition && !isDragging
    ? 'transition-transform ease-out motion-reduce:transition-none'
    : ''

  const trackStyle = {
    transform: `translate3d(${translateX}px, 0, 0)`,
    ...(enableTransition && !isDragging
      ? { transitionDuration: `${SLIDE_TRANSITION_MS}ms` }
      : { transitionDuration: '0ms' }),
  }

  return (
    <section className="w-full py-4" aria-roledescription="carousel" aria-label="메인 배너">
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden bg-navy/5 touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div ref={insetMeasureRef} className="layout-container pointer-events-none absolute inset-x-0 top-0 h-0" aria-hidden="true" />
        <div
          ref={trackRef}
          className={`flex ${SLIDE_GAP_CLASS} ${transitionClass}`}
          style={trackStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="aspect-[5/3] h-auto shrink-0 max-sm:aspect-[3/2]"
              style={slideWidth > 0 ? { width: slideWidth } : undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={slide.title}
              aria-hidden={index !== loopIndex}
            >
              <SlideCard
                slide={slide}
                isActive={index === loopIndex}
                shouldSuppressClick={shouldSuppressClick}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="layout-container py-4">
        <div className="flex items-center gap-3">
          <SlideProgressBar
            slideCount={slides.length}
            activeIndex={realIndex}
            isPaused={isPaused}
            progressKey={progressKey}
            scrollStep={SCROLL_STEP}
          />

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center text-ink hover:text-brand focus-ring"
              aria-label="이전 배너"
              onClick={() => moveBy(-SCROLL_STEP)}
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center text-ink hover:text-brand focus-ring"
              aria-label="다음 배너"
              onClick={() => moveBy(SCROLL_STEP)}
            >
              <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center text-ink hover:text-brand focus-ring"
              aria-label={isPaused ? '배너 자동 재생' : '배너 자동 재생 일시정지'}
              onClick={() => setIsPaused((prev) => !prev)}
            >
              {isPaused
                ? <Play className="size-4" fill="currentColor" stroke="none" aria-hidden="true" />
                : <Pause className="size-4" fill="currentColor" stroke="none" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
