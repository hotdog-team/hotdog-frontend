export const categoryCatalog = [
  {
    code: 'appliance',
    label: '가전제품',
    navLabel: '가전',
    description: '업무와 생활의 효율을 높이는 프리미엄 가전 제품 큐레이션입니다.',
    heroTitle: '프리미엄 키친 업그레이드',
    heroDescription: '이번 달, 스마트 오븐과 오디오 제품을 임직원 혜택가로 만나보세요.',
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1600&q=80',
  },
  {
    code: 'health',
    label: '건강식품',
    navLabel: '건강',
    description: '바쁜 근무 일정 속에서도 건강한 루틴을 유지할 수 있는 상품입니다.',
    heroTitle: '매일 챙기는 웰니스 루틴',
    heroDescription: '영양제, 건강 간식, 회복 아이템을 임직원 전용 조건으로 준비했습니다.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80',
  },
  {
    code: 'travel',
    label: '여행 상품',
    navLabel: '여행',
    description: '출장과 휴가를 더 편하게 만들어 주는 여행 상품 모음입니다.',
    heroTitle: '이동 시간을 더 가볍게',
    heroDescription: '캐리어, 백팩, 여행 필수품을 합리적인 혜택가로 만나보세요.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
  },
  {
    code: 'gift',
    label: '선물',
    navLabel: '선물',
    description: '동료와 가족에게 전하기 좋은 실용적인 선물 큐레이션입니다.',
    heroTitle: '감사의 마음을 더 세련되게',
    heroDescription: '기념일과 시즌 선물에 어울리는 프리미엄 아이템을 모았습니다.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1600&q=80',
  },
  {
    code: 'education',
    label: '교육',
    navLabel: '교육',
    description: '성장과 학습을 지원하는 교육 상품 및 디지털 콘텐츠입니다.',
    heroTitle: '꾸준한 성장을 위한 선택',
    heroDescription: '업무 역량과 개인 성장을 돕는 교육 혜택을 확인해 보세요.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
  },
  {
    code: 'wellness',
    label: '웰니스',
    navLabel: '웰니스',
    description: '몸과 마음의 균형을 돕는 웰니스 상품입니다.',
    heroTitle: '오늘의 컨디션을 더 편안하게',
    heroDescription: '회복, 휴식, 데스크 웰니스 상품을 임직원 혜택가로 만나보세요.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
  },
]

