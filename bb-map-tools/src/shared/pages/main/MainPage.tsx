import Container from "@/base/container/Container";
import { getDirectory, getMap } from "@/store";
import { getImage, saveAsJson, saveChanges } from "./main-utils";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { SteamManager } from "@utils/SteamManager";
import { path } from "@tauri-apps/api";

const MainPage = () => {
    const map = getMap();
    const dir = getDirectory();
    const [src, setSrc] = useState<string>();
    const [totalBlocks, setTotalBlocks] = useState(0);

    useEffect(() => {
        (async () => {
            const image = await getImage();

            if (image) setSrc(image);
        })();
    }, [dir]);

    useEffect(() => {
        if (map && dir) {
            // steam.upload(
            //     {
            //         title: "blabla",
            //         description: "blabla2",
            //         previewPath: dir + "\\Preview.png",
            //         contentPath: dir
            //     }
            // );

            (async () => {
                const steam = new SteamManager();
                console.log(await steam.search(map.name));

                const res = await steam.update({
                    title: map.name,
                    description: "some description2",
                    previewPath: await path.join(dir + "\\Thumbnail.png"),
                    contentPath: await path.join(dir),
                    changeNote: "blob",
                    itemId: 3559190313
                });
                console.log(res);
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
                    <h1 className="text-2xl text-gray-400">{map?.description || "No desctription"}</h1>
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
            <div className="relative h-full">
                <div className="absolute right-0 bottom-0">
                    <div className="flex gap-5">
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
        </div>
    );
}

export default MainPage;