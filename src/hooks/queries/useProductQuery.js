import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchAllProducts, fetchCategoryProducts, fetchProducts } from '../../api/productApi'

export function useCategoryProductsQuery({ categoryId, page = 0, size = 20, sort = 'weight', query = '' }) {
  return useQuery({
    queryKey: ['categoryProducts', categoryId, page, size, sort, query],
    queryFn: () => fetchCategoryProducts({ categoryId, page, size, sort, query }),
    enabled: Boolean(categoryId),
    placeholderData: keepPreviousData,
  })
}

export function useProductsQuery({ keyword = '', page = 0, size = 20, sort = 'weight' }) {
  return useQuery({
    queryKey: ['products', keyword, page, size, sort],
    queryFn: () => fetchProducts({ keyword, page, size, sort }),
    enabled: Boolean(keyword),
    placeholderData: keepPreviousData,
  })
}

export function useHomeProductsQuery({ page = 0, size = 8, sort = 'weight' } = {}) {
  return useQuery({
    queryKey: ['homeProducts', page, size, sort],
    queryFn: () => fetchAllProducts({ page, size, sort }),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
