import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBookmarks } from '../api/bookmarkApi'
import { useAuthStore } from '../store/useAuthStore'

export default function useBookmarkedIds() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    const { data } = useQuery({
        queryKey: ['bookmarkedIds'],
        queryFn: () => getBookmarks(0, 200),
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    })

    const bookmarkedIds = useMemo(
        () => new Set((data?.content ?? []).map((b) => Number(b.productId))),
        [data]
    )

    return bookmarkedIds
}
