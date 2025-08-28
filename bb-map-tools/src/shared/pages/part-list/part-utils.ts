import { $map, loadMapFromMain, saveMapToMain } from "@/store";
import { appDataDir } from "@tauri-apps/api/path";
import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from "@tauri-apps/plugin-fs";

const baseDir = (await appDataDir()).replace(/Roaming$/, "LocalLow").replace("com.alber.bb-map-tools", "Jan Malitschek\\BetonBrutal\\CustomMaps");

export async function loadJsonToParts() {
    const map = $map.get();

    if (!map) return;

    let parsed: any;
    const path = await open({
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

    console.log(path)
    if (!path) return;
    const file = new TextDecoder().decode(await readFile(path));

    if (!map.parts) map.parts = [];

    try {
        parsed = JSON.parse(file);
    } catch (e) {
        throw new Error("Invalid JSON");
    }

    if (Array.isArray(parsed)) {
        console.log("1")
        map.parts = [...map.parts, parsed];
    } else if (parsed.blocks) {
        console.log(map.parts, parsed.blocks)
        map.parts = [...map.parts, parsed.blocks];
    } else {
        throw new Error("Unknown JSON format: blocks or array not found");
    }

    $map.set({ ...map });
    console.log(map);
    saveMapToMain({ ...map });
    // window.location.reload();
}

export async function loadTxtToParts() {
    const map = $map.get();

    if (!map) return;

    const path = await open({
        defaultPath: baseDir,
        multiple: false,
        directory: false,
        filters: [
            {
                name: "TXT file",
                extensions: ["txt"]
            }
        ]
    });

    if(!path) return;
    const file = new TextDecoder().decode(await readFile(path));

    const lines = file.split(/\r?\n/);
    const blocks: Block[] = [];

    let current: Partial<Block> = {};

    for (const line of lines) {
        if (line.startsWith("Block ID:")) {
            current.blockID = parseInt(line.replace("Block ID:", "").trim(), 10);
        } else if (line.startsWith("Instance ID:")) {
            current.instanceID = line.replace("Instance ID:", "").trim();
        } else if (line.startsWith("Color:")) {
            const parts = line.split(" ");
            current.color = parseInt(parts[1], 10);
        } else if (line.startsWith("Position:")) {
            const [x, y, z] = line.replace("Position:", "").split(",").map(s => parseFloat(s));
            current.position = { x, y, z };
        } else if (line.startsWith("Rotation:")) {
            const [x, y, z, w] = line.replace("Rotation:", "").split(",").map(s => parseFloat(s));
            current.rotation = { x, y, z, w };
        } else if (line.startsWith("Scale:")) {
            current.scale = parseFloat(line.replace("Scale:", "").trim());
        } else if (line.startsWith("Custom color:")) {
            const [r, g, b, a] = line.replace("Custom color:", "").split(",").map(s => parseFloat(s));
            current.customColor = { r, g, b, a };
        } else if (line.trim() === "" && current.blockID !== undefined) {
            blocks.push(current as Block);
            current = {};
        }
    }

    map.parts = [blocks];
    $map.set(map);
    saveMapToMain(map);
}

export async function deserializeMapToParts() {
    
}