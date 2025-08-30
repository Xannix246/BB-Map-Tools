import { BaseDirectory, writeFile, exists } from "@tauri-apps/plugin-fs";
import Config from "./ConfigManager";
import { Buffer } from "buffer";

const config = new Config();

export async function initConfig() {
    !await config.getUiConfig() && config.setUiConfig({ 
        enableBackups: true,
    });

    if(!await exists("./steam_appid.txt", { baseDir: BaseDirectory.Resource })) {
        console.log("steam_appid.txt not found, creating...");
        await writeFile("steam_appid.txt", Buffer.from("2330500"), { baseDir: BaseDirectory.Resource });
    } else {
        console.log("steam_appid.txt found");
    }
}

export function isMapData(map: MapData | string): map is MapData {
    return (map as MapData).name !== undefined;
}