import { $dir, $map, loadMapFromMain, saveMapToMain } from "@/store";
import { message } from "@tauri-apps/plugin-dialog";
import { exists, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { open } from '@tauri-apps/plugin-dialog';
import { serializeMap } from "@utils/serialize";
import { Buffer } from "buffer";
import imageCompression from "browser-image-compression";

export async function getImage(): Promise<string | undefined> {
    const imagePath = $dir.get() + "\\Thumbnail.png";
    try {
        if (await exists(imagePath)) {
            const data = await readFile(imagePath);
            const type = imagePath.endsWith(".jpg") ? "jpg" : imagePath.endsWith(".jpeg") ? "jpeg" : "png";
            const blob = new Blob([data], { type: `image/${type}` });
            return URL.createObjectURL(blob);
        }
    } catch {}
}

export async function saveAsJson() {
    const mapData = await loadMapFromMain() as MapData;
    if (mapData && mapData.name == $map.get()?.name) $map.set(mapData);

    const path = $dir.get() + "\\Map.json";

    await writeFile(path, Buffer.from(JSON.stringify($map.get(), (_, v) => typeof v === "bigint" ? Number(v) : v)));

    await message("Map was saved as json file.", {
        title: "Saved"
    });

    await saveMapToMain($map.get());
}

export async function saveChanges() {
    try {
        const mapData = await loadMapFromMain() as MapData;
        console.log(mapData);
        if (mapData && mapData.name == $map.get()?.name) $map.set(mapData);
        
        const path = $dir.get() + "\\Map.bbmap";
        const json = $map.get() as MapData;
        const preparedJson = { ...json };

        if (!json || !preparedJson) return;

        if (json.parts) {
            preparedJson.parts = undefined;
            preparedJson.blocks = [];

            for (let part of json.parts) {
                preparedJson.blocks.push(...part);
            }
        }


        const map = serializeMap(preparedJson);

        await writeFile(path, Buffer.from(map));

        await message("Map was saved successfully.", {
            title: "Saved"
        });

        await saveMapToMain($map.get());
    } catch (e) {
        await message(`Failed to save file. \n\n${e}`, { title: 'BB Map Tools', kind: 'error' });
    }
}

export async function changeData(data: {
    name?: string,
    description?: string,
    verified?: boolean,
    authorId?: string
}) {
    const map = $map.get();

    if (map) {
        if (data.name !== undefined) map.name = data.name;
        if (data.description !== undefined) map.description = data.description;
        if (data.verified !== undefined) map.verified = data.verified;
        if (data.authorId !== undefined) map.creatorID = BigInt(data.authorId);

        $map.set({ ...map });
    }
}

export async function changeImage() {
    const dir = $dir.get();

    const filePath = await open({
        multiple: false,
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }],
    });
    if (!filePath) return;

    const fileBytes = await readFile(filePath as string);

    const fileName = "image.png";
    const file = new File([fileBytes], fileName, { type: "image/png" });

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/png",
    };

    const compressedFile = await imageCompression(file, options);

    const arrayBuffer = await compressedFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const savePath = `${dir}/Thumbnail.png`;
    await writeFile(savePath, uint8Array);
}
