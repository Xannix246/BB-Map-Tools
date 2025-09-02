import { $map, saveMapToMain } from "@/store";
import { appDataDir } from "@tauri-apps/api/path";
import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from "@tauri-apps/plugin-fs";
import { deserializeMap } from "@utils/deserialize";
import { Buffer } from "buffer";
import { v4 } from "uuid";

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

    if (!path) return;
    const file = new TextDecoder().decode(await readFile(path));

    if (!map.parts) map.parts = [];

    try {
        parsed = JSON.parse(file);
    } catch (e) {
        throw new Error("Invalid JSON");
    }

    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return;
        map.parts = [...map.parts, parsed];
    } else if (parsed.blocks) {
        if (parsed.blocks.length === 0) return;
        map.parts = [...map.parts, parsed.blocks];
    } else {
        throw new Error("Unknown JSON format: blocks or array not found");
    }

    $map.set({ ...map });
    saveMapToMain({ ...map });
}

function parseNumberList(str: string): number[] {
    return str.split(", ").map(s => s.trim()).filter(s => s.length > 0).map(s => parseFloat(s.replace(",", ".")));
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
            const [x, y, z] = parseNumberList(line.replace("Position:", ""));
            current.position = { x, y, z };
        } else if (line.startsWith("Rotation:")) {
            const [x, y, z, w] = parseNumberList(line.replace("Rotation:", ""));
            current.rotation = { x, y, z, w };
        } else if (line.startsWith("Scale:")) {
            current.scale = parseFloat(line.replace("Scale:", "").trim().replace(",", "."));
        } else if (line.startsWith("Custom color:")) {
            const [r, g, b, a] = parseNumberList(line.replace("Custom color:", ""));
            current.customColor = { r, g, b, a };
        } else if (line.trim() === "" && current.blockID !== undefined) {
            blocks.push(current as Block);
            current = {};
        }
    }

    if (!map.parts) map.parts = [];

    map.parts = [...map.parts, blocks];
    $map.set({ ...map });
    saveMapToMain({ ...map });
}

export async function deserializeMapToParts() {
    const map = $map.get();

    if (!map) return;

    const path = await open({
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

    if(!path) return;

    const buf = await readFile(path);
    const deserializedMap = deserializeMap(Buffer.from(buf));

    if (deserializedMap.blocks.length > 0) {
        if (!map.parts) map.parts = [];

        map.parts = [...map.parts, deserializedMap.blocks];
        $map.set({ ...map });
        saveMapToMain({ ...map });
    }
}

export async function deletePart(id: number) {
    const map = $map.get();

    if (!map || !map.parts) return;

    map.parts = map.parts.filter((_, index) => index !== id);

    $map.set({ ...map });
    saveMapToMain({ ...map });
}

export async function generateUuid(id: number) {
    const map = $map.get();

    if (!map || !map.parts) return;

    map.parts[id].forEach((block) => block.instanceID = v4());


    $map.set({ ...map });
    saveMapToMain({ ...map });
}

export async function changeCords(id: number, newCords: Vector3) {
    const map = $map.get();
    if (!map || !map.parts || !map.parts[id]?.length) return;

    const part = map.parts[id];
    const first = part[0];

    const delta: Vector3 = {
        x: newCords.x - first.position.x,
        y: newCords.y - first.position.y,
        z: newCords.z - first.position.z,
    };

    part.forEach((block) => {
        block.position.x += delta.x;
        block.position.y += delta.y;
        block.position.z += delta.z;
    });

    $map.set({ ...map });
    saveMapToMain({ ...map });
}