export const productCatalog = [
  {
    id: 'ergonomic-mesh-chair',
    badge: '임직원 전용',
    brand: 'ProWork',
    type: '사무용 의자',
    category: '사무용 가구',
    categoryCode: 'appliance',
    name: '에어로프로 메쉬 하이백 인체공학 의자',
    description: '장시간 근무에도 자세를 안정적으로 지지하는 메쉬 하이백 의자입니다. 조절식 요추 지지대와 통기성 소재로 업무 공간을 편안하게 유지합니다.',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80',
    price: '$299.00',
    rating: '4.8',
    reviews: 128,
    tags: ['인체공학', '의자', '사무용', '요추 지지'],
  },
  {
    id: 'wavekeys-keyboard',
    badge: '베스트셀러',
    brand: 'LogiWorks',
    type: '액세서리',
    category: '키보드 및 마우스',
    categoryCode: 'appliance',
    name: '웨이브키 무선 스플릿 키보드',
    description: '손목 각도를 자연스럽게 유지하도록 설계된 무선 스플릿 키보드입니다. 사무실과 재택 근무 환경 모두에 잘 맞습니다.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    price: '$129.50',
    rating: '4.7',
    reviews: 96,
    tags: ['인체공학', '키보드', '무선', '액세서리'],
  },
  {
    id: 'dual-monitor-arm',
    badge: '',
    brand: 'ProWork',
    type: '워크스페이스',
    category: '데스크 액세서리',
    categoryCode: 'appliance',
    name: '프로리프트 듀얼 모니터 조절식 가스 스프링 암',
    description: '듀얼 모니터를 원하는 높이와 각도로 정렬해 데스크 공간을 넓게 쓸 수 있는 모니터 암입니다.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    price: '$89.00',
    rating: '4.6',
    reviews: 74,
    tags: ['모니터', '데스크', '인체공학', '워크스페이스'],
  },
  {
    id: 'underdesk-footrest',
    badge: '신상품',
    brand: 'ComfyTrend',
    type: '웰니스',
    category: '웰니스',
    categoryCode: 'wellness',
    name: '컴피트레드 조절식 경사형 데스크 하단 발받침',
    description: '앉은 자세의 부담을 줄이는 각도 조절형 발받침입니다. 데스크 아래에서 자연스럽게 다리 움직임을 유도합니다.',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80',
    price: '$45.00',
    rating: '4.5',
    reviews: 51,
    tags: ['발받침', '웰니스', '조절 가능', '데스크'],
  },
  {
    id: 'standing-desk-360',
    badge: '',
    brand: 'Elevate',
    type: '가구',
    category: '사무용 가구',
    categoryCode: 'appliance',
    name: '엘리베이트360 전동 스탠딩 데스크',
    description: '메모리 프리셋으로 앉은 자세와 선 자세를 빠르게 전환할 수 있는 전동 스탠딩 데스크입니다.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80',
    price: '$449.00',
    rating: '4.9',
    reviews: 142,
    tags: ['스탠딩 데스크', '전동', '인체공학', '사무용'],
  },
  {
    id: 'vertical-wireless-mouse',
    badge: '',
    brand: 'LogiWorks',
    type: '액세서리',
    category: '키보드 및 마우스',
    categoryCode: 'appliance',
    name: '리스티즈 버티컬 무선 마우스',
    description: '손목 회전을 줄이는 버티컬 디자인의 무선 마우스입니다. 정밀 센서와 긴 배터리 수명을 제공합니다.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
    price: '$74.99',
    rating: '4.6',
    reviews: 88,
    tags: ['마우스', '버티컬', '무선', '인체공학'],
  },
  {
    id: 'vitamin-c-serum',
    badge: '추천',
    brand: 'Wellbeing Lab',
    type: '스킨케어',
    category: '건강식품',
    categoryCode: 'health',
    name: '비타민 C 세럼',
    description: '산뜻한 사용감의 데일리 비타민 C 세럼입니다.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    price: '$39.00',
    rating: '4.7',
    reviews: 64,
    tags: ['비타민 C', '세럼', '건강식품'],
  },
  {
    id: 'noise-canceling-headphones',
    badge: '인기',
    brand: 'FocusFlow',
    type: '오디오',
    category: '가전제품',
    categoryCode: 'appliance',
    name: '노이즈 캔슬링 헤드폰',
    description: '몰입 업무와 이동 시간을 위한 무선 노이즈 캔슬링 헤드폰입니다.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    price: '$320.00',
    rating: '4.8',
    reviews: 120,
    tags: ['헤드폰', '오디오', '무선'],
  },
  {
    id: 'travel-backpack',
    badge: '',
    brand: 'CarryOn',
    type: '여행',
    category: '여행 상품',
    categoryCode: 'travel',
    name: '이지 트래블 백팩',
    description: '출장과 짧은 여행에 필요한 수납을 갖춘 프리미엄 백팩입니다.',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80',
    price: '$155.00',
    rating: '4.8',
    reviews: 120,
    tags: ['여행', '백팩', '출장'],
  },
  {
    id: 'signature-watch',
    badge: '',
    brand: 'D-TO Select',
    type: '선물',
    category: '선물',
    categoryCode: 'gift',
    name: '시그니처 시리즈 워치',
    description: '선물하기 좋은 미니멀 디자인의 시그니처 워치입니다.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80',
    price: '$195.00',
    rating: '4.8',
    reviews: 120,
    tags: ['선물', '워치', '시계'],
  },
]

export const popularKeywords = ['비타민 C', '인체공학 의자', '시즌별 선물', '홈짐 용품']

export const recentKeywords = ['인체공학 마우스', '노이즈 캔슬링 헤드폰', '유기농 커피 캡슐']

