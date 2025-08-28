import Button from "@/base/button/Button";
import List from "@/base/list/List";
import TopBar from "@/features/topbar/TopBar";
import { deserializeMapToParts, loadJsonToParts, loadTxtToParts } from "./part-utils";
import { useEffect, useState } from "react";
import { loadMapFromMain, setMap } from "@/store";
import PropContainer from "@/features/prop-container/PropContainer";

const PartList = () => {
    const [activeId, setActiveId] = useState<number>();
    
    useEffect(() => {
        (async () => {
            setMap(await loadMapFromMain() as MapData);
        })();
    }, []);

    return (
        <div className="bg-[url(/src/assets/bg.jpg)] bg-center bg-no-repeat bg-cover h-screen w-full text-white">
            <TopBar />
            <div className="w-full h-full flex">
                <div className="w-full m-0.5 mt-14 flex flex-col gap-1">
                    <div className="flex w-full gap-2 justify-center">
                        <Button
                            className="text-xl"
                            onClick={async () => await loadJsonToParts()}
                        >Load .json</Button>
                        <Button
                            className="text-xl"
                            onClick={loadTxtToParts}
                        >Load .txt</Button>
                        <Button 
                            className="text-xl"
                            onClick={deserializeMapToParts}
                        >Deserialize .bbmap</Button>
                    </div>
                    <List activeId={activeId} setActiveId={setActiveId}/>
                    {activeId !== undefined && <PropContainer id={activeId}/>}
                </div>
            </div>
        </div>
    );
}

export default PartList;