import steamworks from "steamworks.js";
export declare class SteamManager {
    client: ReturnType<typeof steamworks.init>;
    constructor();
    private init;
    search(name: string): Promise<any>;
    upload(params: {
        title: string;
        description?: string;
        previewPath: string;
        contentPath: string;
        changeNote?: string;
        itemId?: bigint;
    }): Promise<string>;
}
//# sourceMappingURL=SteamManager.d.ts.map