import Button from "@/base/button/Button";
import { deserializeAndSave, readDirData, serializeAndSave } from "./bar-utils";

const LeftBar = () => {
    return (
        <div className="h-screen min-w-[300px] w-[300px] pt-32 pr-2 pb-2 flex flex-col gap-15">
            <div className="flex flex-col gap-3">
                <Button 
                    className="btn-left-menu"
                    onClick={readDirData}
                >Choose directory</Button>
                <Button className="btn-left-menu">Edit part list</Button>
                <Button className="btn-left-menu">Upload or update map</Button>
            </div>

            <div className="flex flex-col gap-3">
                <Button 
                    className="btn-left-menu"
                    onClick={deserializeAndSave}
                >Deserialize and save</Button>
                <Button 
                    className="btn-left-menu"
                    onClick={serializeAndSave}
                >Serialize and save</Button>
            </div>

            <div className="flex flex-col gap-3 h-full justify-end mb-5">
                <Button className="btn-left-menu text-green">Settings</Button>
            </div>
        </div>
    );
}

export default LeftBar;