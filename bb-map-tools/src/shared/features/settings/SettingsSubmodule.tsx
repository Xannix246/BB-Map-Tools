import { useState, useEffect } from "react";
import { getSettingsConfig } from "./SettingsGroup";

type Props = {
    selectedGroup: string;
    setSelectedGroup: (value: string) => void;
}

export const SettingsSubmodule = ({ selectedGroup, setSelectedGroup }: Props) => {
    const [settingsConfig, setSettingsConfig] = useState<SettingsGroup[]>([]);
    const [settingsValues, setSettingsValues] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        const fetchSettings = async () => {
            const config = await getSettingsConfig();
            setSettingsConfig(config);
            const initialValues: { [key: string]: any } = {};
            const group = config.find((g) => g.name === selectedGroup);
            if (group) {
                group.settings.forEach((setting) => {
                    initialValues[setting.label as string] = setting.value;
                });
                setSettingsValues(initialValues);
            }
        };
        fetchSettings();
    }, [selectedGroup]);

    const handleValueChange = (key: string, value: any) => {
        setSettingsValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return [
        <div key="settings-groups" className="flex flex-col">
            {settingsConfig.map((group) => (
                <div className="" key={group.name}>
                    <button
                        className={`relative w-full items-center ${group.style} ${selectedGroup === group.name ? "bg-green/20" : "hover:bg-black/5 transition duration-150"}`}
                        onClick={() => setSelectedGroup(group.name)}
                    >
                        {group.name}
                    </button>
                </div>
            ))}
        </div>,
        <div key="settings-content" className="p-4">
            {settingsConfig.find((g) => g.name === selectedGroup)?.settings.map((setting, index) => (
                <div key={index} className={`mb-4 font-second ${setting.containerStyle}`}>
                    <label className={setting.labelStyle}>{setting.label}</label>
                    {setting.type === "input" && <input
                        type="text"
                        value={settingsValues[setting.label as string] || ""}
                        className={setting.style}
                        onChange={(e) => handleValueChange(setting.label as string, e.target.value)}
                    />}
                    {setting.type === "toggle" && (
                        <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    role="switch"
                                    checked={settingsValues[setting.label as string] || false}
                                    className="sr-only peer"
                                    onChange={async (e) => {
                                        handleValueChange(setting.label as string, e.target.checked);
                                        setting.onChange?.(e.target.checked);
                                    }}
                                />
                                <div className="w-11 h-6 bg-red peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all duration-150 peer-checked:bg-green after:shadow-md"></div>
                            </label>
                        </div>
                    )}
                    {setting.type === "select" && (
                        <select
                            value={settingsValues[setting.label as string] || ""}
                            className={setting.style}
                            onChange={async (e) => {
                                handleValueChange(setting.label as string, e.target.value);
                                setting.onChange?.(e.target.value);
                            }}
                        >
                            {setting.options?.map((option) => (
                                <option key={option} value={option} className="bg-white/10 text-black">{option}</option>
                            ))}
                        </select>
                    )}
                    {setting.type === "info" && <div className={setting.style} onClick={setting.onEvent}>{setting.value}</div>}
                </div>
            ))}
        </div>
    ];
};