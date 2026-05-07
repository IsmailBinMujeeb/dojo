import { Outlet } from "react-router-dom";
import { Protected } from "./components/Protected";
import PanelWrapper from "./components/panel-wrapper";

function Layout() {
    return (
        <Protected>
            <PanelWrapper>
                <Outlet />
            </PanelWrapper>
        </Protected>
    );
}

export default Layout;
