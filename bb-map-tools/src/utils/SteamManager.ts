import { invoke } from "@tauri-apps/api/core";

export class SteamManager {
    constructor() {
        // this.init(2330500);
    }

    // init
    private async init(appId: number) {
        await invoke("steam_init", { appId });
    }

    // search map
    public async search(authorId: bigint, partName: string)
    // : Promise<{
    //     publishedFileId: string | null,
    //     title?: string
    // }> 
    {
        return await invoke("find_map", { authorId, name: partName });
    }

    // upload map
    public async upload(params: {
        title: string;
        description?: string;
        previewPath?: string | null;
        contentPath: string;
    }) {
        //return await invoke("upload_map", params);
        return await invoke("upload_map", params);
    }

    // update map
    public async update(params: {
        appId: number;
        publishedFileId: string;      // уже известный workshop ID
        title?: string | null;
        description?: string | null;
        sourceDir: string;
        allowedFiles: string[];
        previewFile?: string | null;
        tags?: string[];
    }) {
        return await invoke("update_map", params);
    }

    // update existing or upload new map
    // public async upsert(params: {
    //     appId: number;
    //     authorId: string;
    //     namePart: string;
    //     title: string;
    //     description?: string;
    //     sourceDir: string;
    //     allowedFiles: string[];
    //     previewFile?: string | null;
    //     tags?: string[];
    // }) {
    //     return await invoke("steam_upsert", params);
    // }
}