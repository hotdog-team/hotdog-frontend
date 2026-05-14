import { useQuery } from '@tanstack/react-query'
import { fetchPopularSearchKeywords } from '../../api/searchApi'

export function usePopularSearchKeywordsQuery() {
  return useQuery({
    queryKey: ['popularSearchKeywords'],
    queryFn: fetchPopularSearchKeywords,
  })
}
