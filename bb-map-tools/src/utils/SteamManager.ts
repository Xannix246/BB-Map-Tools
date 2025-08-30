import FuzzySearch from 'fuzzy-search'; 
import axios from "axios";

export class SteamManager {
    constructor() {}

    // search map
    public async search(partName: string): Promise<WorkshopItem> {
        const responce: WorkshopItem[] = (await axios.get(`http://localhost:2173/get-map?name=${partName}`)).data;

        const searcher = new FuzzySearch(responce, ['title'], {
            caseSensitive: false,
            sort: true
        });
        const search = searcher.search(partName).sort((a, b) => b.numUpvotes - a.numUpvotes);
        const mapped = search.map((item: any) => ({
            id: BigInt(item.id),
            title: item.title,
            description: item.description,
            owner: BigInt(item.owner),
            tags: item.tags,
            numUpvotes: item.numUpvotes,
            numDownvotes: item.numDownvotes
        }));

        return mapped[0];
    }

    // upload map
    public async upload(params: {
        title: string;
        description?: string;
        previewPath?: string | null;
        contentPath: string;
        changeNote?: string,
    }): Promise<bigint> {
        const responce: { itemId: bigint } = await axios.post(`http://localhost:2173/create`, {
            Title: params.title,
            ContentPath: params.contentPath,
            PreviewPath: params.previewPath,
            Description: params.description || "",
            ChangeNote: params.changeNote || ""
        });

        return responce.itemId;
    }

    // update map
    public async update(params: {
        title: string,
        contentPath: string,
        previewPath: string,
        description?: string,
        changeNote?: string,
        itemId: bigint
    }): Promise<bigint> {
        const responce: { itemId: bigint } = await axios.post(`http://localhost:2173/update`, {
            Title: params.title,
            ContentPath: params.contentPath,
            PreviewPath: params.previewPath,
            Description: params.description || "",
            ChangeNote: params.changeNote || "",
            ItemId: params.itemId
        });

        return responce.itemId;
    }
}