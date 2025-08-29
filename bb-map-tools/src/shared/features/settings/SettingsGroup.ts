import { openUrl } from "@tauri-apps/plugin-opener";
import Config from "../../../utils/ConfigManager";
import { getVersion } from "@tauri-apps/api/app";

const getUiConfig = async () => {
    const config = await new Config().getUiConfig();
    return config;
};

export const getSettingsConfig = async (): Promise<SettingsGroup[]> => {
    const config = await getUiConfig();
    
    return [
        {
            name: "Application",
            settings: [
                { type: "info", label: "App main settings", labelStyle: "text-4xl font-default ml-8" },
                {
                    type: "toggle",
                    label: "Enable backups",
                    labelStyle: "flex-1",
                    style: "flex-2",
                    containerStyle: "flex",
                    value: config.enableBackups,
                    onChange: async (newValue: boolean) => {
                        await new Config().setUiConfig({ enableBackups: newValue as boolean });
                    }
                },
            ],
            style: "p-2"
        },
        {
            name: "About",
            settings: [
                { type: "info", value: `BB Modding Tools v${await getVersion()}`, style: "text-center" },
                {
                    type: "info",
                    value: ("Github link"),
                    style: "text-center text-blue cursor-pointer hover:text-ak-yellow hover:underline w-fit",
                    onEvent: async () => await openUrl("https://github.com/Xannix246/BlobField-Launcher"),
                    containerStyle: "flex justify-center"
                },
                {
                    type: "info",
                    value: ("BETON BRUTAL server link"),
                    style: "text-center text-yellow cursor-pointer hover:text-ak-yellow hover:underline w-fit",
                    onEvent: async () => await openUrl("https://discord.gg/NmumRuU3d6"),
                    containerStyle: "flex justify-center"
                }
            ],
            style: "p-2"
        },
        {
            name: "Test",
            settings: [
                { type: "info", value: `Some ui for settings`, style: "text-center" },
                {
                    type: "toggle",
                    label: "Toggle",
                    labelStyle: "flex-1",
                    style: "flex-2",
                    containerStyle: "flex",
                },
                {
                    type: "select",
                    label: "Selector",
                    labelStyle: "flex-1",
                    containerStyle: "flex",
                    options: ["option 1", "option 2", "option 3"],
                    style: "flex-2 w-full h-[42px] bg-white/10 outline-none",
                    value: "option 1",
                },
            ],
            style: "p-2 mt-32 text-red"
        }
    ];
};
