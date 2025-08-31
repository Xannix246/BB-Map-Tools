import { $dir, $id, $map, loadMapFromMain } from "@/store";
import { path } from "@tauri-apps/api";
import { message } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { serializeMap } from "@utils/serialize";
import { SteamManager } from "@utils/SteamManager";

const steam = new SteamManager();

async function saveChanges() {
    const mapData = await loadMapFromMain() as MapData;

    if (!mapData) return;

    $map.set(mapData);
    
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
}

export async function startUpload() {
    saveChanges();
    const map = $map.get();
    const dir = $dir.get();
    let messageStr = "";

    if (!map || !dir) return;
        
    try {
        const res = await steam.upload({
            title: map?.name,
            description: map.description,
            previewPath: await path.join(dir + "\\Thumbnail.png"), 
            contentPath: await path.join(dir),
            changeNote: "Uploaded with BB Map Tools"
        });
        messageStr = `Map was uploaded successfully! \nThe map is currently only visible to you.\n\n https://steamcommunity.com/sharedfiles/filedetails/?id=${Number(res)}`;
        $id.set(Number(res).toString());
    } catch (e) {
        messageStr = `Error while uploading map:\n\n${e}`;
    }

    await message(messageStr, {
        title: "Responce"
    });
}

export async function startUpdate() {
    saveChanges();
    const map = $map.get();
    const dir = $dir.get();
    const id = $id.get();
    let messageStr = "";

    if (!map || !dir) return;
        
    try {
        const res = await steam.update({
            title: map?.name,
            description: map.description,
            previewPath: await path.join(dir + "\\Thumbnail.png"), 
            contentPath: await path.join(dir),
            changeNote: "Updated with BB Map Tools",
            itemId: Number(id)
        });
        messageStr = `Map was updated successfully!\n\n https://steamcommunity.com/sharedfiles/filedetails/?id=${Number(res)}`;
    } catch (e) {
        messageStr = `Error while updating map:\n\n${e}`;
    }

    await message(messageStr, {
        title: "Responce"
    });
}