import { open, save } from '@tauri-apps/plugin-dialog';
import { readFile, writeFile, readDir } from '@tauri-apps/plugin-fs'
import { deserializeMap } from '@utils/deserialize';
import { appDataDir } from '@tauri-apps/api/path';
import { Buffer } from "buffer";
import { serializeMap } from '@utils/serialize';
import { setDirectory, setDirectoryData, setMap } from '@/store';



const baseDir = (await appDataDir()).replace(/Roaming$/, "LocalLow").replace("com.alber.bb-map-tools", "Jan Malitschek\\BetonBrutal\\CustomMaps");

export async function deserializeAndSave() {
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

    if(!outputDir) return;

    writeFile(outputDir, Buffer.from(map));
}

export async function serializeAndSave() {
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

    if(!outputDir) return;

    writeFile(outputDir, bbmap);
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
        return console.log("Invalid directory");
    }

    setDirectory(dir);
    setDirectoryData(dirData);

    const buf = await readFile(dir+"\\Map.bbmap");
    const map = deserializeMap(Buffer.from(buf));

    setMap(map);
}