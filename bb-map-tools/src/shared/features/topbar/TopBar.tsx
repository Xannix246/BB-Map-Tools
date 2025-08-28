import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";
import { confirm } from '@tauri-apps/plugin-dialog';



const TopBar = () => {
    const win = getCurrentWebviewWindow();
    
    return (
        <div
            className="absolute w-full h-[64px] z-50 flex justify-end"
            style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
        >
            <VscChromeMinimize
                className="w-[38px] h-[38px] p-2 m-1 text-gray-300 hover:text-white font-bold transition duration-150 hover:bg-black/80"
                onClick={() => {
                    win?.minimize();
                }}
            />
            <VscChromeMaximize
                className="w-[38px] h-[38px] p-2 m-1 text-gray-300 hover:text-white font-bold transition duration-150 hover:bg-black/80"
                onClick={async () => {
                    await win?.isMaximized() ? win?.unmaximize() : win?.maximize();
                }}
            />
            <VscChromeClose
                className="w-[38px] h-[38px] p-2 m-1 text-gray-300 hover:text-white transition duration-150 hover:bg-black/80"
                onClick={async () => {
                    const confirmation = await confirm(
                        'All unsaved changes will be lost. Are you sure?',
                        { title: 'Close BB Map Tools', kind: 'warning' }
                    );

                    if (confirmation) win?.close();
                }}
            />
        </div>
    );
}

export default TopBar;