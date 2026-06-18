import { useQuery } from '@tanstack/react-query'

import { fetchProductsByMetaTags } from '../api/productApi'

import { splitProfileTagIds } from '../constants/profileMetaTags'

import axiosInstance from '../api/axiosInstance.js'

import { useAuthStore } from '../store/useAuthStore.js'



export default function useHomeRecommendations() {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)



    const { data: profile } =

        useQuery({

            queryKey: ['myProfile'],

            queryFn: () => axiosInstance.get('/api/members/me').then(r => r.data),

            enabled: isAuthenticated,

        })

    const { purposeId, categoryIds, merchandisingIds } = splitProfileTagIds(profile?.profileTagIds ?? [])



    const purposeTagIds = [...categoryIds, ...(purposeId ? [purposeId] : [])]

    const { data: purposeData } = useQuery({

        queryKey: ['homePurpose', purposeTagIds],

        queryFn: () => fetchProductsByMetaTags({ metaTagIds: purposeTagIds, sort: 'POPULAR', size: 5 }),

        enabled: isAuthenticated && purposeTagIds.length > 0,

    })



    const { data: personalizedData } = useQuery({

        queryKey: ['homePersonalized', merchandisingIds],

        queryFn: () => fetchProductsByMetaTags({ metaTagIds: merchandisingIds, sort: 'ATTENTION', size: 5 }),

        enabled: isAuthenticated && merchandisingIds.length > 0,

    })



    return {

        purposeProducts: (purposeData?.content ?? []).slice(0, 5),

        personalizedProducts: (personalizedData?.content ?? []).slice(0, 5),

        purposeTagIds,

        merchandisingIds,

    }

}

