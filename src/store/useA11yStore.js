import { create } from 'zustand';
import { getAccessibilitySettings, updateAccessibilitySettings } from '../api/accessibilityApi';

//default a11y Settings
const defaultA11ySettings = {
    fontSizeStep: 1,
    highContrastEnabled: false,
    screenReaderOptimized: false,
};

//accessToken을 불러와 return, 만약 명시한 token이 있다면 해당 token을, 아니라면 localStorage 내의 토큰 반환
function resolveAccessToken(explicitToken) {
    if (explicitToken) return explicitToken
    try {
        return localStorage.getItem('accessToken');
    } catch {
        return null;
    }
}

export const useA11yStore = create((set) => ({
    settings: defaultA11ySettings, //기본 설정(비회원 등)
    error: null,
        //부분 업데이트한다(partial)
        setSettings: (partial) => {
        set((state) => ({
            settings: { ...state.settings, ...partial },
        }))
    },
    //토큰을 통한 settings(설정 불러오기)
    hydrate: async (token) => {
        set({ error: null })
        try {
            const accessToken = resolveAccessToken(token);
            const data = await getAccessibilitySettings({ token: accessToken });
            set({
                settings: {
                    fontSizeStep: data.fontSizeStep ?? 1,
                    highContrastEnabled: !!data.highContrastEnabled,
                    screenReaderOptimized: !!data.screenReaderOptimized,
                },
            })
            return data
        } catch (e) {
            set({ error: e })
            throw e
        }
    },
    //설정 저장하기(token 사용)
    save: async (nextSettings, token) => {
        set({ error: null })
        try {
            const payload = {
                fontSizeStep: nextSettings.fontSizeStep,
                highContrastEnabled: nextSettings.highContrastEnabled,
                screenReaderOptimized: nextSettings.screenReaderOptimized,
            }
            const accessToken = resolveAccessToken(token);
            const data = await updateAccessibilitySettings(payload, { token: accessToken });
            set({
                settings: {
                    fontSizeStep: data.fontSizeStep ?? payload.fontSizeStep ?? 1,
                    highContrastEnabled: !!data.highContrastEnabled,
                    screenReaderOptimized: !!data.screenReaderOptimized,
                },
            })
            return data;
        } catch (e) {
            set({ error: e })
            throw e;
        }
    },

}));