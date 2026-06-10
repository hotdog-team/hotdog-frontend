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

    const { data: purposeData } = useQuery({
        queryKey: ['homePurpose', purposeId],
        queryFn: () => fetchProductsByMetaTags({ metaTagIds: [purposeId], sort: 'weight', size: 4 }),
        enabled: Boolean(purposeId),
    })

    const catMerchIds = [...categoryIds, ...merchandisingIds]
    const { data: personalizedData } = useQuery({
        queryKey: ['homePersonalized', catMerchIds],
        queryFn: () => fetchProductsByMetaTags({ metaTagIds: catMerchIds, match: 'all', sort: 'latestWeight', size: 4 }),
        enabled: catMerchIds.length > 0,
    })

    return {
        purposeProducts: purposeData?.content ?? [],
        personalizedProducts: personalizedData?.content ?? [],
    }
}