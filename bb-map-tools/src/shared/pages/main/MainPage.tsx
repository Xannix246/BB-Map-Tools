import Container from "@/base/container/Container";
import { getDirectory, getMap } from "@/store";
import { getImage } from "./main-utils";
import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";

const MainPage = () => {
    const map = getMap();
    const dir = getDirectory();
    const [src, setSrc] = useState<string>();

    useEffect(() => {
        (async () => {
            const image = await getImage();

            if (image) setSrc(image);
        })();
    }, [dir]);

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
                <h1 className="text-xl">Total blocks: {map?.blocks.length}</h1>
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
                    <Button className="bg-black/70 text-xl h-fit">Save changes</Button>
                </div>
            </div>
        </div>
    );
}

export default MainPage;