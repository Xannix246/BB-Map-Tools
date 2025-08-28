import Button from "@/base/button/Button";
import { deserializeAndSave, openJson, openPartEditor, readDirData, saveJson, serializeAndSave } from "./bar-utils";

const LeftBar = () => {
    return (
        <div className="h-screen min-w-[300px] w-[300px] pt-22 pr-2 pb-2 flex flex-col gap-15">
            <div className="flex flex-col gap-3">
                <Button 
                    className="btn-left-menu"
                    onClick={readDirData}
                >Choose directory</Button>
                <Button 
                    className="btn-left-menu"
                    onClick={async () => await openPartEditor()}
                >Edit part list</Button>
                {/* <Button className="btn-left-menu" disabled={true}>Upload/update map(wip)</Button> */}
                <Button 
                    className="btn-left-menu"
                    onClick={openJson}
                >Load json</Button>
                <Button 
                    className="btn-left-menu"
                    onClick={saveJson}
                >Save json</Button>
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
                <Button 
                    className="btn-left-menu"
                    disabled={true}
                >Open in text editor</Button>
            </div>

            <div className="flex flex-col gap-3 h-full justify-end mb-5">
                <Button className="btn-left-menu text-green" disabled={true}>Settings</Button>
            </div>
        </div>
    );
}

export default LeftBar;