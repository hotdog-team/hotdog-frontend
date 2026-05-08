import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSizeStep: 1,
    highContrastEnabled: false,
    screenReaderOptimized: false
  });

  // 페이지 로드 시 백엔드에서 접근성 설정 가져오기
  useEffect(() => {
    fetch('/api/accessibility')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, setSettings }}>
      <div className={`
        ${settings.highContrastEnabled ? 'high-contrast' : ''}
        text-step-${settings.fontSizeStep}
      `}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};