//baseURL 설정 - Vite API BASE URL에서 가져옴
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

//json 설정 api 통해서 받아옴
export async function getAccessibilitySettings({ token } = {}){
    const res = await fetch(`${BASE_URL}/api/accessibility`, {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           ...(token ? { Authorization: `Bearer ${token}` } : {}),
       },
    });
    if(!res.ok){
        throw new Error(`API ${res.status} ${res.statusText}`);
    }
    return res.json();
}

//json 설정을 업데이트한다
export async function updateAccessibilitySettings(payload, { token } = {}) {
    const res = await fetch(`${BASE_URL}/api/accessibility`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        body: JSON.stringify({
            fontSizeStep: payload.fontSizeStep,
            highContrastEnabled: payload.highContrastEnabled,
            screenReaderOptimized: payload.screenReaderOptimized,
        }),
    });
    if (!res.ok) {
        throw new Error(`API ${res.status} ${res.statusText}`);
    }
    return res.json();
}