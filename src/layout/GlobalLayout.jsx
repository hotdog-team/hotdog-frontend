import { Outlet } from 'react-router';
import GlobalHeader from "../components/global/GlobalHeader.jsx";
import GlobalFooter from "../components/global/GlobalFooter.jsx";
import FloatingUtilityButtons from "../components/global/FloatingUtilityButtons.jsx";

export default function GlobalLayout() {
    return(
        <div className="min-h-screen flex flex-col overflow-x-clip bg-page text-foreground">
            <a className="skip-link" href="#main-content">
                본문 바로가기
            </a>
            <GlobalHeader/>
            <main id="main-content" className="flex flex-1 flex-col">
                <Outlet />
            </main>
            <GlobalFooter/>
            <FloatingUtilityButtons />
        </div>
    );
}
