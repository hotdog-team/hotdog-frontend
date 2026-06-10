import { useQuery } from '@tanstack/react-query'
import { getBookmarks } from '../api/bookmarkApi'
import { useAuthStore } from '../store/useAuthStore'

// bookmarkIds를 가져온다(useQuery사용)
export default function useBookmarkedIds() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    const { data } = useQuery({
        queryKey: ['bookmarkedIds'],
        queryFn: () => getBookmarks(0, 200),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    })

    return new Set(
        (data?.content ?? []).map((b) => Number(b.productId))
    )
}
