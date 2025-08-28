/* eslint-disable react-hooks/rules-of-hooks */
import { useStore } from "@nanostores/react";
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