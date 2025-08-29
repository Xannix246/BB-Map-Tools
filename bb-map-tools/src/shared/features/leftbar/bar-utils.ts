import { open, save } from '@tauri-apps/plugin-dialog';
import { readFile, writeFile, readDir } from '@tauri-apps/plugin-fs'
import { deserializeMap } from '@utils/deserialize';
import { appDataDir } from '@tauri-apps/api/path';
import { Buffer } from "buffer";
import { serializeMap } from '@utils/serialize';
import { $dir, $dirData, $map, loadMapFromMain, saveMapToMain } from '@/store';
import { message } from '@tauri-apps/plugin-dialog';
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import Config from '@utils/ConfigManager';



const baseDir = (await appDataDir()).replace(/Roaming$/, "LocalLow").replace("com.alber.bb-map-tools", "Jan Malitschek\\BetonBrutal\\CustomMaps");

export async function deserializeAndSave() {
    try {
        const file = await open({
            defaultPath: baseDir,
            multiple: false,
            directory: false,
            filters: [
                {
                    name: "BBMap file",
                    extensions: ["bbmap"]
                }
            ]
        });

        if(!file) return;

        const buf = await readFile(file);
        const map = JSON.stringify(deserializeMap(Buffer.from(buf)), (_, v) => typeof v === "bigint" ? Number(v) : v);

        const outputDir = await save({
            defaultPath: file,
            filters: [
                {
                    name: "JSON file",
                    extensions: ["json"]
                },
            ],
        });

        if (!outputDir) return;

        writeFile(outputDir, Buffer.from(map));
    } catch (e) {
        await message(`Failed to deserialize file. \n\n${e}`, { title: 'BB Map Tools', kind: 'error' });
    }
}

export async function serializeAndSave() {
    try {
        const file = await open({
            defaultPath: baseDir,
            multiple: false,
            directory: false,
            filters: [
                {
                    name: "JSON file",
                    extensions: ["json"]
                }
            ]
        });

        if(!file) return;

        const json: MapData = JSON.parse(new TextDecoder().decode(await readFile(file)));
        const bbmap = serializeMap(json);

        const outputDir = await save({
            defaultPath: file,
            filters: [
                {
                    name: "BBMap file",
                    extensions: ["bbmap"]
                },
            ],
        });

        if (!outputDir) return;

        writeFile(outputDir, bbmap);
    } catch (e) {
        await message(`Failed to serialize file. \n\n${e}`, { title: 'BB Map Tools', kind: 'error' });
    }
}

export async function readDirData() {
    const dir = await open({
        defaultPath: baseDir,
        multiple: false,
        directory: true,
    });

    if (!dir) return;

    const dirData = await readDir(dir);

    if(!dirData.find((file) => file.name === "Map.bbmap")) {
        return await message(`Invalid directory: Map.bbmap not found!`, { title: 'BB Map Tools', kind: 'error' });
    }

    $dir.set(dir);
    $dirData.set(dirData);

    const buf = await readFile(dir+"\\Map.bbmap");
    const date = new Date();
    if ((await new Config().getUiConfig()).enableBackups) {
        await writeFile(dir+`\\Backup-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.bbmap`, buf);
    }
    const map = JSON.stringify(deserializeMap(Buffer.from(buf)), (_, v) => typeof v === "bigint" ? Number(v) : v);

    $map.set(JSON.parse(map));
}

export async function openPartEditor() {
    if (!$dir.get() && !$map.get()) return;

    const window = new WebviewWindow("part-editor", {
        url: "editor.html",
        width: 600,
        height: 800,
        title: "Part Editor",
        decorations: false
    });

    window.once("tauri://webview-created", () => {
        console.log($map.get());
        saveMapToMain($map.get());
    });

    window.once("tauri://close-requested", async () => {
        console.log("closed");
        $map.set(await loadMapFromMain() as MapData);
        console.log($map.get());
        window.close();
    });
}

export async function openJson() {
    const file = await open({
        defaultPath: baseDir,
        multiple: false,
        directory: false,
        filters: [
            {
                name: "JSON file",
                extensions: ["json"]
            }
        ]
    });

    if (!file) return;

    const json: MapData = JSON.parse(new TextDecoder().decode(await readFile(file)));
    
    $map.set(json);
    $dir.set(null);
    $dirData.set(null);
}

export async function saveJson() {
    $map.set(await loadMapFromMain() as MapData);

    const file = await save({
        defaultPath: baseDir,
        filters: [
            {
                name: "JSON file",
                extensions: ["json"]
            },
        ],
    });

    if (!file) return;
    writeFile(file, Buffer.from(JSON.stringify($map.get())));
}
