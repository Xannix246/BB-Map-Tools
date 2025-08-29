import { invoke } from "@tauri-apps/api/core";

export class SteamManager {
    constructor() {
        this.init(2330500);
    }

    // init
    private async init(appId: number) {
        await invoke("steam_init", { appId });
    }

    // search map
    public async search(authorId: string, namePart: string): Promise<{
        publishedFileId: string | null,
        title?: string
    }> {
        return await invoke("steam_search", { authorId, namePart });
    }

    // upload map
    public async steamUpload(params: {
        appId: number;
        title: string;
        description?: string;
        sourceDir: string;            // корень с исходными файлами
        allowedFiles: string[];       // какие конкретно файлы брать
        previewFile?: string | null;  // путь к превью картинке (можно null)
        tags?: string[];
    }) {
        return await invoke("steam_upload", params);
    }

    // update map
    public async steamUpdate(params: {
        appId: number;
        publishedFileId: string;      // уже известный workshop ID
        title?: string | null;
        description?: string | null;
        sourceDir: string;
        allowedFiles: string[];
        previewFile?: string | null;
        tags?: string[];
    }) {
        return await invoke("steam_update", params);
    }

    // update existing or upload new map
    public async steamUpsert(params: {
        appId: number;
        authorId: string;
        namePart: string;
        title: string;
        description?: string;
        sourceDir: string;
        allowedFiles: string[];
        previewFile?: string | null;
        tags?: string[];
    }) {
        return await invoke("steam_upsert", params);
    }
}