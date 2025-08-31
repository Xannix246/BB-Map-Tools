import Container from "@/base/container/Container";
import { getDirectory, getId, getMap, setId } from "@/store";
import { getImage, saveAsJson, saveChanges } from "./main-utils";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { SteamManager } from "@utils/SteamManager";
import { openUrl } from "@tauri-apps/plugin-opener";
import UploadModal from "@/features/upload-modal/UploadModal";

const MainPage = () => {
    const map = getMap();
    const dir = getDirectory();
    const [src, setSrc] = useState<string>();
    const id = getId();
    const [totalBlocks, setTotalBlocks] = useState(0);
    const [open, setOpen] = useState(false);
    const steam = new SteamManager();

    useEffect(() => {
        (async () => {
            const image = await getImage();
            if (image) setSrc(image);
        })();
    }, [dir]);

    useEffect(() => {
        if (map && dir) {
            (async () => {
                const searchMap = await steam.search(map.name);
                console.log(searchMap);
                if (searchMap) {
                    setId(searchMap.id.toString());
                } else setId(null);
            })();

            let blocks = 0;
            map.parts?.forEach((part) => blocks += part.length);
            blocks += map.blocks.length;
            setTotalBlocks(blocks);
        }
    }, [map]);

    return (
        <div className="w-full h-full flex flex-col gap-1">
            <Container>
                <h1 className="text-center text-6xl w-full">{map?.name}</h1>
            </Container>

            <div className="flex gap-1">
                <Container className="w-full">
                    <h1 className="text-2xl text-gray-400">{map?.description || "No description"}</h1>
                </Container>
                <Container className="h-64 min-w-64">
                    <div className="flex h-full place-content-center">
                        {src === undefined ?
                            <h1 className="place-self-center">No image found</h1>
                            :
                            <img src={src} />
                        }
                    </div>
                </Container>
            </div>
            <div className="flex gap-1">
                <Container className="w-full">
                    <h1 className="text-xl">AuthorID: {map?.creatorID}</h1>
                </Container>
                <Container className="w-full">
                    <div className="flex text-xl gap-2">
                        Verified: {map?.verified ? <h1 className="text-green">True</h1> : <h1 className="text-red">False</h1>}
                    </div>
                </Container>
            </div>
            <Container className="w-full">
                <h1 className="text-xl">Total blocks: {totalBlocks}</h1>
            </Container>
            <div className="flex gap-1">
                <Container className="w-fit">
                    <div className="text-xl flex gap-2 w-128">Best time: <h1 className="text-blue">{map?.bestTime}</h1></div>
                </Container>
                <Container className="w-full">
                    <h1 className="flex text-xl gap-2">Editor version: {map?.version}</h1>
                </Container>
            </div>
            {id && id.length > 0 && <div className="flex">
                <Container className="w-full bg-green/50">
                    <div className="text-xl justify-center flex gap-2">
                        <h1>Map was found in</h1>
                        <a 
                            className="text-blue hover:underline" 
                            onClick={async () => await openUrl(`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`)}
                        >Steam Workshop,</a>
                        <h1>so you can update it.</h1>
                    </div>
                </Container> 
            </div>}
            <div className="relative h-full">
                <div className="absolute right-0 bottom-0">
                    <div className="flex gap-1">
                        <Button 
                            className="bg-black/70 text-red hover:text-pink text-xl h-fit"
                            onClick={() => setOpen(true)}
                        >{id && id.length > 0 ? "Update" : "Upload"} map</Button>
                        <Button 
                            className="bg-black/70 text-xl h-fit"
                            onClick={saveAsJson}
                        >Save as json</Button>
                        <Button 
                            className="bg-black/70 text-xl h-fit"
                            onClick={saveChanges}
                        >Save changes</Button>
                    </div>
                </div>
            </div>
            <div className="absolute">
                <UploadModal open={open} setOpen={setOpen}/>
            </div>
        </div>
    );
}

export default MainPage;