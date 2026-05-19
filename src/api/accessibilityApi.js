import { apiFetch } from './apiClient.js'

export async function getAccessibilitySettings({ token, accessToken } = {}) {
  return apiFetch('/api/accessibility', {
    accessToken: accessToken ?? token ?? undefined,
  })
}

export async function updateAccessibilitySettings(payload, { token, accessToken } = {}) {
  return apiFetch('/api/accessibility', {
    method: 'PUT',
    accessToken: accessToken ?? token ?? undefined,
    body: JSON.stringify({
      fontSizeStep: payload.fontSizeStep,
      highContrastEnabled: payload.highContrastEnabled,
      screenReaderOptimized: payload.screenReaderOptimized,
    }),
  })
}
