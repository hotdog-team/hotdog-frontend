import axiosInstance from './axiosInstance'
import {sendBehaviorLog} from "./behaviorLogApi.js";

export const getBookmarks = async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/bookmarks', {
        params: { page, size },
    })
    return response.data
}

export const addBookmark = async (productId) => {
    const response = await axiosInstance.post(`/api/bookmarks/${productId}`)
    try {
        await sendBehaviorLog({ productId: productId, actionType: 'BOOKMARK' });
    } catch {}
    return response.data
}

export const removeBookmark = async (productId) => {
    const response = await axiosInstance.delete(`/api/bookmarks/${productId}`)
    try {
        await sendBehaviorLog({ productId: productId, actionType: 'CANCEL_BOOKMARK' });
    } catch {}
    return response.data
}
