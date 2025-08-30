"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamManager = void 0;
const steamworks_js_1 = __importDefault(require("steamworks.js"));
class SteamManager {
    constructor() {
        this.init(2330500);
    }
    init(appId) {
        this.client = steamworks_js_1.default.init(appId);
    }
    async search(name) {
        const request = await this.client.workshop.getUserItems(1, this.client.localplayer.getSteamId().accountId, 0 /* workshop.UserListType.Published */, 0 /* workshop.UGCType.Items */, 1 /* workshop.UserListOrder.CreationOrderDesc */, {
            creator: 2330500,
            consumer: 2330500
        }, {
            searchText: name,
            requiredTags: ["CustomMaps"]
        });
        const resp = JSON.stringify(request.items, (_, v) => typeof v === "bigint" ? Number(v) : v);
        return JSON.parse(resp);
    }
    async upload(params) {
        const workshopItemId = params.itemId ? params.itemId : (await this.client.workshop.createItem(2330500)).itemId;
        const request = await this.client.workshop.updateItem(workshopItemId, {
            ...params
        }, 2330500);
        return request.itemId.toString();
    }
}
exports.SteamManager = SteamManager;
//# sourceMappingURL=SteamManager.js.map