import { useEffect, useRef, useState } from "react";
import { SettingsSubmodule } from "./SettingsSubmodule";
import clsx from "clsx";

type Props = {
    open: boolean;
    setOpen: (bool: boolean) => void;
}

const Settings = ({ open, setOpen }: Props) => {
    const [selectedGroup, setSelectedGroup] = useState("Application");
    const [show, setShow] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const settingsRef = useRef<HTMLDivElement | null>(null);
    const [settingsTable, settingsData] = SettingsSubmodule({ selectedGroup, setSelectedGroup });

    const handleClickOutside = (e: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        setSelectedGroup("Application")
    }, []);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
            setTimeout(() => setShow(true), 10);
        } else {
            setShow(false);
            setTimeout(() => setIsVisible(false), 200);
        }
    }, [open]);

    useEffect(() => {
        if (show) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [show]);

    useEffect(() => {
    }, [SettingsSubmodule, selectedGroup]);

    const className = clsx(
        isVisible ? "" : "hidden",
        show ? "opacity-100 z-40" : "opacity-0 -z-0",
        "transition-opacity duration-150 absolute w-full h-full place-items-center content-center py-24 px-32 backdrop-blur-sm overflow-clip"
    );

    return (
        <div className={className}>
            <div ref={settingsRef} className="relative w-full h-full text-2xl bg-black/70 bg-center bg-no-repeat bg-cover flex">
                <div className="w-[250px] h-full bg-white/10 pt-5 text-white">
                    {settingsTable}
                </div>
                <div className="p-5 w-full overflow-y-auto text-white">
                    {settingsData}
                </div>
            </div>
        </div>
    );
};

export default Settings;
