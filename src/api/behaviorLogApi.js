import axiosInstance from './axiosInstance.js';

export const sendBehaviorLog = async ({ productId, actionType, stayDuration = 0, referenceId = null }) => {
    await axiosInstance.post('/api/logs/behavior', {
        productId: Number(productId),
        actionType,
        stayDuration: stayDuration ?? null,
        referenceId,
        eventTimeStamp: new Date().toISOString(),
    });
}