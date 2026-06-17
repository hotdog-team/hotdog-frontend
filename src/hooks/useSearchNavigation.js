import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { addRecentSearch } from '../utils/recentSearchStorage.js'

export function buildSearchPath(keyword) {
  const trimmed = keyword.trim()
  if (!trimmed) return '/shop'
  return `/shop?query=${encodeURIComponent(trimmed)}&sort=RECOMMEND&page=0`
}

export function useSearchNavigation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const userId = user?.memberId || user?.id || user?.email || 'guest'

  const logAndSaveSearch = useCallback(
    async (keyword, { saveRecent = true } = {}) => {
      const trimmed = keyword.trim()
      if (!trimmed) return

      if (saveRecent) {
        addRecentSearch(userId, trimmed)
      }

      try {
        await axiosInstance.post(`/api/search/log?keyword=${encodeURIComponent(trimmed)}`)
        queryClient.invalidateQueries({ queryKey: ['popularSearchKeywords'] })
      } catch (error) {
        console.error('검색어 로깅 실패:', error)
      }
    },
    [queryClient, userId],
  )

  const executeSearch = useCallback(
    async (keyword, options) => {
      const trimmed = keyword.trim()
      if (!trimmed) return

      await logAndSaveSearch(trimmed, options)
      navigate(buildSearchPath(trimmed))
    },
    [logAndSaveSearch, navigate],
  )

  return { executeSearch, logAndSaveSearch, buildSearchPath, userId }
}
