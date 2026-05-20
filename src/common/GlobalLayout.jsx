import { Outlet } from 'react-router';
import GlobalHeader from "./components/GlobalHeader.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";

export default function GlobalLayout() {
    return(
        <div className="min-h-screen flex flex-col overflow-x-hidden text-foreground bg-page text-body">
            <a className="skip-link" href="#main-content">
                본문 바로가기
            </a>
            <GlobalHeader/>
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
            <GlobalFooter/>
        </div>
    );
}
