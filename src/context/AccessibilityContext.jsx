/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useA11yStore } from '../store/useA11yStore';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const settings = useA11yStore((state) => state.settings);
  const setSettings = useA11yStore((state) => state.setSettings);
  const hydrate = useA11yStore((state) => state.hydrate);

  //html에 [data-*] 속성을 반영해 CSS로 전역 적용합니다. (예: fontStep → data-font-step)
  useEffect(() => {
    const root = document.documentElement
    root.dataset.fontStep = String(settings.fontSizeStep ?? 1);
    root.dataset.highContrast = String(!!settings.highContrastEnabled);
    root.dataset.screenReader = String(!!settings.screenReaderOptimized);
  }, [settings.fontSizeStep, settings.highContrastEnabled, settings.screenReaderOptimized])

  // 초기 진입 시 서버 설정 동기화
  useEffect(() => {
    hydrate().catch(() => {
    })
  }, [hydrate])

  //useMemo 사용하여 매 렌더시마다 리렌더되지 않도록 처리
  const value = useMemo(() => ({ settings, setSettings }), [settings, setSettings]);

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  )
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility는 AccessibilityProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
