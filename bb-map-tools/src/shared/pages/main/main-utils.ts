import { $dir, $map, loadMapFromMain } from "@/store";
import { message } from "@tauri-apps/plugin-dialog";
import { exists, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { serializeMap } from "@utils/serialize";
import { Buffer } from "buffer";

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
    $map.set(await loadMapFromMain() as MapData);

    const path = $dir.get() + "\\Map.json";

    await writeFile(path, Buffer.from(JSON.stringify($map.get(), (_, v) => typeof v === "bigint" ? Number(v) : v)));

    await message("Map was saved as json file.", {
        title: "Saved"
    });
}

export async function saveChanges() {
    try {
        $map.set(await loadMapFromMain() as MapData);
        
        const path = $dir.get() + "\\Map.bbmap";
        const json = $map.get();
        const preparedJson = Object.create(json);

        if (!json || !preparedJson) return;

        if (json.parts) {
            preparedJson.parts = [];

            for (let part of json.parts) {
                preparedJson.blocks.push(...part);
            }
        }

        const map = serializeMap(preparedJson);

        await writeFile(path, Buffer.from(map));

        await message("Map was saved successfully.", {
            title: "Saved"
        });
    } catch (e) {
        await message(`Failed to save file. \n\n${e}`, { title: 'BB Map Tools', kind: 'error' });
    }
}

export async function changeName(name: string) {
    
}

export async function changeDescription(description: string) {
    
}

export async function changeImage() {
    
}
