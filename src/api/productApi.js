const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function buildCategoryProductsUrl({ categoryId, page = 0, size = 20, sort = 'weight', query = '' }) {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  })

  if (query) {
    searchParams.set('query', query)
  }

  return `${BASE_URL}/api/categories/${encodeURIComponent(categoryId)}/products?${searchParams.toString()}`
}

function buildProductsUrl({ keyword = '', page = 0, size = 20, sort = 'weight' }) {
  const searchParams = new URLSearchParams({
    keyword,
    page: String(page),
    size: String(size),
    sort,
  })

  return `${BASE_URL}/api/products?${searchParams.toString()}`
}

function normalizeProduct(product) {
  const categoryName = product.categoryName ?? product.category?.name ?? product.category ?? '상품'
  const priceValue = product.priceText ?? product.formattedPrice ?? product.price ?? 0

  return {
    ...product,
    id: String(product.id ?? product.productId ?? product.product_id ?? ''),
    name: product.name ?? product.productName ?? '이름 없는 상품',
    image: product.image ?? product.imageUrl ?? product.thumbnailUrl ?? product.thumbnail ?? '',
    category: categoryName,
    price: typeof priceValue === 'number' ? `$${priceValue.toLocaleString()}` : String(priceValue),
    rating: product.rating ?? product.averageRating ?? '0.0',
    reviews: product.reviews ?? product.reviewCount ?? 0,
    brand: product.brand ?? '',
    tags: Array.isArray(product.tags) ? product.tags : [],
  }
}

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

export async function fetchCategoryProducts({ categoryId, page = 0, size = 20, sort = 'weight', query = '' }) {
  if (!categoryId) {
    return normalizePageResponse({ content: [], totalElements: 0, totalPages: 0, number: page, size }, size)
  }

  const response = await fetch(buildCategoryProductsUrl({ categoryId, page, size, sort, query }), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API ${response.status} ${response.statusText}`)
  }

  return normalizePageResponse(await response.json(), size)
}

export async function fetchProducts({ keyword = '', page = 0, size = 20, sort = 'weight' }) {
  if (!keyword) {
    return normalizePageResponse({ content: [], totalElements: 0, totalPages: 0, number: page, size }, size)
  }

  const response = await fetch(buildProductsUrl({ keyword, page, size, sort }), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API ${response.status} ${response.statusText}`)
  }

  return normalizePageResponse(await response.json(), size)
}
