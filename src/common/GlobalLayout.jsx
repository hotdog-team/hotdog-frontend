import { Outlet } from 'react-router';
import GlobalHeader from "./components/GlobalHeader.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";

export default function GlobalLayout() {
    return(
        <div className="min-h-screen flex flex-col text-foreground bg-page text-body">
            <GlobalHeader/>
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
            <GlobalFooter/>
        </div>
    );
}
