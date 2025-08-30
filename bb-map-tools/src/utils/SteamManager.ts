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
        return search[0];
    }

    // upload map
    // public async upload(params: {
    //     title: string;
    //     description?: string;
    //     previewPath?: string | null;
    //     contentPath: string;
    // }) {
        
    // }

    // update map
    // public async update(params: {
    //     appId: number;
    //     publishedFileId: string;
    //     title?: string | null;
    //     description?: string | null;
    //     sourceDir: string;
    //     allowedFiles: string[];
    //     previewFile?: string | null;
    //     tags?: string[];
    // }) {
        
    // }
}