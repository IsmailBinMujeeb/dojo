import LeftPanel from "@/components/left-panel";
import RightPanel from "@/components/right-panel";

const PanelWrapper = ({ children }) => {
    return (
        <div className="flex flex-col lg:flex-row w-full h-screen">
            <div className="lg:flex-1 hidden lg:flex justify-center items-center">
                <LeftPanel />
            </div>
            <div className="flex-3 bg-accent max-h-screen overflow-auto">
                {children}
            </div>
            <div className="lg:flex-1 hidden lg:flex w-full m-4">
                <RightPanel />
            </div>
        </div>
    );
};

export default PanelWrapper;