export const recommendedKeywords = ['비타민 C 세럼', '인체공학 의자', '무선 헤드폰']

export const recommendedCategories = [
  { categoryCode: 'appliance', label: '가전제품', detail: '오디오' },
  { categoryCode: 'wellness', label: '웰니스', detail: '영양제' },
]

export const quickCategories = [
  {
    categoryCode: 'appliance',
    label: '전자제품',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80',
  },
  {
    categoryCode: 'health',
    label: '건강식품',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80',
  },
  {
    categoryCode: 'travel',
    label: '여행 특가',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
  },
  {
    categoryCode: 'wellness',
    label: '웰니스',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80',
  },
]

export function getCategoryByCode(categoryCode) {
  return categoryCatalog.find((category) => category.code === categoryCode)
}

export function getProductById(productId) {
  return productCatalog.find((product) => product.id === productId)
}

export function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase('ko-KR')
}

export function findExactProductByName(value) {
  const normalizedValue = normalizeSearchValue(value)
  return productCatalog.find((product) => normalizeSearchValue(product.name) === normalizedValue)
}

export function searchProducts(query) {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  return productCatalog.filter((product) => {
    const searchableValues = [product.name, product.brand, product.type, product.category, ...product.tags]
    return searchableValues.some((value) => normalizeSearchValue(value).includes(normalizedQuery))
  })
}

export function getProductsByCategory(categoryCode) {
  if (!categoryCode) {
    return productCatalog
  }

  return productCatalog.filter((product) => product.categoryCode === categoryCode)
}

export function getSearchSuggestions(query) {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return []
  }

  const exactProduct = findExactProductByName(query)
  const productSuggestions = exactProduct
    ? [{ type: 'product', label: exactProduct.name, productId: exactProduct.id }]
    : productCatalog
        .filter((product) => normalizeSearchValue(product.name).includes(normalizedQuery))
        .slice(0, 2)
        .map((product) => ({ type: 'product', label: product.name, productId: product.id }))

  const keywordSuggestions = recommendedKeywords
    .filter((keyword) => normalizeSearchValue(keyword).includes(normalizedQuery) || normalizedQuery.length >= 1)
    .slice(0, 3)
    .map((keyword) => ({ type: 'keyword', label: keyword }))

  return [...productSuggestions, ...keywordSuggestions].slice(0, 3)
}

export function parseProductPrice(price) {
  const numericPrice = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numericPrice) ? numericPrice : 0
}

export function getPriceBounds(products) {
  const prices = products.map((product) => parseProductPrice(product.price))

  if (prices.length === 0) {
    return { min: 0, max: 0 }
  }

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}

export function getAvailableBrands(products) {
  return Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort()
}

export function getAvailableFeatures(products) {
  const featurePriority = ['인체공학', '무선', '조절 가능', '요추 지지', '메쉬', '전동', '오디오', '여행']
  const productTags = new Set(products.flatMap((product) => product.tags ?? []))
  const prioritizedFeatures = featurePriority.filter((feature) => productTags.has(feature))
  const remainingFeatures = Array.from(productTags).filter((feature) => !featurePriority.includes(feature)).sort()

  return [...prioritizedFeatures, ...remainingFeatures].slice(0, 8)
}

export function filterProducts(products, filters) {
  const selectedBrands = filters.brands ?? []
  const selectedFeatures = filters.features ?? []
  const selectedCategoryCodes = filters.categoryCodes ?? []
  const minPrice = Number(filters.minPrice)
  const maxPrice = Number(filters.maxPrice)

  return products.filter((product) => {
    const productPrice = parseProductPrice(product.price)
    const isInPriceRange = productPrice >= minPrice && productPrice <= maxPrice
    const matchesCategory = selectedCategoryCodes.length === 0 || selectedCategoryCodes.includes(product.categoryCode)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesFeature = selectedFeatures.length === 0 || selectedFeatures.some((feature) => product.tags?.includes(feature))

    return isInPriceRange && matchesCategory && matchesBrand && matchesFeature
  })
}
