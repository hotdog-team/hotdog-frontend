import { useAccessibility } from '../../../context/AccessibilityContext';

export default function MyA11ySettings() {
    const { settings, setSettings, save } = useAccessibility();
    const previewClass = {
        1: 'text-[100%]',
        2: 'text-[112.5%]',  // index.css랑 맞춤
        3: 'text-[125%]',
        4: 'text-[150%]',
        5: 'text-[200%]',
    }
    const steps = [1, 2, 3, 4, 5];


    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink tracking-tight">내 화면 설정</h1>
                    <p className="mt-2 text-md text-muted">설정을 통하여 홈페이지를 환경에 맞게 조정할 수 있습니다.</p>
                </div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-10 shadow-sm">
                <fieldset className="a11y-choice-chip-field flex flex-col gap-2" aria-describedby="font-size-desc">
                    <legend className="a11y-choice-chip-legend text-base font-bold text-gray-700 block">글자 크기 설정</legend>
                    <p id="font-size-desc" className="text-sm text-gray-400">글자 크기를 1단계에서 5단계까지 조절합니다.</p>
                    <div className="flex items-center gap-3 mt-4 bg-gray-100 rounded-full">
                        {steps.map((level) => {
                            const isSelected = settings.fontSizeStep === level;
                            const inputId = `font-size-step-${level}`;

                            return (
                                <label
                                    key={level}
                                    htmlFor={inputId}
                                    className="flex-1 flex items-center justify-center p-1 rounded-full cursor-pointer outline-none has-focus-visible:ring-2"
                                >
                                    <input
                                        type="radio"
                                        id={inputId}
                                        name="fontSizeStep"
                                        value={level}
                                        checked={isSelected}
                                        aria-label={`글자 크기 ${level}단계`}
                                        onChange={() => {
                                            const next = { ...settings, fontSizeStep: Number(level) };
                                            setSettings(next);
                                            save(next).catch(() => {});
                                        }}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-11 h-11 aspect-square rounded-full flex items-center justify-center text-base transition-all ${
                                            isSelected
                                                ? 'text-white bg-brand shadow-sm font-semibold'
                                                : 'text-gray-600 bg-white hover:text-white hover:bg-brand'
                                        }`}
                                    >
                                        <span className={`select-none ${previewClass[level]}`}>가</span>
                                    </div>
                                </label>
                            );
                        })}

                    </div>
                </fieldset>
                <div className="flex gap-2 mt-10 items-center justify-between">
                <div>
                    <h2 id="high-contrast-heading" className="text-base font-bold text-gray-700 block">고대비 모드</h2>
                    <p id="high-contrast-desc" className="text-sm text-gray-400">텍스트의 가독성을 높입니다.</p>
                </div>
                    <div>
                        <button
                            role="switch"
                            aria-checked={settings.highContrastEnabled}
                            aria-labelledby="high-contrast-heading"
                            aria-describedby="high-contrast-desc"
                            onClick={() => {
                                const next = { ...settings, highContrastEnabled: !settings.highContrastEnabled };
                                setSettings(next);
                                save(next).catch(() => {});
                            }}
                            className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                                settings.highContrastEnabled ? 'bg-brand' : 'bg-gray-200'
                            }`}
                        >
                            <div
                                aria-hidden="true"
                                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                                    settings.highContrastEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2 mt-10 justify-between">
                <div>
                    <h2 id="screen-reader-heading" className="text-base font-bold text-gray-700 block">스크린 리더 최적화</h2>
                    <p id="screen-reader-desc" className="text-sm text-gray-400">화면 낭독기 환경에 최적화합니다.</p>
                </div>
                    <div>
                        <button
                            role="switch"
                            aria-checked={settings.screenReaderOptimized}
                            aria-labelledby="screen-reader-heading"
                            aria-describedby="screen-reader-desc"
                            onClick={() => {
                                const next = { ...settings, screenReaderOptimized: !settings.screenReaderOptimized };
                                setSettings(next);
                                save(next).catch(() => {});
                            }}
                            className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                                settings.screenReaderOptimized ? 'bg-brand' : 'bg-gray-200'
                            }`}
                        >
                            <div
                                aria-hidden="true"
                                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                                    settings.screenReaderOptimized ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}