import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  fetchCategoryProducts,
  fetchProducts,
  fetchProductDetail,
  fetchRelatedProducts,
  fetchProductsByMetaTags,
} from '../../api/productApi';

const listFilterKey = ({ minPrice, maxPrice }) => [minPrice ?? null, maxPrice ?? null]

/**
 * 카테고리별 상품 목록 조회
 */
export function useCategoryProductsQuery({
  categoryId,
  page = 0,
  size = 20,
  sort = 'RECOMMEND',
  keyword = '',
  minPrice,
  maxPrice,
}) {
  return useQuery({
    queryKey: ['categoryProducts', categoryId, page, size, sort, keyword, ...listFilterKey({ minPrice, maxPrice })],
    queryFn: () => fetchCategoryProducts({ categoryId, page, size, sort, keyword, minPrice, maxPrice }),
    enabled: Boolean(categoryId),
    placeholderData: keepPreviousData,
  })
}

/**
 * 상품 검색 및 상품 목록 조회
 */
export function useProductsQuery({
  keyword = '',
  page = 0,
  size = 20,
  sort = 'RECOMMEND',
  minPrice,
  maxPrice,
}) {
  return useQuery({
    queryKey: ['products', keyword, page, size, sort, ...listFilterKey({ minPrice, maxPrice })],
    queryFn: () => fetchProducts({ keyword, page, size, sort, minPrice, maxPrice }),
    enabled: Boolean(keyword),
    placeholderData: keepPreviousData,
  })
}

/**
 * 상품 상세 정보 조회
 */
export function useProductDetailQuery(productId) {
  return useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => fetchProductDetail(productId),
    enabled: Boolean(productId),
  });
}

/**
 * 맞춤 추천 상품 목록 조회
 */
export function useRecommendProductsQuery({
  page = 0,
  size = 20,
  sort = 'RECOMMEND',
  minPrice,
  maxPrice,
} = {}) {
  return useQuery({
    queryKey: ['recommendProducts', page, size, sort, ...listFilterKey({ minPrice, maxPrice })],
    queryFn: () => fetchProducts({ page, size, sort, minPrice, maxPrice }),
    placeholderData: keepPreviousData,
  })
}

/**
 * 메인 페이지 상품 목록 조회
 */
export function useHomeProductsQuery({ page = 0, size = 20, sort = 'RECOMMEND', enabled = true } = {}) {
  return useQuery({
    queryKey: ['homeProducts', page, size, sort],
    queryFn: () => fetchProducts({ page, size, sort }),
    enabled,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

/**
 * 메타태그 기반 상품 목록 조회
 */
export function useMetaTagProductsQuery({ metaTagIds = [], match = 'any', page = 0, size = 20, sort = 'RECOMMEND' } = {}) {
  return useQuery({
    queryKey: ['metaTagProducts', metaTagIds, match, page, size, sort],
    queryFn: () => fetchProductsByMetaTags({ metaTagIds, match, page, size, sort }),
    enabled: metaTagIds.length > 0,
    placeholderData: keepPreviousData,
  })
}

/**
 * 관련 상품 조회
 */
export function useRelatedProductsQuery(productId) {
  return useQuery({
    queryKey: ['relatedProducts', productId],
    queryFn: () => fetchRelatedProducts(productId),
    enabled: Boolean(productId),
  })
}
