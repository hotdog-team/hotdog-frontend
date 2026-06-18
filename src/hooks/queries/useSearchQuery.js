import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../api/axiosInstance'

export function usePopularSearchKeywordsQuery() {
  return useQuery({
    queryKey: ['popularSearchKeywords'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/search/popular')
      return response.data
    },
    staleTime: 0,
    refetchOnMount: true,
  })
}