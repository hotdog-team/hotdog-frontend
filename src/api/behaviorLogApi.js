import axiosInstance from './axiosInstance.js';
import { getAccessToken } from './apiClient.js';

// 행동 로그 저장
export const sendBehaviorLog = async ({ productId, actionType, stayDuration = 0, referenceId = null }) => {
    if (!getAccessToken()) {
        return;
    }

    await axiosInstance.post('/api/logs/behavior', {
        productId: Number(productId),
        actionType,
        stayDuration: stayDuration ?? null,
        referenceId,
        eventTimeStamp: new Date().toISOString(),
    });
}

// Dislike 숨김 처리를 제거
export const clearDislikeHide = async (productId) => {
    if (!getAccessToken()) {
        return;
    }

    await axiosInstance.delete('/api/logs/dislike-hide', {
        params: { productId: Number(productId) },
    });
}