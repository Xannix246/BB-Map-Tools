import steamworks from "steamworks.js";
import { workshop } from "steamworks.js/client";

export class SteamManager {
    client!: ReturnType<typeof steamworks.init>;

    constructor() {
        this.init(2330500);
    }

    private init(appId: number) {
        this.client = steamworks.init(appId);
    }

    public async search(name: string) {
        const request = await this.client.workshop.getUserItems(
            1,
            this.client.localplayer.getSteamId().accountId,
            workshop.UserListType.Published,
            workshop.UGCType.Items,
            workshop.UserListOrder.CreationOrderDesc,
            {
                creator: 2330500,
                consumer: 2330500
            },
            {
                searchText: name,
                requiredTags: ["CustomMaps"]
            }
        );

        const resp = JSON.stringify(request.items, (_, v) => typeof v === "bigint" ? Number(v) : v);

        return JSON.parse(resp);
    }

    public async upload(params: {
        title: string,
        description?: string,
        previewPath: string,
        contentPath: string,
        changeNote?: string,
        itemId?: bigint
    }) {
        const workshopItemId = params.itemId ? params.itemId : (await this.client.workshop.createItem(2330500)).itemId;
        const request = await this.client.workshop.updateItem(workshopItemId, {
            ...params
        }, 2330500);

        return request.itemId.toString();
    }

    // public async update(params: {
    //     title: string,
    //     description?: string,
    //     previewPath: string,
    //     contentPath: string,
    //     changeNote?: string
    // }) {
    //     const workshopItemId = (await this.search(params.title))?.publishedFileId;

    //     if(!workshopItemId) return "failed to find map";

    //     const request = await this.upload(
    //         {
    //             ...params,
    //             itemId: workshopItemId
    //         }
    //     );

    //     return request;
    // }
}