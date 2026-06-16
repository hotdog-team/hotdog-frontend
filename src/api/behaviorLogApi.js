import axiosInstance from './axiosInstance.js';

// 행동 로그 저장
export const sendBehaviorLog = async ({ productId, actionType, stayDuration = 0, referenceId = null }) => {
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
    await axiosInstance.delete('/api/logs/dislike-hide', {
        params: { productId: Number(productId) },
    });
}