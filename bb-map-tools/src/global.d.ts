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
