/* eslint-disable react-hooks/rules-of-hooks */
import { useStore } from "@nanostores/react";
import { invoke } from "@tauri-apps/api/core";
import { DirEntry } from "@tauri-apps/plugin-fs";
import { atom } from "nanostores";

export const $map = atom<MapData | null>(null);
export const setMap = (map: MapData | null) => $map.set(map);
export const getMap = () => useStore($map);

export const $dirData = atom<DirEntry[] | null>(null);
export const $dir = atom<string | null>(null);
export const setDirectoryData = (data: DirEntry[] | null) => $dirData.set(data);
export const getDirectoryData = () => useStore($dirData);
export const setDirectory = (data: string | null) => $dir.set(data);
export const getDirectory = () => useStore($dir);

export const $cords = atom<Vector3 | null>(null);
export const getCords = () => useStore($cords);
export const setCords = (cords: Vector3) => $cords.set(cords);

export const $id = atom<string | null>(null);
export const getId = () => useStore($id);
export const setId = (id: string | null) => $id.set(id);

//for secondary windows

export async function loadMapFromMain() {
    const map = await invoke("get_map");
    return map;
}

export async function saveMapToMain(map: any) {
    await invoke("set_map", { newMap: map });
}
