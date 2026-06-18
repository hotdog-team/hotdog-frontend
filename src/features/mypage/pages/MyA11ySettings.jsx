import { useAccessibility } from '../../../context/AccessibilityContext'
import FontSizeStepPicker from '../../../components/a11y/FontSizeStepPicker.jsx'
import { MyPageHeader, MyPagePanel, MyPageSectionTitle, MyPageToggleRow } from '../../../components/mypage/MyPageUi.jsx'

export default function MyA11ySettings() {
  const { settings, setSettings, save } = useAccessibility()

  const updateSettings = (partial) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    save(next).catch(() => {})
  }

  return (
    <>
      <MyPageHeader
        title="개인 화면 설정"
        description="글자 크기와 화면 표시 방식을 조정할 수 있습니다."
      />

      <MyPagePanel className="grid gap-8">
        <fieldset className="min-w-0 border-0 p-0" aria-describedby="font-size-desc">
          <MyPageSectionTitle
            title="글자 크기"
            description="1단계에서 5단계까지 조절할 수 있습니다."
          />
          <p id="font-size-desc" className="sr-only">
            글자 크기 단계를 선택하면 화면 전체 글자 크기가 변경됩니다.
          </p>
          <FontSizeStepPicker
            value={settings.fontSizeStep}
            onChange={(level) => updateSettings({ fontSizeStep: level })}
          />
        </fieldset>

        <div className="grid gap-5">
          <MyPageToggleRow
            id="high-contrast-setting"
            title="고대비 모드"
            description="텍스트와 배경 대비를 높여 가독성을 개선합니다."
            checked={settings.highContrastEnabled}
            onChange={(checked) => updateSettings({ highContrastEnabled: checked })}
          />
          <MyPageToggleRow
            id="screen-reader-setting"
            title="스크린 리더 최적화"
            description="화면 낭독기 사용 환경에 맞게 표시를 조정합니다."
            checked={settings.screenReaderOptimized}
            onChange={(checked) => updateSettings({ screenReaderOptimized: checked })}
          />
        </div>
      </MyPagePanel>
    </>
  )
}
