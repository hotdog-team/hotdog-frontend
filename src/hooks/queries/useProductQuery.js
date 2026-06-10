import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchCategoryProducts, fetchProducts, fetchProductDetail, fetchRelatedProducts, } from '../../api/productApi';

/**
 * 카테고리별 상품 목록 조회
 */
export function useCategoryProductsQuery({ categoryId, page = 0, size = 20, sort = 'weight', query = '' }) {
  return useQuery({
    queryKey: ['categoryProducts', categoryId, page, size, sort, query],
    queryFn: () => fetchCategoryProducts({ categoryId, page, size, sort, query }),
    enabled: Boolean(categoryId),
    placeholderData: keepPreviousData,
  })
}
/**
 * 상품 검색 및 상품 목록 조회
 */
export function useProductsQuery({ keyword = '', page = 0, size = 20, sort = 'weight' }) {
  return useQuery({
    queryKey: ['products', keyword, page, size, sort],
    queryFn: () => fetchProducts({ keyword, page, size, sort }),
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
 * 메인 페이지 상품 목록 조회
 */
export function useHomeProductsQuery({ page = 0, size = 12, sort = 'weight' } = {}) {
  return useQuery({
    queryKey: ['homeProducts', page, size, sort],
    queryFn: () => fetchProducts({ page, size, sort }),
    staleTime: 1000 * 60 * 5,
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
