import { apiFetch } from './apiClient.js'

/**
 * 카테고리 상품 목록 조회 URL 생성
 */
function buildCategoryProductsPath({ categoryId, page = 0, size = 20, sort = 'RECOMMEND', keyword = '' }) {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  })

  if (keyword) {
    searchParams.set('keyword', keyword)
  }

  return `/api/categories/${encodeURIComponent(categoryId)}/products?${searchParams.toString()}`
}
/**
 * 상품 목록 조회 URL 생성
 */
function buildProductsPath({ keyword = '', page = 0, size = 20, sort = 'RECOMMEND' }) {
  const searchParams = new URLSearchParams({
    keyword,
    page: String(page),
    size: String(size),
    sort,
  })

  return `/api/products?${searchParams.toString()}`
}

/**
 * 상품 데이터 형식 변환
 */
function normalizeProduct(product) {
  const categoryName = product.categoryName ?? product.category?.name ?? product.category ?? '상품';
  const priceValue = product.salePrice ?? product.price ?? product.originPrice ?? 0;

  return {
    ...product,
    id: String(product.id ?? product.productId ?? ''),
    name: product.name ?? product.productName ?? '이름 없는 상품',
    image: product.image ?? product.imageUrl ?? product.thumbnailUrl ?? product.thumbnail ?? '',
    category: categoryName,
    originPrice: product.originPrice ?? 0,
    discountRate: product.discountRate ?? 0,
    salePrice: product.salePrice ?? priceValue,
    price: typeof priceValue === 'number'
      ? `${priceValue.toLocaleString()}원`
      : String(priceValue),
    deliveryFee: product.deliveryFee ?? 0,
    stockQuantity: product.stockQuantity ?? 0,
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    brand: product.brand ?? '',
    origin: product.origin ?? '',
    specInfo: product.specInfo ?? '',
    altText: product.altText ?? '',
    rating: product.rating ?? product.averageRating ?? 0,
    reviews: product.reviews ?? product.reviewCount ?? 0,
    tags: Array.isArray(product.tags) ? product.tags : [],
    status: product.status ?? '',
  };
}
/**
 * 상품 목록 응답 형식 변환
 */
function normalizePageResponse(responseBody, fallbackSize) {
  const content = Array.isArray(responseBody?.content)
    ? responseBody.content
    : Array.isArray(responseBody)
      ? responseBody
      : []

  return {
    content: content.map(normalizeProduct),
    totalElements: Number(responseBody?.totalElements ?? content.length),
    totalPages: Number(responseBody?.totalPages ?? 1),
    number: Number(responseBody?.number ?? 0),
    size: Number(responseBody?.size ?? fallbackSize),
  }
}
/**
 * 카테고리별 상품 목록 조회
 */
export async function fetchCategoryProducts({ categoryId, page = 0, size = 20, sort = 'RECOMMEND', keyword = '' }) {
  if (!categoryId || isNaN(Number(categoryId))) {
    return normalizePageResponse({ content: [], totalElements: 0, totalPages: 0, number: page, size }, size)
  }

  const responseBody = await apiFetch(
    buildCategoryProductsPath({ categoryId, page, size, sort, keyword }),
  )

  return normalizePageResponse(responseBody, size)
}
/**
 * 상품 검색 및 상품 목록 조회 (keyword 없으면 전체 조회)
 */
export async function fetchProducts({ keyword = '', page = 0, size = 20, sort = 'RECOMMEND' }) {
  const responseBody = await apiFetch(buildProductsPath({ keyword, page, size, sort }))

  return normalizePageResponse(responseBody, size)
}
/**
 * 상품 상세 정보 조회
 */
export async function fetchProductDetail(productId) {
  const responseBody = await apiFetch(`/api/products/${productId}`);

  return normalizeProduct(responseBody);
}
/**
 * 메타태그 기반 상품 목록 조회
 */
export async function fetchProductsByMetaTags({ metaTagIds = [], match = 'any', sort = 'RECOMMEND', size = 4 } = {}) {
  const searchParams = new URLSearchParams({
    sort,
    size: String(size),
  })

  if (match === 'all') searchParams.set('match', 'all')
  metaTagIds.forEach((id) => searchParams.append('metaTagIds', id))

  const responseBody = await apiFetch(`/api/products?${searchParams.toString()}`)

  return normalizePageResponse(responseBody, size)
}
/**
 * 관련 상품 조회
 */
export async function fetchRelatedProducts(productId) {
  const responseBody = await apiFetch(`/api/products/${productId}/related`)

  return Array.isArray(responseBody)
    ? responseBody.map(normalizeProduct)
    : []
}
