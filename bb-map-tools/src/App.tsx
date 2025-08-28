import LeftBar from "@/features/leftbar/LeftBar";
import TopBar from "@/features/topbar/TopBar";
import MainPage from "@/pages/main/MainPage";
import { getDirectoryData } from "@/store";
import "@styles/tailwind.css";

function App() {
    const map = getDirectoryData();
    return (
        <div
            className="bg-[url(/src/assets/bg.jpg)] bg-center bg-no-repeat bg-cover h-screen w-full text-white"
        >
            <TopBar />
            <div className="w-full h-full flex">
                <LeftBar />
                <div className="w-full m-0.5 mt-14 flex gap-1">
                    {/* data container */}
                    {!map ?
                        <div className="bg-black/70 place-content-center w-full h-full">
                            <h1 className="text-xl place-self-center">No map directory selected</h1>
                        </div>
                        :
                        <div className="w-full">
                            <MainPage/>
                        </div>}
                </div>
            </div>
        </div>
    );
}

export default App;
