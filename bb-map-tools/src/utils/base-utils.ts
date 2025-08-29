import Config from "./ConfigManager";

const config = new Config();

export async function initConfig() {
    !await config.getUiConfig() && config.setUiConfig({ 
        enableBackups: true,
    });
}

export function isMapData(map: MapData | string): map is MapData {
    return (map as MapData).name !== undefined;
}