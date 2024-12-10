import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
 
interface InfluencerData {
  id: string
  name: string
  followers: number
  engagement_rate: number
  platform_metrics: Record<string, any>
}
 
interface ApiResponse {
  data: InfluencerData[]
  meta: {
    total_pages: number
    current_page: number
    per_page: number
  }
}
 
export const useInfluencerData = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isError,
        error
    } = useInfiniteQuery<ApiResponse>({
        queryKey: ['influencers'],
        queryFn: async ({ pageParam = 1 }) => {
        const response = await axios.get('/api/v1/influencer_analytics', {
            params: {
            page: pageParam,
            per_page: window.innerWidth < 768 ? 25 : 50
            }
        })
        return response.data
    },
    getNextPageParam: (lastPage) => {
        if (lastPage.meta.current_page < lastPage.meta.total_pages) {
        return lastPage.meta.current_page + 1
        }
        return undefined
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    })

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isError,
        error
    }
}