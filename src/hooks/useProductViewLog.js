import { useEffect, useRef } from 'react';
import { sendBehaviorLog } from '../api/behaviorLogApi';
import { getAccessToken } from '../api/apiClient';
import { onEnter, getStayDuration, isSent, markSent } from '../utils/viewLogStorage';

export function useProductViewLog(productId) {
    const sentRef = useRef(false);

    useEffect(() => {
        if (!productId) return;

        onEnter(productId);
        console.log('[VIEW] 진입', productId);

        const sendViewLog = async () => {
            if (sentRef.current || isSent(productId)) return;

            // 로그인이 되지 않으면 스킵한다
            if(!getAccessToken()) return;

            const stayDuration = getStayDuration(productId);

            console.log('[VIEW] 이탈 시도', {
                productId,
                stayDuration,
                sentRef: sentRef.current,
                isSent: isSent(productId),
                hasToken: !!getAccessToken(),
            });

            if (!productId || stayDuration < 10000) return;

            try {
                await sendBehaviorLog({
                    productId,
                    actionType:'VIEW',
                    stayDuration,
                });
                console.log('[VIEW] 전송 성공', stayDuration);

                markSent(productId);
                sentRef.current = true;
            } catch (e) {
                // 로그 미기록은 사용자에게 알리지 않는다
            }
        };

        return () => { sendViewLog(); };
    }, [productId]);
}