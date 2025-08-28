import { $dir, $map } from "@/store";
import { message } from "@tauri-apps/plugin-dialog";
import { exists, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { serializeMap } from "@utils/serialize";

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
    const path = $dir.get() + "\\Map.json";

    await writeFile(path, Buffer.from(JSON.stringify($map.get())));

    await message("Map was saved as json file.", {
        title: "Saved"
    });
}

export async function saveChanges() {
    try {
        const path = $dir.get() + "\\Map.bbmap";
        const json = $map.get();

        if (!json) return;

        const map = serializeMap(json);

        await writeFile(path, Buffer.from(map));

        await message("Map was saved successfully.", {
            title: "Saved"
        });
    } catch (e) {
        await message(`Failed to save file. \n\n${e}`, { title: 'BB Map Tools', kind: 'error' });
    }
}