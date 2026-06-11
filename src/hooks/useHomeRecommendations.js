import { useQuery } from '@tanstack/react-query'
import { fetchProductsByMetaTags } from '../api/productApi'
import { splitProfileTagIds } from '../constants/profileMetaTags'
import axiosInstance from '../api/axiosInstance.js'

export default function useHomeRecommendations() {

    const { data: profile } =
        useQuery({
            queryKey: ['myProfile'],
            queryFn: () => axiosInstance.get('/api/members/me').then(r => r.data)
        })
    const { purposeId, categoryIds, merchandisingIds } = splitProfileTagIds(profile?.profileTagIds ?? [])

    const purposeTagIds = [...categoryIds, ...(purposeId ? [purposeId] : [])]
    const { data: purposeData } = useQuery({
        queryKey: ['homePurpose', purposeTagIds],
        queryFn: () => fetchProductsByMetaTags({ metaTagIds: purposeTagIds, sort: 'POPULAR', size: 4 }),
        enabled: purposeTagIds.length > 0,
    })

    const { data: personalizedData } = useQuery({
        queryKey: ['homePersonalized', merchandisingIds],
        queryFn: () => fetchProductsByMetaTags({ metaTagIds: merchandisingIds, sort: 'ATTENTION', size: 4 }),
        enabled: merchandisingIds.length > 0,
    })

    return {
        purposeProducts: purposeData?.content ?? [],
        personalizedProducts: personalizedData?.content ?? [],
        purposeTagIds,
        merchandisingIds,
    }
}