declare type Vector3 = { x: number; y: number; z: number };
declare type Quaternion = { x: number; y: number; z: number; w: number };
declare type Color = { r: number; g: number; b: number; a: number };

declare interface Block {
    blockID: number;
    instanceID: string;
    color: number;
    position: Vector3;
    rotation: Quaternion;
    scale: number;
    customColor?: Color;
}

declare interface MapData {
    version: number;
    verified: boolean;
    name: string;
    description?: string; //internal data for map tools
    creatorID: bigint;
    bestTime: number;
    usesDLC1Map: boolean;
    blocks: Block[];
    modifiedScenery: { [key: string]: { color: number; customColor?: Color } };
    customColorSwatches: Color[];
    parts?: Block[][]; //parts
}

declare type Setting = {
    type: "input" | "select" | "toggle" | "info";
    label?: string;
    value?: string | boolean;
    options?: string[];
    style?: string;
    containerStyle?: string;
    labelStyle?: string;
    onEvent?: () => void;
    onChange?: (newValue: any) => void;
};

declare type SettingsGroup = {
    name: string;
    settings: Setting[];
    style?: string;
}

declare type UiConfig = {
    enableBackups?: boolean;
}

// from steamworks.js
declare const enum UgcItemVisibility {
    Public = 0,
    FriendsOnly = 1,
    Private = 2,
    Unlisted = 3
}

declare interface WorkshopItem {
    publishedFileId: bigint
    creatorAppId?: number
    consumerAppId?: number
    title: string
    description: string
    owner: PlayerSteamId
    /** Time created in unix epoch seconds format */
    timeCreated: number
    /** Time updated in unix epoch seconds format */
    timeUpdated: number
    /** Time when the user added the published item to their list (not always applicable), provided in Unix epoch format (time since Jan 1st, 1970). */
    timeAddedToUserList: number
    visibility: UgcItemVisibility
    banned: boolean
    acceptedForUse: boolean
    tags: Array<string>
    tagsTruncated: boolean
    url: string
    numUpvotes: number
    numDownvotes: number
    numChildren: number
    previewUrl?: string
    statistics: WorkshopItemStatistic
}

declare interface WorkshopItemStatistic {
    numSubscriptions?: bigint
    numFavorites?: bigint
    numFollowers?: bigint
    numUniqueSubscriptions?: bigint
    numUniqueFavorites?: bigint
    numUniqueFollowers?: bigint
    numUniqueWebsiteViews?: bigint
    reportScore?: bigint
    numSecondsPlayed?: bigint
    numPlaytimeSessions?: bigint
    numComments?: bigint
    numSecondsPlayedDuringTimePeriod?: bigint
    numPlaytimeSessionsDuringTimePeriod?: bigint
}
