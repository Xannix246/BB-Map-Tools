import { LazyStore } from '@tauri-apps/plugin-store';

const store = new LazyStore("./config.json")

class Config {
    constructor() {

    }

    public async getValue<T extends string | number>(key: string): Promise<T> {
        return (await store.get<T>(key) as T);
    }

    public async setValue(key: string, value: string | number) {
        await store.set(key, value);
        await store.save();
        return;
    }

    public async getUiConfig(): Promise<UiConfig> {
        return (await store.get("uiConfig") as UiConfig);
    }

    public async setUiConfig({enableBackups }: UiConfig) {
        const currentConfig = await store.get("uiConfig") as UiConfig;

        const updatedConfig: UiConfig = {
            ...currentConfig,
            ...(enableBackups !== undefined && { enableBackups }),
            // ...(leftBarContent !== undefined && { leftBarContent }),
            // ...(hideLogo !== undefined && { hideLogo }),
            // ...(hideNewsImages !== undefined && { hideNewsImages }),
            // ...(hideNews !== undefined && { hideNews }),
            // ...(language !== undefined && { language })
        };

        await store.set("uiConfig", updatedConfig);
        await store.save();    
        return;
    }
}

export default Config;