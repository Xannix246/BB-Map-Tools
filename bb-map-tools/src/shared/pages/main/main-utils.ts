import { $dir } from "@/store";
import { exists, readFile } from "@tauri-apps/plugin-fs";

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
